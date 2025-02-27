
import React from "react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-blue-50 to-white">
      <h1 className="text-4xl font-bold mb-4 text-blue-800">Bienvenido a Dialecto Amable</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-lg">
        Una aplicación para análisis avanzado de estadísticas en fútbol
      </p>
      
      <div className="grid gap-4 max-w-md w-full">
        <Link
          to="/calculadora-xg"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg text-center transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
        >
          <span className="text-xl">⚽</span>
          <span>Calculadora xG - xGOT para Fútbol</span>
        </Link>
        
        <div className="mt-8 p-5 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">¿Qué es xG y xGOT?</h2>
          <p className="text-gray-600 text-sm">
            <strong>xG (Expected Goals):</strong> Mide la probabilidad de que un tiro se convierta en gol basado en su posición.
            <br /><br />
            <strong>xGOT (Expected Goals on Target):</strong> Evalúa la calidad de un tiro a puerta considerando tanto la posición del disparo como la del portero.
          </p>
        </div>
      </div>
    </div>
  );
}
