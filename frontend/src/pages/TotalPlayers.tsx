import { useEffect, useState } from "react";
import axios from "axios";
import Navigation from "../components/Navigation";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export default function TotalPlayersPage() {
  const [count, setCount] = useState(0);
  const [target, setTarget] = useState(0);
  useEffect(() => {
    async function getUsers() {
      try {
        const response: { data: { count: number } } = await axios.get(
          `${BACKEND_URL}/users`,
        );
        console.log(response.data);
        setTarget(response.data.count);
      } catch (err) {
        console.log(err);
      }
    }
    getUsers();
  }, []);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = 1;
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(start);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="min-h-screen bg-[#323437] flex items-center justify-center px-4">
      <Navigation />
      <div className="max-w-4xl max-sm:mt-16 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-[#2a2c31] rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center">
            <h2 className="text-slate-300 text-sm uppercase tracking-widest">
              Total Players
            </h2>
            <p className="mt-4 text-5xl sm:text-6xl font-bold text-white">
              {count.toLocaleString()}+
            </p>
            <p className="mt-2 text-[#d1d0c5] text-sm">
              players have joined Devstype
            </p>
          </div>
          <div className="bg-[#2a2c31] rounded-2xl shadow-lg p-6 flex flex-col justify-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-white">
              Devstype Community
            </h1>
            <p className="mt-3 text-[#d1d0c5] text-sm sm:text-base leading-relaxed">
              Developers from around the world improving their typing speed and
              accuracy through real-time competitive games.
            </p>
            <div className="mt-6 flex gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs bg-[#323437] text-slate-300">
                Fast
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#323437] text-slate-300">
                Competitive
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#323437] text-slate-300">
                Developer-focused
              </span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-300">
          Player count is updated periodically
        </p>
      </div>
    </div>
  );
}
