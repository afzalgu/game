import React from "react";

function Paddle({ paddleX }) {
  return <rect x={paddleX} y={580} width={150} height={15} fill="gray" />;
}

export default Paddle;
