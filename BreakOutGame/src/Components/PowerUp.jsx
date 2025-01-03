import React from 'react';

const PowerUp = ({ x, y, type }) => {
  let color = 'purple'; 

  switch (type) {
    case 'biggerPaddle':
      color = 'green';
      break;
    case 'smallerPaddle':
      color = 'red';
      break;
    case 'fasterBall':
      color = 'yellow';
      break;
    case 'slowerBall':
      color = 'blue';
      break;
    default:
      color = 'purple';
  }

  return (
    <div 
      className={`absolute w-5 h-5 rounded-full bg-${color}-500`} 
      style={{ left: `${x}px`, top: `${y}px` }} 
    />
  );
};

export default PowerUp;