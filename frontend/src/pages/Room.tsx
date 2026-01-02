import { useRecoilValue, useSetRecoilState } from "recoil";
import { roomAtom } from "../store/atoms/testAtom";
import Navigation from "../components/Navigation";
import { useNavigate, useSearchParams } from "react-router-dom";
import { socketAtom } from "../store/atoms/socketAtom";
import { userAtom } from "../store/atoms/userAtom";
import { paragraphAtom } from "../store/atoms/roomAtom";
// import { Bounce, toast, ToastContainer } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { Messages, messageType } from "../components/Messages";
import { Footer } from "../components/Footer";
import { toast } from "sonner";
export default function Room() {
  const navigate = useNavigate();
  const setParagraph = useSetRecoilState(paragraphAtom);
  const { roomId, createdBy, startAt, finishAt, ...room } =
    useRecoilValue(roomAtom);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<messageType[]>([]);
  const [searchParams] = useSearchParams();
  const [gameType, setGameType] = useState(searchParams.get("gameType"));
  const [wordsLimit, setWordsLimit] = useState(searchParams.get("wordsLimit"));
  const roomLeavedRef: any = useRef(null);
  const setRoom = useSetRecoilState(roomAtom);
  const user = useRecoilValue(userAtom);
  // const { socket, setSocket }: any = useWebSocket();
  const socket: any = useRecoilValue(socketAtom);
  let loadId: string | number;
  function handleLeaveGame() {
    loadId = toast.loading("Leaving room...", {
      toasterId: "global",
    });
    if (socket) {
      // Remove existing listener before adding a new one
      socket.removeEventListener("message", handleMessage);

      socket.send(
        JSON.stringify({
          event: "leave-room",
          data: { roomId: roomId, gameType, wordsLimit, player: user },
        })
      );

      // Define the handler function separately
      async function handleMessage(event: { data: string }) {
        const { event: eventName, data: data } = JSON.parse(event.data);
        console.log(JSON.stringify(event));
        if (eventName === "room-deleted") {
          await new Promise((r) => setTimeout(r, 1000));
          roomLeavedRef.current = toast.warning(data.message, {
            toasterId: "global",
            id: loadId,
          });

          toast.dismiss(roomLeavedRef.current);
          roomLeavedRef.current = null;
          navigate("/");
        }
        if (eventName === "room-leaved") {
          roomLeavedRef.current = toast.info(
            `Room leaved by ${user.userName.slice(0, 20)}...`,
            {
              toasterId: "global",
              id: loadId,
            }
          );

          setTimeout(() => {
            roomLeavedRef.current = null;
            setRoom(() => data.room);

            navigate("/");
          }, 3000);
          return;
        }

        if (eventName === "admin-leaved") {
          roomLeavedRef.current = toast.info(data.message, {
            toasterId: "global",
          });

          toast.dismiss(roomLeavedRef.current);
          setRoom(data.room);
          roomLeavedRef.current = null;
          navigate("/");
          return;
        }

        // Cleanup: Remove the event listener once handled
        socket.removeEventListener("message", handleMessage);
      }

      // Attach the event listener
      socket.addEventListener("message", handleMessage);
    }
  }
  useEffect(() => {
    const messageHandler = async function (event: { data: string }) {
      const { event: eventName, data: data } = JSON.parse(event.data);

      if (eventName === "player-join") {
        console.log(data);

        toast.info(data.message, {
          toasterId: "global",
          id: loadId,
        });
        setRoom(() => data.room);
      }

      if (eventName === "game-started") {
        await new Promise((p) => setTimeout(p, 1000));

        // await new Promise((p) => setTimeout(p, 1000));
        const roomId = data.room.roomId;
        setParagraph(data.paragraph);
        navigate(`/room/${roomId}?wordsLimit=${data.wordsLimit}`);
      }
      if (eventName === "admin-room-leaved") {
        const adminName = data.player.userName;
        roomLeavedRef.current = toast.warning(
          `Room admin ${adminName}Leaved!`,
          {
            toasterId: "global",
            id: loadId,
          }
        );
        await new Promise((r) => setTimeout(r, 1000));
        toast.dismiss(roomLeavedRef.current);
        roomLeavedRef.current = null;
        setGameType(data.gameType);
        setWordsLimit(data.wordsLimit);
        setRoom(() => data.room);
      }
      if (eventName === "admin-leaved") {
        // roomLeavedRef.current = toast.info(`New admin ${data.admin}`, {
        //   toasterId: "global",
        //   id: loadId,
        // });
        // await new Promise((r) => setTimeout(r, 2000));
        toast.dismiss(loadId);
        roomLeavedRef.current = null;
        navigate("/");
      }
      if (eventName === "room-leave") {
        const leavedPlayer = data.player;
        roomLeavedRef.current = toast.info(
          `Room Leaved by ${leavedPlayer.userName}!`,
          {
            toasterId: "global",
            id: loadId,
          }
        );
        await new Promise((r) => setTimeout(r, 1000));
        toast.dismiss(roomLeavedRef.current);
        roomLeavedRef.current = null;
        setRoom(data.room);
      }

      if (eventName === "room-error") {
        roomLeavedRef.current = toast.error(data.message, {
          toasterId: "global",
          id: loadId,
        });

        await new Promise((r) => setTimeout(r, 2000));

        toast.dismiss(roomLeavedRef.current);
        roomLeavedRef.current = null;
        setRoom(data.room);
      }
    };
    socket.addEventListener("message", messageHandler);
    return () => {
      socket?.removeEventListener("message", messageHandler);
    };
  }, []);

  function handleStartGame() {
    loadId = toast.loading("Initializing game ...", {
      toasterId: "global",
    });
    if (socket) {
      socket.send(
        JSON.stringify({
          event: "start-game",
          data: { roomId: roomId, wordsLimit, gameType },
        })
      );
      socket.addEventListener("message", async function (event: { data: any }) {
        const { event: eventName, data: data } = JSON.parse(event.data);
        if (eventName === "game-error") {
          const toastId = toast.error(data.message, {
            toasterId: "global",
            id: loadId,
          });

          await new Promise((r) => setTimeout(r, 1000));
          toast.dismiss(toastId);
        }
        if (eventName === "game-started") {
          await new Promise((p) => setTimeout(p, 1000));
          toast.warning("Game starting...", {
            toasterId: "global",
            id: loadId,
          });
          // await new Promise((p) => setTimeout(p, 1000));
          const roomId = data.room.roomId;
          setParagraph(data.paragraph);
          navigate(`/room/${roomId}?wordsLimit=${data.wordsLimit}`);
        }
        if (eventName === "room-error-creating") {
          roomLeavedRef.current = toast.error(data.message, {
            toasterId: "global",
            id: loadId,
          });
          await new Promise((r) => setTimeout(r, 2000));
          toast.dismiss(roomLeavedRef.current);
          roomLeavedRef.current = null;
          navigate(`/`);
        }
      });
    } else {
      console.error("Socket is not connected yet");
    }
  }
  function handleMessage() {
    if (messageInput.length === 0) {
      toast.warning("message is empty", {
        toasterId: "global",
        id: loadId,
      });
      return;
    }
    if (socket !== null) {
      socket.send(
        JSON.stringify({
          event: "send-message",
          data: {
            message: messageInput,
            userName: user.userName,
            id: user.id,
            roomId,
          },
        })
      );
      setMessageInput("");

      socket.onmessage = async function (event: { data: string }) {
        const { event: eventName, data: data } = JSON.parse(event.data);
        if (eventName === "get-message") {
          console.log(" data received:", data);
          setMessages((prev) => [
            ...prev,
            {
              id: data.id,
              userName: data.userName,
              message: data.message,
            },
          ]);
        }
      };
    }
  }

  return (
    <div className="min-h-screen  flex flex-col bg-[#27282b] px-2   max-h-full min-w-full items-center  ">
      <Navigation />
      <div className="mt-14 gap-3  max-w-5xl w-full max-sm:flex-col max-sm:items-center  mb-2 py-3 rounded-md font-roboto px-2 flex-grow bg-[#3c3e42]  flex  justify-evenly items-stretch ">
        <div className="max-w-xl  w-full min-h-[440px]  h-[300px] mt-5  flex flex-col gap-3">
          <div className="flex font-lexand py-1 flex-col text-[#d1d0c5] font-[600] text-[2rem] px-3 ">
            <div>
              Room | <span>{roomId}</span>
            </div>
            <div>
              T | <span>{wordsLimit}</span>
            </div>
          </div>
          <div className="max-h-[320px] max-sm:max-h-[360px]  py-2  flex w-full  flex-col">
            <div className=" rounded-md  bg-[#363638] h-full  max-sm:max-h-[360px] my-2  py-2 overflow-y-scroll custom-scrollbar">
              <Messages messages={messages} />
            </div>
            <div className=" flex flex-row gap-2   justify-between">
              <input
                placeholder="Enter a message ..."
                className="w-full text-[.84rem] placeholder-[#515254] bg-[#2b2d30] py-2 px-2 text-[#d1d0c5] outline-none rounded-sm"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                onClick={handleMessage}
                className="bg-green-500 hover:bg-green-600 cursor-pointer rounded-md px-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="#ffffff"
                  className="size-4"
                >
                  <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-xs justify-between max-sm:mt-8 w-full   min-h-[400px] max-h-[500px] flex flex-col  gap-3">
          <div>
            <div className="flex pl-2 md:pr-5 pr-2  pt-2 items-center justify-between">
              <div className=" w-max text-[#d1d0c5]">
                Joined Typists {` (${room.players.length})`}
              </div>
            </div>
            <div className="flex  flex-col h-full">
              <div className="text-[12px] px-2 text-[#646669] flex justify-between">
                <div>#</div>
                <div>#username</div>
                <div>Created By</div>
              </div>
              {/* min-h-[120px] max-h-[330px] */}
              <div className="mt-3 overflow-y-scroll max-sm:h-full text-[#D1D0C5] custom-scrollbar">
                {room.players.map((player) => {
                  return (
                    <div
                      key={player.id}
                      className={`flex  items-center text-[12.8px] rounded-[2px]  ${
                        player.id % 2 === 1 ? "bg-[#3c3e42]" : "bg-[#2b2d30]"
                      }  justify-between py-[6px] px-2 flex-row`}
                    >
                      <div>{player.id}</div>
                      <div>{player.userName}</div>
                      <div
                        className={`rounded-full text-[#37ea99]  mr-3 ${
                          player.id === createdBy ? "opacity-100" : "opacity-0"
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={20}
                          className="fill-[#37ea99]"
                          viewBox="0 0 128 128"
                        >
                          <path
                            fill="currentColor"
                            d="M128 53.279c0 5.043-4.084 9.136-9.117 9.136-.091 0-.164 0-.255-.018l-8.914 34.06H18.286L8.734 65.01C3.884 64.81 0 60.808 0 55.892c0-5.043 4.084-9.136 9.117-9.136 5.032 0 9.117 4.093 9.117 9.136a9.557 9.557 0 0 1-.492 2.997l22.081 12.919 18.671-34.371a9.1 9.1 0 0 1-4.267-7.729c0-5.043 4.084-9.136 9.117-9.136s9.117 4.093 9.117 9.136a9.1 9.1 0 0 1-4.267 7.729l18.671 34.371 24.05-14.07a9.164 9.164 0 0 1-1.149-4.459c0-5.062 4.084-9.136 9.117-9.136 5.033 0 9.117 4.075 9.117 9.136zm-18.286 46.835H18.286v7.314h91.429v-7.314z"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="flex py-2    justify-around items-center">
              <button
                onClick={handleLeaveGame}
                className="px-6 py-2 cursor-pointer  bg-[#e2b714] hover:bg-yellow-400   text-white text-sm rounded-md font-semibold  hover:shadow-lg"
              >
                Leave Room
              </button>
              <button
                type="button"
                disabled={createdBy !== Number(user.id)}
                onClick={handleStartGame}
                className={`px-10 py-2 cursor-pointer bg-slate-400 hover:bg-slate-500 text-white text-sm rounded-md font-semibold 
                              hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
                              disabled:pointer-events-none`}
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>{" "}
      <Footer />
    </div>
  );
}
