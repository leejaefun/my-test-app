"use client";

import { useEffect, useRef, useState } from "react";

export default function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("READY"); // READY, PLAYING, GAMEOVER

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 게임 설정
    let ballRadius = 8;
    let x = canvas.width / 2;
    let y = canvas.height - 30;
    let dx = 3;
    let dy = -3;

    const paddleHeight = 10;
    const paddleWidth = 75;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    // 벽돌 설정
    const brickRowCount = 3;
    const brickColumnCount = 5;
    const brickWidth = 70;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 35;

    const bricks: any[] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }

    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
    };

    const keyUpHandler = (e: KeyboardEvent) => {
      if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
      else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    document.addEventListener("mousemove", mouseMoveHandler);

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
              dy = -dy;
              b.status = 0;
              setScore((s) => s + 10);
              if (score + 10 === brickRowCount * brickColumnCount * 10) {
                setGameState("GAMEOVER");
              }
            }
          }
        }
      }
    }

    function drawBall() {
      ctx!.beginPath();
      ctx!.arc(x, y, ballRadius, 0, Math.PI * 2);
      ctx!.fillStyle = "#0095DD";
      ctx!.fill();
      ctx!.closePath();
    }

    function drawPaddle() {
      ctx!.beginPath();
      ctx!.rect(paddleX, canvas!.height - paddleHeight, paddleWidth, paddleHeight);
      ctx!.fillStyle = "#0095DD";
      ctx!.fill();
      ctx!.closePath();
    }

    function drawBricks() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          if (bricks[c][r].status === 1) {
            const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
            const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
            bricks[c][r].x = brickX;
            bricks[c][r].y = brickY;
            ctx!.beginPath();
            ctx!.rect(brickX, brickY, brickWidth, brickHeight);
            ctx!.fillStyle = "#0095DD";
            ctx!.fill();
            ctx!.closePath();
          }
        }
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawBricks();
      drawBall();
      drawPaddle();
      collisionDetection();

      if (x + dx > canvas!.width - ballRadius || x + dx < ballRadius) dx = -dx;
      if (y + dy < ballRadius) dy = -dy;
      else if (y + dy > canvas!.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) dy = -dy;
        else {
          setGameState("GAMEOVER");
          return;
        }
      }

      if (rightPressed && paddleX < canvas!.width - paddleWidth) paddleX += 7;
      else if (leftPressed && paddleX > 0) paddleX -= 7;

      x += dx;
      y += dy;
      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [gameState]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-4">이서의 벽돌 부수기</h1>
      <div className="mb-4 text-xl">Score: {score}</div>

      <div className="relative border-4 border-white rounded-lg overflow-hidden bg-black">
        <canvas ref={canvasRef} width={480} height={320} />

        {gameState !== "PLAYING" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <h2 className="text-2xl mb-4">{gameState === "GAMEOVER" ? "Game Over!" : "Ready?"}</h2>
            <button
              onClick={() => { setScore(0); setGameState("PLAYING"); }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-full font-bold transition"
            >
              {gameState === "GAMEOVER" ? "다시 시작" : "게임 시작"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-6 text-gray-400">마우스나 화살표 키로 바를 움직이세요!</p>
    </main>
  );
}