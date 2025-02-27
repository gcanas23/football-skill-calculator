
import React, { useRef, useState, useEffect } from 'react';
import './CalculadoraXG.css';
import { toast } from "@/hooks/use-toast";

const CalculadoraXG = () => {
  const [ballPosition, setBallPosition] = useState<null | { y: number, z: number }>(null);
  const [keeperPosition, setKeeperPosition] = useState<null | { y: number, z: number }>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const goalRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);
  
  // Constantes para cálculos
  const goalWidth = 7.32;
  const goalHeight = 2.44;
  const scaleY = 732 / goalWidth;
  const scaleZ = 244 / goalHeight;

  useEffect(() => {
    toast({
      title: "Bienvenido a la Calculadora xG - xGOT",
      description: "Haz clic en el campo para registrar la posición del tiro",
    });
  }, []);

  const createMarker = (x: number, y: number, parent: HTMLElement, type: 'ball' | 'keeper') => {
    const marker = document.createElement("div");
    marker.classList.add("marker", type);
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    parent.appendChild(marker);
  };

  const logEvent = (message: string) => {
    if (logContainerRef.current) {
      const logEntry = document.createElement("div");
      logEntry.textContent = message;
      logContainerRef.current.prepend(logEntry);
    }
  };

  const handleFieldClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!fieldRef.current) return;
    
    const rect = fieldRef.current.getBoundingClientRect();
    const xPixel = event.clientX - rect.left;
    const yPixel = event.clientY - rect.top;

    const scaleFactorX = 525 / rect.width;
    const scaleFactorY = 340 / rect.height;
    
    const xPixelAdjusted = xPixel * scaleFactorX;
    const yPixelAdjusted = yPixel * scaleFactorY;

    const xMeters = (xPixelAdjusted / 5).toFixed(1);
    const yMeters = ((340 - yPixelAdjusted) / 5).toFixed(1);

    const xGoal = 105;
    const yCenter = 34;

    const distance = Math.sqrt(
      Math.pow((xGoal - parseFloat(xMeters)), 2) + 
      Math.pow((yCenter - parseFloat(yMeters)), 2)
    );
    
    const xG = (76462 / (1 + Math.exp(0.159 * (distance + 69.56)))).toFixed(2);

    const coordinatesXG = document.getElementById("coordinatesXG");
    if (coordinatesXG) {
      coordinatesXG.innerHTML = `X: ${xMeters}, Y: ${yMeters}, xG: ${xG}`;
    }
    
    logEvent(`xG registrado - X: ${xMeters}, Y: ${yMeters}, xG: ${xG}`);
    createMarker(xPixel, yPixel, fieldRef.current, "ball");

    toast({
      title: "Posición registrada",
      description: `xG calculado: ${xG}`,
    });
  };

  const handleGoalClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!goalRef.current) return;
    
    const rect = goalRef.current.getBoundingClientRect();
    const yPixel = event.clientX - rect.left;
    const zPixel = event.clientY - rect.top;

    const scaleFactorY = 732 / rect.width;
    const scaleFactorZ = 244 / rect.height;
    
    const yPixelAdjusted = yPixel * scaleFactorY;
    const zPixelAdjusted = zPixel * scaleFactorZ;

    const yMeters = Math.max(0, Math.min(goalWidth, parseFloat((yPixelAdjusted / scaleY).toFixed(2))));
    const zMeters = Math.max(0, Math.min(goalHeight, parseFloat((244 - zPixelAdjusted) / scaleZ).toFixed(2)));

    if (!ballPosition) {
      setBallPosition({ y: yMeters, z: zMeters });
      
      const coordinatesXGOT = document.getElementById("coordinatesXGOT");
      if (coordinatesXGOT) {
        coordinatesXGOT.innerHTML = `Balón: Y: ${yMeters.toFixed(2)}, Z: ${zMeters.toFixed(2)} | Portero: Y: -, Z: - | xGOT: -`;
      }
      
      createMarker(yPixel, zPixel, goalRef.current, "ball");
      
      toast({
        title: "Posición del balón registrada",
        description: "Ahora haga clic para registrar la posición del portero",
      });
    } else {
      setKeeperPosition({ y: yMeters, z: zMeters });
      
      const distance = Math.sqrt(
        Math.pow(ballPosition.y - yMeters, 2) + 
        Math.pow(ballPosition.z - zMeters, 2)
      );
      
      const xGOT = (0.128 * distance).toFixed(2);

      const coordinatesXGOT = document.getElementById("coordinatesXGOT");
      if (coordinatesXGOT) {
        coordinatesXGOT.innerHTML = `Balón: Y: ${ballPosition.y.toFixed(2)}, Z: ${ballPosition.z.toFixed(2)} | Portero: Y: ${yMeters.toFixed(2)}, Z: ${zMeters.toFixed(2)} | xGOT: ${xGOT}`;
      }
      
      logEvent(`xGOT registrado - Balón: Y: ${ballPosition.y.toFixed(2)}, Z: ${ballPosition.z.toFixed(2)} | Portero: Y: ${yMeters.toFixed(2)}, Z: ${zMeters.toFixed(2)} | xGOT: ${xGOT}`);
      createMarker(yPixel, zPixel, goalRef.current, "keeper");
      
      setBallPosition(null);
      setKeeperPosition(null);
      
      toast({
        title: "xGOT calculado",
        description: `Valor: ${xGOT}`,
      });
    }
  };

  const handleReset = () => {
    if (fieldRef.current) {
      const fieldMarkers = fieldRef.current.querySelectorAll('.marker');
      fieldMarkers.forEach(marker => marker.remove());
    }
    
    if (goalRef.current) {
      const goalMarkers = goalRef.current.querySelectorAll('.marker');
      goalMarkers.forEach(marker => marker.remove());
    }
    
    const coordinatesXG = document.getElementById("coordinatesXG");
    if (coordinatesXG) {
      coordinatesXG.innerHTML = "X: -, Y: -, xG: -";
    }
    
    const coordinatesXGOT = document.getElementById("coordinatesXGOT");
    if (coordinatesXGOT) {
      coordinatesXGOT.innerHTML = "Balón: Y: -, Z: - | Portero: Y: -, Z: - | xGOT: -";
    }
    
    setBallPosition(null);
    setKeeperPosition(null);
    
    toast({
      title: "Reiniciado",
      description: "Se han eliminado todos los marcadores",
    });
  };

  return (
    <div className="calculadora-container">
      <h2>Calculadora xG - xGOT: Fútbol</h2>
      
      <div className="container">
        <div className="field" id="footballField" ref={fieldRef} onClick={handleFieldClick}></div>
        <div className="coordinates" id="coordinatesXG">X: -, Y: -, xG: -</div>
        <div className="goal" id="goalArea" ref={goalRef} onClick={handleGoalClick}></div>
        <div className="coordinates" id="coordinatesXGOT">Balón: Y: -, Z: - | Portero: Y: -, Z: - | xGOT: -</div>
        <button 
          onClick={handleReset}
          className="reset-button"
        >
          Reiniciar marcadores
        </button>
      </div>
      
      <h3>Registros:</h3>
      <div className="log" id="logContainer" ref={logContainerRef}></div>
    </div>
  );
};

export default CalculadoraXG;
