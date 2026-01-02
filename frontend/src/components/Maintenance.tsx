export default function Maintenance() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#323437] text-[#d1d0c5] font-mono">
      <div className="text-center px-6">
        <div className="text-5xl mb-4 animate-pulse">⌨️</div>

        <h1 className="text-3xl font-semibold mb-3">We’re tuning things up</h1>

        <p className="text-[#5e6064] text-lg mb-6">
          Quick maintenance in progress to improve your typing experience.
        </p>

        <div className="flex justify-center gap-2 text-amber-500">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce delay-150">.</span>
          <span className="animate-bounce delay-300">.</span>
        </div>

        <p className="mt-6 text-sm text-[#5e6064]">
          We’ll be back shortly. Thanks for waiting.
        </p>
      </div>
    </div>
  );
}
