import { Footer } from "../components/Footer";
import Navigation from "../components/Navigation";

export default function About() {
  return (
    <div className="min-h-screen relative bg-[#323437] flex flex-col flex-grow   max-h-full w-full items-center  ">
      <Navigation />
      <div className="mt-16 h-full py-3 px-3   max-w-5xl w-full">
        <div className=" py-2 px-3 flex w-full justify-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center text-2xl font-serif font-[1000] justify-center text-[#323437]  bg-[#646669]">
            i
          </div>
          <div className="text-[#646669] font-mono text-2xl">about</div>
        </div>
        <div className="text-[#D1D0C5] font-mono my-2 flex  flex-col gap-3 flex-grow space-between text-wrap px-3">
          <div>
            This is develop only for side project that helps people to chill and
            helps to better his typing speed with competition.
            <br />
            Test yourself in words mode, track your progress and improve your
            speed.
            <br />
            Results will show your word count other metric like accuracy, words
            per minute.
            <br />
          </div>
          <div>
            Develop by{" "}
            <span
              onClick={() =>
                (window.location.href = "https://x.com/DahatPrajw56411")
              }
              className="bg-[#646669] hover:bg-[#7b7e84] hover:text-[#D1D0C5] text-[#2f3134] rounded-[2px] cursor-pointer px-1 "
            >
              Prajwal Dahat
            </span>{" "}
            !!!
          </div>
        </div>{" "}
        <div className="text-[#D1D0C5] mt-20 font-mono  ">
          Any suggestion to make this better ?
        </div>
      </div>
      <div className="bottom-0">
        <Footer />
      </div>
    </div>
  );
}
