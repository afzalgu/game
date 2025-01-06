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
const BRICK_WIDTH =
  (GAME_WIDTH - BRICK_GAP * (BRICK_COLUMNS - 1)) / BRICK_COLUMNS;
const BRICK_HEIGHT = 30;
const COLORS = ["red", "green", "blue", "yellow", "purple", "green"];

function Game() {
  const [level, setLevel] = useState(1);
  const [paddleX, setPaddleX] = useState(
    GAME_WIDTH / 2 - INITIAL_PADDLE_WIDTH / 2
  );
  const [balls, setBalls] = useState([
    {
      id: 1,
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
      dx: 4,
      dy: -4,
      lastBrickColor: null,
    },
  ]);
  const [bricks, setBricks] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(4);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const paddleWidth = INITIAL_PADDLE_WIDTH + level * 20;

  useEffect(() => {
    const createBricks = () => {
      const newBricks = [];
      const rows = Math.min(level + 1, 5);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < BRICK_COLUMNS; col++) {
          newBricks.push({
            id: `${row}-${col}`,
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
          let { id, x, y, dx, dy, lastBrickColor } = prev;

          if (x + dx > GAME_WIDTH - BALL_RADIUS || x + dx < BALL_RADIUS) {
            dx = -dx;
          }
          if (y + dy < BALL_RADIUS) {
            dy = -dy;
          }

          if (
            y + dy > GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS &&
            x > paddleX &&
            x < paddleX + paddleWidth
          ) {
            dy = -dy;
          }

          if (y + dy > GAME_HEIGHT) {
            setLives((prev) => prev - 1);
            if (lives <= 0) {
              setGameOver(true);
            }
            return {
              ...prev,
              x: GAME_WIDTH / 2,
              y: GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
              dx: 4,
              dy: -4,
              lastBrickColor: null,
            };
          }

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

              if (level === 2 && lastBrickColor === brick.color) {
                setScore((prev) => prev + 50);
                triggerBonusAnimation(
                  brick.x + brick.width / 2,
                  brick.y + brick.height / 2,
                  50
                );
              }

              triggerBrickBreakAnimation(brick.x, brick.y);

              prev.lastBrickColor = brick.color;

              return { ...brick, hit: true };
            }
            return brick;
          });

          setBricks(newBricks);

          if (newBricks.every((brick) => brick.hit)) {
            if (level < 3) {
              setLevel((prev) => prev + 1);
              setWin(false);

              setBalls(
                Array.from({ length: level + 1 }, (_, i) => ({
                  id: i + 1,
                  x: GAME_WIDTH / 2 + i * 20,
                  y: GAME_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS - 10,
                  dx: 4 + i,
                  dy: -(4 + i),
                  lastBrickColor: null,
                }))
              );
            } else {
              setWin(true);
            }
          }

          return { id, x: x + dx, y: y + dy, dx, dy, lastBrickColor };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, [paddleX, bricks, lives, gameOver, win, level]);

  const triggerBrickBreakAnimation = (x, y) => {
    const animationDiv = document.createElement("div");
    animationDiv.className =
      "absolute transform -translate-x-1/2 -translate-y-1/2 text-4xl animate-ping text-red-500";
    animationDiv.style.left = `${x}px`;
    animationDiv.style.top = `${y}px`;
    animationDiv.style.pointerEvents = "none";
    animationDiv.innerText = "💥";
    document.body.appendChild(animationDiv);

    setTimeout(() => {
      document.body.removeChild(animationDiv);
    }, 500);
  };

  const triggerBonusAnimation = (x, y, points) => {
    const bonusDiv = document.createElement("div");
    bonusDiv.className =
      "absolute text-green-500 text-3xl font-bold animate-bounce";
    bonusDiv.style.left = `${x}px`;
    bonusDiv.style.top = `${y}px`;
    bonusDiv.style.pointerEvents = "none";
    bonusDiv.innerText = `+${points}`;
    document.body.appendChild(bonusDiv);

    setTimeout(() => {
      document.body.removeChild(bonusDiv);
    }, 500);
  };

  return (
    <div>
      <ScoreDisplay />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <div className=" flex flex-row gap-64">
          <div className="font-bold text-2xl">Level: {level}</div>
          <div className="font-bold text-2xl">Score: {score}</div>
          <div className="font-bold text-2xl">Lives: {lives}</div>
        </div>
      </div>

      <svg
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        className="border-4 border-black rounded-lg shadow-2xl transition duration-500 ease-in-out transform hover:scale-105 hover:shadow-3xl"
        style={{ marginTop: "20px" }}
      >
        {gameOver && (
          <text
            x={GAME_WIDTH / 2 - 50}
            y={GAME_HEIGHT / 2}
            fontSize="30"
            fill="red"
            fontFamily="serif"
            text="center"
          >
            Game Over😒
          </text>
        )}
        {win && level === 3 && (
          <text
            x={GAME_WIDTH / 2 - 50}
            y={GAME_HEIGHT / 2}
            fontSize="30"
            fill="green"
          >
            You Win😍
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
