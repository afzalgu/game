import React from 'react';

const WinScreen = ({ onNextLevel }) => (
  <div 
    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50" 
  >
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">You Win!❣️</h1>
      <button 
        className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded" 
        onClick={onNextLevel}
      >
        Next Level
      </button>
    </div>
  </div>
);

export default WinScreen;