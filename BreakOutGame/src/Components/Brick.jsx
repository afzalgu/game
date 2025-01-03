import React from "react";

function Bricks({ bricks }) {
  return (
    <>
      {bricks.map((brick, index) =>
        !brick.hit ? (
          <rect
            key={index}
            x={brick.x}
            y={brick.y}
            width={brick.width}
            height={brick.height}
            fill={brick.color}
          className="mt-20" />
        ) : null
      )}
    </>
  );
}

export default Bricks;