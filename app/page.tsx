import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-12 text-center bg-gradient-to-b from-gray-900 to-black text-white">
      {/* 1. 큰 글씨 제목 */}
      <h1 className="text-6xl font-extrabold mb-8 tracking-tight animate-pulse">
        이서의 공간
      </h1>

      {/* 2. 사진 영역 (동그랗게 꾸밈) */}
      <div className="relative w-64 h-64 mb-8 rounded-full overflow-hidden border-4 border-indigo-500 shadow-2xl shadow-indigo-500/50">
        {/* 아래 src="/my-photo.jpg" 부분을 본인이 넣은 파일명으로 꼭 바꿔주세요! */}
        <Image
          src="/2seo.JPG"
          alt="이서의 대표 사진"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* 3. 부가 설명 */}
      <p className="text-xl text-gray-300 max-w-md leading-relaxed">
        반갑습니다! 이곳은 저의 이야기와 프로젝트를 담는 소중한 공간입니다. 편안하게 머물다 가세요.
      </p>
    </main>
  );
}