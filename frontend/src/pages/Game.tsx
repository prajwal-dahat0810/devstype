import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Navigation from "../components/Navigation";
import { ReactElement, useEffect, useRef, useState } from "react";
import { ResultGraph } from "../components/ui/ResultGraph";
import { useRecoilValue } from "recoil";
import { socketAtom } from "../store/atoms/socketAtom";
import { userAtom } from "../store/atoms/userAtom";
import { paragraphAtom } from "../store/atoms/roomAtom";
import { Footer } from "../components/Footer";
import { toast } from "sonner";
export type unitType = {
  svgIcon: ReactElement;
  name: string;
  link?: string;
};
const units: unitType[] = [
  {
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    name: "Words",
  },
  {
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M9.493 2.852a.75.75 0 0 0-1.486-.204L7.545 6H4.198a.75.75 0 0 0 0 1.5h3.14l-.69 5H3.302a.75.75 0 0 0 0 1.5h3.14l-.435 3.148a.75.75 0 0 0 1.486.204L7.955 14h2.986l-.434 3.148a.75.75 0 0 0 1.486.204L12.456 14h3.346a.75.75 0 0 0 0-1.5h-3.14l.69-5h3.346a.75.75 0 0 0 0-1.5h-3.14l.435-3.148a.75.75 0 0 0-1.486-.204L12.045 6H9.059l.434-3.148ZM8.852 7.5l-.69 5h2.986l.69-5H8.852Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    name: "Numbers",
  },
  {
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    name: "Time",
  },
  {
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    name: "Zen",
  },
  {
    svgIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-4"
      >
        <path
          fillRule="evenodd"
          d="M19 5.5a4.5 4.5 0 0 1-4.791 4.49c-.873-.055-1.808.128-2.368.8l-6.024 7.23a2.724 2.724 0 1 1-3.837-3.837L9.21 8.16c.672-.56.855-1.495.8-2.368a4.5 4.5 0 0 1 5.873-4.575c.324.105.39.51.15.752L13.34 4.66a.455.455 0 0 0-.11.494 3.01 3.01 0 0 0 1.617 1.617c.17.07.363.02.493-.111l2.692-2.692c.241-.241.647-.174.752.15.14.435.216.9.216 1.382ZM4 17a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          clipRule="evenodd"
        />
      </svg>
    ),
    name: "Custom",
  },
];

const times = [20, 30, 40];
export type progressData = {
  id: number;
  userName: string;
  progress: { time: number; wpm: number; accuracy: number; totalTyped: number };
};

