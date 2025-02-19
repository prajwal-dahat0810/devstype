import "./App.css";
import { RecoilRoot } from "recoil";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import Room from "./pages/Room";
import Game from "./pages/Game";
import About from "./pages/About";
import Setting from "./pages/Setting";
function App() {
  return (
    <>
      <RecoilRoot>
        <BrowserRouter>
          <Routes>
            <Route path="/room" element={<Room />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/" element={<Landing />} />
            <Route path="/about" element={<About />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/room/:id" element={<Game />} />
          </Routes>
        </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
