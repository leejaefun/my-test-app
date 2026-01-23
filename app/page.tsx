"use client";

import { useEffect, useRef, useState } from "react";

export default function BrickBreaker() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState("READY");

  // 캔버스 크기를 세로로 길게 정의 (스마트폰 비율에 맞춤)
  const CANVAS_WIDTH = 360;
  const CANVAS_HEIGHT = 640;

  useEffect(() => {
    if (gameState !== "PLAYING") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 배경 이미지 설정
    const bgImage = new Image();
    bgImage.src = "/2seo.JPG";

    // 게임 설정
    let ballRadius = 10; // 화면이 커져서 공도 약간 키움
    let x = canvas.width / 2;
    let y = canvas.height - 50; // 시작 위치 조정
    let dx = 4;  // 속도 약간 증가
    let dy = -4;

    const paddleHeight = 12;
    const paddleWidth = 80;
    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    // 벽돌 설정 (세로 화면에 맞게 배치 조정)
    const brickRowCount = 6;    // 세로가 길어져서 행을 늘림
    const brickColumnCount = 6; // 가로가 좁아져서 열을 줄임 (총 36개)
    const brickWidth = 45;
    const brickHeight = 18;
    const brickPadding = 10;
    const brickOffsetTop = 50;
    const brickOffsetLeft = 25;

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
      ctx!.fillStyle = "#FF0000";
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
            ctx!.fillStyle = "rgba(0, 149, 221, 0.7)";
            ctx!.fill();
            ctx!.closePath();
          }
        }
      }
    }

    function draw() {
      ctx!.drawImage(bgImage, 0, 0, canvas!.width, canvas!.height);
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
    if (bgImage.complete) draw();

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
      document.removeEventListener("mousemove", mouseMoveHandler);
    };
  }, [gameState]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4">이서의 특별한 공간</h1>
      <div className="mb-4 text-xl font-mono">Score: {score}</div>

      <div className="relative border-8 border-indigo-900 rounded-xl overflow-hidden shadow-2xl">
        {/* 캔버스 크기를 상단에서 정의한 변수로 설정 */}
        <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} className="block" />

        {gameState !== "PLAYING" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <h2 className="text-3xl font-bold mb-6">
              {gameState === "GAMEOVER" ? (score === 360 ? "🎉 축하합니다!" : "Game Over") : "준비되셨나요?"}
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

      <p className="mt-6 text-indigo-300 font-medium italic text-center">"내 사진 뒤에 숨은 벽돌을 모두 깨뜨려보세요!"</p>
    </main>
  );
}