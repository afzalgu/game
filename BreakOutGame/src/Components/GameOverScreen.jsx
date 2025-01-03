import React from 'react';

const GameOverScreen = ({ onRestart }) => (
  <div 
    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" 
  >
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-4xl mb-4 text-orange-600 font-bold ">Game Over!😒</h1>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded" 
        onClick={onRestart}
      >
        Restart
      </button>
    </div>
  </div>
);

export default GameOverScreen;