import "./App.css";
import { RecoilRoot } from "recoil";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Room from "./pages/Room";
import Game from "./pages/Game";
import About from "./pages/About";
import History from "./pages/History";
import Setting from "./pages/Setting";
import { Analytics } from "@vercel/analytics/react";
// import { ToastContainer } from "react-toastify";
import { Toaster } from "sonner";
import Maintenance from "./components/Maintenance";
function App() {
  const isMaintenance = import.meta.env.VITE_MAINTENANCE_MODE as string;
  if (isMaintenance) {
    return (
      <>
        <Maintenance />
      </>
    );
  }

  return (
    <>
      <Toaster
        id="global"
        toastOptions={{
          classNames: {
            toast: "!bg-[#323437] !border-2 !border[#6cb4ee]",
            success: "!bg-[#7FD88B]/9 !border-2 !border-[#7fd88b] !text-white ",
            error: "!bg-[#FF6B6B]/9 !border-2 !border-[#ff6b6b] !text-white",
            loading: "!bg-[#545f69]/9 !border-2 !border-[#6CB4EE] !text-white",
            warning: "!bg-[#F5C542]/9 !border-2 !border-[#f5c542] !text-white",
            info: "!bg-[#6CB4EE]/9 !border-2 !border-[#6cb4ee] !text-white",
          },
        }}
        position={window.innerWidth > 425 ? "top-right" : "top-center"}
      />
      <Toaster
        id="smallScreen"
        toastOptions={{
          classNames: {
            toast: "!bg-[#323437] !border-2 !border[#6cb4ee]",
            success: "!bg-[#7FD88B]/9 !border-2 !border-[#7fd88b] !text-white ",
            error: "!bg-[#FF6B6B]/9 !border-2 !border-[#ff6b6b] !text-white",
            loading: "!bg-[#545f69]/9 !border-2 !border-[#6CB4EE] !text-white",
          },
        }}
        position="top-center"
      />
      <Toaster
        id="bigScreen"
        toastOptions={{
          classNames: {
            toast: "!bg-[#323437] !border-2 !border[#6cb4ee]",
            success: "!bg-[#7FD88B]/9 !border-2 !border-[#7fd88b] !text-white ",
            error: "!bg-[#FF6B6B]/9 !border-2 !border-[#ff6b6b] !text-white",
            loading: "!bg-[#545f69]/9 !border-2 !border-[#6CB4EE] !text-white",
          },
        }}
      />
      <Analytics />
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/room" element={<Room />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/" element={<Landing />} />
            <Route path="/history" element={<History />} />
            <Route path="/about" element={<About />} />
            <Route path="/account-settings" element={<Setting />} />
            <Route path="/room/:id" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
