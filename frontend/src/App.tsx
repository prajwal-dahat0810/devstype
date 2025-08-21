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
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      {" "}
      <ToastContainer />
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