export default function Game() {
  const params = useParams();
  const graphRef = useRef<HTMLDivElement | null>(null);
  const socket = useRecoilValue(socketAtom);
  const roomId = params.id as string;
  const paragraph = useRecoilValue(paragraphAtom);
  const user = useRecoilValue(userAtom);
  const words = paragraph.trim().split(/\s+/);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputText, setInputText] = useState(""); // Current input
  const [correctCount, setCorrectCount] = useState(0); // Correct word count
  const [totalTyped, setTotalTyped] = useState(0); // Total characters typed
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [isTyping, setIsTyping] = useState(false); // Is typing in progress
  const [typedWords, setTypedWords] = useState<string[]>([]); // Typed words
  const [isFinished, setIsFinish] = useState<boolean>(false);
  const navigate = useNavigate();
  const [wpmData, setWpmData] = useState([
    {
      time: 0,
      wpm: 0,
      accuracy: 0,
      totalTyped: 0,
    },
  ]);

  const [progressData, setProgressData] = useState<progressData[]>([]);
  const [showGraph, setShowGraph] = useState<boolean>(false);
  const [queryParams] = useSearchParams();
  const wordsLimit: string | null = queryParams.get("wordsLimit");

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTyping) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    if (timer > 150) {
      setIsFinish(true);
      setIsTyping(false);
    }
    return () => clearInterval(interval);
  }, [isTyping]);

  useEffect(() => {
    if (isTyping) {
      setWpmData((prev) => [
        ...prev,
        {
          time: timer,
          wpm: calculateWPM(),
          accuracy: calculateAccuracy(),
          totalTyped,
        },
      ]);
      if (socket && !isFinished) {
        socket.send(
          JSON.stringify({
            event: "update-score",
            data: {
              roomId,
              time: timer,
              wpm: calculateWPM(),
              accuracy: calculateAccuracy(),
              totalTyped,
              wordsLimit,
            },
          })
        );
      }
    }
  }, [timer]);

  // send update with userId, RoomId
  const start = Math.floor(currentWordIndex / 14) * 14;
  const currentParagraph = words.slice(start, start + 14).join(" ");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const typedText = e.target.value;

    if (!isTyping) setIsTyping(true);
    setInputText(typedText);
    setTotalTyped((prev) => prev + 1);

    const currentWord = words[currentWordIndex];
    if (typedText.match(words[words.length - 1])) {
      setIsTyping(false);
      setShowGraph(true);

      setCorrectCount((prev) => prev + 1);

      inputRef.current?.blur();
    }
    if (typedText.startsWith(" ") && words.length - 1 === currentWordIndex) {
      return;
    }
    if (typedText.endsWith(" ") && words.length - 1 === currentWordIndex) {
      return;
    }
    if (typedText.endsWith(" ")) {
      const trimmedText = typedText.trim();

      // Check if the word is correct
      if (trimmedText === currentWord) {
        setCorrectCount((prev) => prev + 1);
      }
      if (trimmedText !== " ") {
        setTypedWords([...typedWords, trimmedText]);
      }

      setCurrentWordIndex((prev) => prev + 1);
      setInputText("");
    }
  };

  useEffect(() => {
    const addEvent = async (ev: any) => {
      const parsedData = await JSON.parse(ev.data);
      if (parsedData.event === "progress-update") {
        const progress = parsedData.data.progress;
        const sortedProgress = progress.sort(
          (a: any, b: any) => b.progress.totalTyped - a.progress.totalTyped
        );

        setProgressData(sortedProgress);
      }
      if (parsedData.event === "stop-update") {
        setIsFinish(true);
      }
      if (parsedData.event === "game-end") {
        setIsFinish(true);
        const toastId = toast.warning(parsedData.data.message, {
          toasterId: "global",
        });
        await new Promise((r) => setTimeout(r, 3000));
        toast.dismiss(toastId);
        navigate("/");
      }
      if (parsedData.event === "game-error") {
        const toastId = toast.error(
          parsedData.message,

          {
            toasterId: "global",
          }
        );
        await new Promise((r) => setTimeout(r, 2000));
        toast.dismiss(toastId);
      }
    };
    socket?.addEventListener("message", addEvent);
    return () => {
      socket?.removeEventListener("message", addEvent);
    };
  }, []);

  const calculateWPM = () => {
    if (timer == 0) return 0;
    return Math.round((totalTyped / 5) * (60 / timer));
  };
  const maxTotalTyped = paragraph.split("").length;
  const calculateAccuracy = () =>
    Math.round((correctCount / words.length) * 100);

  return (
    // <div className="min-h-screen bg-white flex flex-col   max-h-full w-full items-center  ">
    <div className="min-h-screen relative bg-[#323437] flex flex-col   max-h-full w-full items-center  ">
      <Navigation />
      <div className="max-w-5xl w-full min-w-[300px] flex justify-center flex-col items-center px-2  mt-12 ">
        <div className="min-h-48 h-full w-full  flex flex-grow flex-col items-center px-3 py-2">
          <div className=" w-min flex sm:my-4 max-sm:sr-only rounded-sm items-center justify-center  bg-[#2d2d33]">
            {units.map((unit) => {
              return (
                <div className="flex font-sans hover:text-[#d1d3d5]  text-[#646669] max-sm:gap-1 max-sm:px-0.5 max-sm:text-[8px] text-[10px]  py-2.5 items-center  px-2 gap-2 ">
                  <div
                    className={`${
                      unit.name === "Words" ? "text-amber-300" : ""
                    }`}
                  >
                    {unit.svgIcon}
                  </div>
                  <div
                    className={`${
                      unit.name === "Words" ? "text-amber-300" : ""
                    }`}
                  >
                    {unit.name}
                  </div>
                </div>
              );
            })}
            {times.map((time) => {
              return (
                <div className="flex max-sm:sr-only hover:text-[#d1d3d5]  text-[#646669] text-[10px]  max-sm:gap-1 max-sm:px-1 py-1.5 items-center  px-3 gap-3">
                  <div>{time}</div>
                </div>
              );
            })}
          </div>

          <div className=" mt-2  min-h-40 max-h-44 w-full max-w-3xl h-full">
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <div className="sm:sr-only flex w-max  items-center justify-center gap-2 px-4 rounded-md py-2 font-mono text-[#646669] bg-[#2c2e31] text-[12px] font-semibold">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-3"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div>Test setting</div>
              </div>
            </div>
            <p className="text-[1.7rem] font-mono box-content  gap-0.5 leading-4 max-sm:mt-3 text-[#5e6064] px-3 py-3 max-sm:px-0 flex flex-wrap">
              {currentParagraph.split(" ").map((word, index) => {
                return (
                  <span
                    key={index}
                    className={`my-[.25em] mx-[.3em] px-auto  `}
                  >
                    {word.split("").map((char, charIndex) => {
                      let classname = "";

                      if (typedWords.length > 27 && currentWordIndex > index) {
                        // console.log(typedWords, currentWordIndex, index);
                        if (currentWordIndex > index + 28) {
                          classname = " border-hidden bold text-[#d1d0c5] ";
                          if (char != typedWords[index + 28][charIndex]) {
                            classname =
                              "border-l-1 border-hidden bold text-red-500 ";
                          }
                        }
                        if (currentWordIndex === index + 28) {
                          if (charIndex === inputText.length)
                            classname = `before:border-l-1 ${
                              currentWordIndex !== 28
                                ? ""
                                : "before:animate-ping"
                            }  before:border-amber-200`;
                          else if (
                            charIndex < inputText.length &&
                            char === inputText[charIndex]
                          ) {
                            classname =
                              "before:border-l-2 before:border-hidden bold text-[#d4d3c4]";
                          } else if (
                            charIndex < inputText.length &&
                            char !== inputText[charIndex]
                          ) {
                            classname = "bold text-red-500";
                          }
                        }
                      }
                      if (
                        typedWords.length >= 14 &&
                        typedWords.length < 28 &&
                        currentWordIndex > index
                      ) {
                        // console.log(typedWords, currentWordIndex, index);
                        if (currentWordIndex > index + 14) {
                          classname = " border-hidden bold text-[#d1d0c5] ";
                          if (char != typedWords[index + 14][charIndex]) {
                            classname =
                              "border-l-1 border-hidden bold text-red-500 ";
                          }
                        }
                        if (currentWordIndex === index + 14) {
                          if (charIndex === inputText.length)
                            classname = `before:border-l-3 ${
                              currentWordIndex !== 14
                                ? ""
                                : "before:animate-ping"
                            }  before:border-amber-200`;
                          else if (
                            charIndex < inputText.length &&
                            char === inputText[charIndex]
                          ) {
                            classname =
                              "before:border-l-2 before:border-hidden bold text-[#d4d3c4]";
                          } else if (
                            charIndex < inputText.length &&
                            char !== inputText[charIndex]
                          ) {
                            classname = "bold text-red-500";
                          }
                        }
                      }
                      if (typedWords.length < 14 && currentWordIndex > index) {
                        classname = " border-hidden bold text-[#d1d0c5] ";
                        if (char != typedWords[index][charIndex]) {
                          classname =
                            "border-l-1 border-hidden bold text-red-500 ";
                        }
                      } else if (currentWordIndex === index) {
                        if (charIndex === inputText.length)
                          classname = `before:border-l-3 ${
                            currentWordIndex !== 0 ? "" : "before:animate-ping"
                          }  before:border-amber-200`;
                        // "before:border-l-1 before:animate-ping before:border-amber-200 ";
                        else if (
                          charIndex < inputText.length &&
                          char === inputText[charIndex]
                        ) {
                          classname =
                            "before:border-l-2 before:border-hidden bold text-[#d4d3c4]";
                        } else if (
                          charIndex < inputText.length &&
                          char !== inputText[charIndex]
                        ) {
                          classname = "bold text-red-500";
                        }
                      }
                      return (
                        <span
                          className={`${classname} px-auto   pr-[.4] leading-[1rem] `}
                        >
                          {char}
                        </span>
                      );
                    })}
                  </span>
                );
              })}
            </p>

            {/* Hidden Input Field */}

            <input
              ref={inputRef}
              type="text"
              // onKeyDown={handleKeyDown}
              autoFocus={true}
              className="mt-4 opacity-0 border py-2 w-10 focus:outline-none"
              value={inputText}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div
          className={` ${
            Number(wordsLimit) === 15 ? "max-sm:mt-36" : "max-sm:mt-52"
          } h-[400px] max-h-full px-3 pt-3 w-full   `}
        >
          <div className=" overflow-y-scroll custom-scrollbar max-w-3xl w-full  h-full">
            {progressData &&
              progressData.map((player) => {
                return (
                  <div
                    className={`min-h-min ${
                      Number(user.id) !== player.id
                        ? ""
                        : "border border-amber-500"
                    } row-ga w-full  grid items-center grid-8`}
                  >
                    <div className="col-span-1   flex items-center justify-center  gap-1 px-1 h-full col-start-1 ">
                      <div className="h-[30px] w-[30px] px-1 rounded-full flex justify-center items-center bg-amber-500">
                        {!player.userName
                          ? "A"
                          : player.userName.toUpperCase()[0]}
                      </div>
                      <div className=" h-full w-full relative z-0 ">
                        <div className="-top-1 w-full text-amber-200">
                          {player.userName}
                        </div>
                        <div className="bottom-1  z-0 font-mono text-[10px] flex items-start flex-row">
                          <div className="text-green-600">
                            WPM {player.progress.wpm}
                          </div>
                          <div className="ml-2 text-white">
                            Acc {player.progress.accuracy}
                            {"%"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-4 px-1 flex items-center justify-start h-full col-start-2 ">
                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-300"
                          style={{
                            width: `${
                              (player.progress.totalTyped / maxTotalTyped) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          className={`${showGraph ? "not-sr-only" : "sr-only"} mt-10 w-full  `}
        >
          <div className="grid  px-auto grid-rows-1   grid-cols-7 items-center ">
            <div className="col-span-1  row-span-1  max-sm:row-span-2 max-sm:flex-row max-sm:col-span-6 row-start-1 min-h-[250px] w-full  max-h-max p-3  h-full col-start-1 flex flex-col ">
              <div className="w-full h-full flex max-sm:text-[10px] flex-col items-center leading-none justify-center ">
                <div className="text-[#636668] font-[550] -top-1  ">wpm</div>
                <div className=" text-[#E2B714] font-mono leading-none text-[3rem]  py-0 ">
                  {calculateWPM()}
                </div>
              </div>
              <div className="w-full h-full flex max-sm:text-[10px] flex-col items-center leading-none  justify-center ">
                <div className="text-[#636668] font-[550] -top-1 text-start   ">
                  acc
                </div>
                <div className=" text-[#E2B714] font-mono  leading-none text-[3rem]  py-0 ">
                  {calculateAccuracy()}%
                </div>
              </div>
            </div>
            <div className="col-span-6  max-sm:col-span-7  row-span-1 row-start-1  col-start-2">
              <div ref={graphRef} className="w-full mt-2 ">
                {showGraph && <ResultGraph wpmData={wpmData} />}
              </div>
            </div>
            <div className=" mt-2 min-h-16  grid col-start-1 col-span-7   grid-flow-col row-span-1 row-start-2">
              <div className="w-full h-full flex flex-col items-center leading-none  justify-center ">
                <div className="text-[#636668] text-[12px] font-[550] -top-1  ">
                  test type
                </div>
                <div className=" text-[#E2B714] font-mono  text-[1rem] leading-[1.25]  py-0 ">
                  words
                </div>
              </div>
              <div className="w-full h-full flex flex-col flex-wrap items-center leading-none  justify-center ">
                <div className="text-[#636668] text-[12px] font-[550] -top-1  ">
                  total typed
                </div>
                <div className=" text-[#E2B714] font-mono  text-[1rem] leading-[1.25]  py-0 ">
                  {totalTyped}
                </div>
              </div>
              <div className="w-full h-full flex flex-col items-center leading-none  justify-center ">
                <div className="text-[#636668] text-[12px] text-wrap font-[550] -top-1  ">
                  correct count
                </div>
                <div className=" text-[#E2B714] font-mono  text-[1rem] leading-[1.25]  py-0 ">
                  {correctCount}
                </div>
              </div>

              <div className="w-full h-full flex flex-col items-center leading-none  justify-center ">
                <div className="text-[#636668] text-[12px] font-[550] -top-1  ">
                  characters
                </div>
                <div className=" text-[#E2B714] font-mono  text-[1rem] leading-[1.25]  py-0 ">
                  {maxTotalTyped}
                </div>
              </div>
              <div className="w-full h-full flex flex-col items-center leading-none  justify-center ">
                <div className="text-[#636668] text-[12px] font-[550] -top-1  ">
                  time
                </div>
                <div className=" text-[#E2B714] font-mono  text-[1rem] leading-[1.25]  py-0 ">
                  {timer}s
                </div>
              </div>
            </div>
            <div className="h-36  w-full"></div>
          </div>
        </div>
        <div className="wrapper  absolute bottom-0 left-0 w-full flex flex-col items-center gap-2">
          <Footer />
        </div>
      </div>
    </div>
  );
}
