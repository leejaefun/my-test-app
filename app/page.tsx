"use client";

import { useEffect, useRef, useState } from "react";

export default function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("READY");

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 배경 이미지 설정
    const bgImage = new Image();
    bgImage.src = "/2seo.JPG"; // public 폴더의 이미지 경로

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

    // 벽돌 설정 (개수를 늘리기 위해 크기와 간격 조정)
    const brickRowCount = 4;    // 행 늘림
    const brickColumnCount = 8; // 열 늘림 (총 32개)
    const brickWidth = 45;      // 벽돌 폭 줄임
    const brickHeight = 15;
    const brickPadding = 8;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

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
      const relativeX = e.clientX - canvas.getBoundingClientRect().left;
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
      ctx!.fillStyle = "#FFD700"; // 공 색상을 눈에 띄게 변경 (골드)
      ctx!.fill();
      ctx!.stroke();
      ctx!.closePath();
    }

    function drawPaddle() {
      ctx!.beginPath();
      ctx!.rect(paddleX, canvas!.height - paddleHeight, paddleWidth, paddleHeight);
      ctx!.fillStyle = "#ffffff";
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
            ctx!.fillStyle = "rgba(0, 149, 221, 0.7)"; // 약간 투명한 파란색
            ctx!.fill();
            ctx!.closePath();
          }
        }
      }
    }

    function draw() {
      // 배경 이미지 그리기 (지우기 대신 이미지를 덮어씌움)
      ctx!.drawImage(bgImage, 0, 0, canvas!.width, canvas!.height);
      // 배경을 약간 어둡게 처리하여 게임 가독성 높임
      ctx!.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx!.fillRect(0, 0, canvas!.width, canvas!.height);

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

    bgImage.onload = () => {
      draw();
    };
    // 이미지가 이미 로드된 경우 대응
    if (bgImage.complete) draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [gameState]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-4">이서의 특별한 공간</h1>
      <div className="mb-4 text-xl font-mono">Score: {score}</div>

      <div className="relative border-8 border-indigo-900 rounded-xl overflow-hidden shadow-2xl">
        <canvas ref={canvasRef} width={480} height={320} className="block" />

        {gameState !== "PLAYING" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-3xl font-bold mb-6">
              {gameState === "GAMEOVER" ? (score === 320 ? "🎉 축하합니다! 클리어!" : "Game Over") : "준비되셨나요?"}
            </h2>
            <button
              onClick={() => { setScore(0); setGameState("PLAYING"); }}
              className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-full font-black text-xl shadow-lg transition-transform hover:scale-105"
            >
              {gameState === "GAMEOVER" ? "다시 도전" : "게임 시작"}
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-indigo-300 font-medium italic">"내 사진 뒤에 숨은 벽돌을 모두 깨뜨려보세요!"</p>
    </main>
  );
}