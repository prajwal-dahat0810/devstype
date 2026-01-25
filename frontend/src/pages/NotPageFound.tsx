import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#323437] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-white">404</h1>
        <p className="mt-4 text-xl text-[#d1d0c5]">Page not found</p>
        <p className="mt-2 text-sm text-[#d1d0c5]">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/"
            className="px-5 py-2 rounded-xl bg-white text-[#323437] text-sm font-semibold hover:opacity-90 transition"
          >
            Go Home
          </Link>
          <a
            href="/"
            className="px-5 py-2 rounded-xl border border-[#d1d0c5] text-[#d1d0c5] text-sm hover:bg-[#2a2c31] transition"
          >
            Start Typing
          </a>
        </div>

        <p className="mt-10 text-xs text-[#d1d0c5]">
          Lost in code? Happens to the best of us.
        </p>
      </div>
    </div>
  );
}
