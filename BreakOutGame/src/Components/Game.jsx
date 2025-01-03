import React, { useState, useEffect } from "react";
import Paddle from "../Components/Paddle";
import Ball from "../Components/Ball";
import Bricks from "../Components/Brick";
import ScoreDisplay from "../Components/ScoreDisplay";


const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const INITIAL_PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
const BRICK_COLUMNS = 4;
const BRICK_GAP = 10;
const BRICK_WIDTH = (GAME_WIDTH - BRICK_GAP * (BRICK_COLUMNS - 1)) / BRICK_COLUMNS;
const BRICK_HEIGHT = 30;
const COLORS = ["red", "green", "blue", "yellow", "purple", "green"];

function Game() {
  const [level, setLevel] = useState(1);
  const [paddleX, setPaddleX] = useState(GAME_WIDTH / 2 - INITIAL_PADDLE_WIDTH / 2);
  const [balls, setBalls] = useState([
    { x: GAME_WIDTH / 2, y: GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10, dx: 4, dy: -4 },
  ]);
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const paddleWidth = INITIAL_PADDLE_WIDTH + level * 20;

  useEffect(() => {
    const createBricks = () => {
      const newBricks = [];
      const rows = Math.min(level + 1, 5); // Increment rows with levels (max 5 rows)
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < BRICK_COLUMNS; col++) {
          newBricks.push({
            x: col * (BRICK_WIDTH + BRICK_GAP),
            y: row * (BRICK_HEIGHT + BRICK_GAP),
            width: BRICK_WIDTH,
            height: BRICK_HEIGHT,
            color: COLORS[row % COLORS.length],
            hit: false,
          });
        }
      }
      return newBricks;
    };

    setBricks(createBricks());
  }, [level]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      setPaddleX((prev) => Math.max(prev - 40, 0));
    } else if (e.key === "ArrowRight") {
      setPaddleX((prev) => Math.min(prev + 40, GAME_WIDTH - paddleWidth));
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gameOver || win) return;

      setBalls((prevBalls) =>
        prevBalls.map((prev) => {
          let { x, y, dx, dy } = prev;

          // Ball collision with walls
          if (x + dx > GAME_WIDTH - BALL_RADIUS || x + dx < BALL_RADIUS) {
            dx = -dx;
          }
          if (y + dy < BALL_RADIUS) {
            dy = -dy;
          }

          // Ball collision with paddle
          if (
            y + dy > GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS &&
            x > paddleX &&
            x < paddleX + paddleWidth
          ) {
            dy = -dy;
          }

          // Ball falls below the paddle
          if (y + dy > GAME_HEIGHT) {
            setLives((prev) => prev - 1);
            if (lives <= 1) {
              setGameOver(true);
            }
            return {
              ...prev,
              x: GAME_WIDTH / 2,
              y: GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
              dx: 4,
              dy: -4,
            };
          }

          // Ball collision with bricks
          const newBricks = bricks.map((brick) => {
            if (
              !brick.hit &&
              x + dx > brick.x &&
              x + dx < brick.x + brick.width &&
              y + dy > brick.y &&
              y + dy < brick.y + brick.height
            ) {
              setScore((prev) => prev + 10);
              dy = -dy;

              // Trigger bomb animation at the brick's position
              triggerBombAnimation(brick.x + brick.width / 2, brick.y + brick.height / 2);

              return { ...brick, hit: true };
            }
            return brick;
          });

          setBricks(newBricks);

          // Check for level completion
          if (newBricks.every((brick) => brick.hit)) {
            if (level < 3) {
              setLevel((prev) => prev + 1);
              setWin(false);

              // Create balls for the next level
              setBalls(
                Array.from({ length: level + 1 }, (_, i) => ({
                  x: GAME_WIDTH / 2 + i * 20,
                  y: GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
                  dx: 4 + i,
                  dy: -(4 + i),
                }))
              );
            } else {
              setWin(true);
            }
          }

          return { x: x + dx, y: y + dy, dx, dy };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [paddleX, bricks, lives, gameOver, win, level]);

  // Function to trigger bomb animation
  const triggerBombAnimation = (x, y) => {
    // Create a bomb div dynamically
    const bomb = document.createElement("div");
    bomb.className =
      "absolute bg-red-500 rounded-full w-12 h-12 animate-[scaleFade_0.5s_ease-in-out]"; // Custom animation class
    bomb.style.left = `${x}px`; // Set bomb position (x-coordinate)
    bomb.style.top = `${y}px`; // Set bomb position (y-coordinate)`
    bomb.style.transform = "translate(-50%, -50%)"; // Center the bomb
    bomb.style.pointerEvents = "none"; // Ignore clicks on the bomb
    document.body.appendChild(bomb);
  
    // Remove the bomb after animation completes (500ms)
    setTimeout(() => {
      document.body.removeChild(bomb);
    }, 500);
  };
  

  return (
    <div>
      <ScoreDisplay />
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <div className=" flex flex-row gap-64">
          <div className="font-bold">Level: {level}</div>
          <div className="font-bold">Score: {score}</div>
          <div className="font-bold">Lives: {lives}</div>
        </div>
      </div>

      <svg
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{ border: "1px solid black", marginTop: "20px" }}
      >
        {gameOver && (
          <text x={GAME_WIDTH / 2 - 50} y={GAME_HEIGHT / 2} fontSize="30" fill="red">
            Game Over
          </text>
        )}
        {win && level === 3 && (
          <text x={GAME_WIDTH / 2 - 50} y={GAME_HEIGHT / 2} fontSize="30" fill="green">
            You Win!
          </text>
        )}
        <Paddle paddleX={paddleX} width={paddleWidth} />
        {balls.map((ball, index) => (
          <Ball key={index} ball={ball} />
        ))}
        <Bricks bricks={bricks} />
      </svg>
    </div>
  );
}

export default Game;
