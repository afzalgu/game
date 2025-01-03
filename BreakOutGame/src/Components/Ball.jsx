import React from "react";

function Ball({ ball }) {
  return <circle cx={ball.x} cy={ball.y} r={10} fill="blue" />;
}

export default Ball;