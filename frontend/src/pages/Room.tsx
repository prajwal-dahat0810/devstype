import { useRecoilValue, useSetRecoilState } from "recoil";
import { roomAtom } from "../store/atoms/testAtom";
import Navigation from "../components/Navigation";
import { useWebSocket } from "../hooks/webSocketConnection";
import { useNavigate, useSearchParams } from "react-router-dom";
import socket from "./Landing";
import Landing from "./Landing";
import { socketAtom } from "../store/atoms/socketAtom";
import { useTrackRoomPlayers } from "../hooks/trackRoomPlayers";
import { userAtom } from "../store/atoms/userAtom";
import { paragraphAtom } from "../store/atoms/roomAtom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { Messages, messageType } from "../components/Messages";
import { Footer } from "../components/Footer";
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

  if (socket !== null) {
    socket.addEventListener("message", function (event: { data: any }) {
      const { event: eventName, data: data } = JSON.parse(event.data);

      if (eventName === "joined-room") {
        console.log("game-started", data);
        const roomId = data.roomId;
        console.log("Start game event sent!");
        console.log("room -players", room.players);
        console.log("data-room", data);
      }
      // console.log(typeof event.data);
      // console.log(event.data);
    });
  }
  console.log(createdBy === Number(user.id));
  function handleLeaveGame() {
    const loadId = toast.loading("Leaving room...", {
      style: {
        border: "1px solid #4CAF50",
        paddingBlock: "10px",
        maxHeight: "min-content",
        color: "#4CAF50",
        backgroundColor: "purple",
        fontWeight: "bold",
      },
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
      function handleMessage(event: { data: any }) {
        toast.dismiss(loadId);
        const { event: eventName, data: data } = JSON.parse(event.data);

        if (eventName === "room-leaved") {
          roomLeavedRef.current = toast.dark(
            `Room leaved by ${user.userName.slice(0, 20)}...`,
            {
              style: {
                border: "2px solid #3b82f6",
                paddingInline: "10px",
                paddingTop: 0,
                paddingBottom: 0,
                maxHeight: "min-content",
                color: "#e0f2fe",
                backgroundColor: "#1e3a8a",
              },
            }
          );

          setTimeout(() => {
            roomLeavedRef.current = null;
            setRoom((prev) => data.room);
            navigate("/");
          }, 3000);
          return;
        }

        if (eventName === "admin-leaved") {
          toast.dismiss(loadId);
          roomLeavedRef.current = toast.dark(data.message, {
            style: {
              border: "2px solid #3b82f6",
              paddingInline: "10px",
              paddingTop: 0,
              paddingBottom: 0,
              maxHeight: "min-content",
              color: "#e0f2fe",
              backgroundColor: "#1e3a8a",
            },
          });

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

      if (eventName === "get-message") {
        const newMessage = data.message;
        console.log(newMessage);
        setMessages((prev) => [...prev, newMessage]);
      }
      if (eventName === "player-join") {
        console.log(event.data);
        const joinedPlayerName = user.userName;
        console.log("player-join");
        toast.dark(`Room Joined by ${joinedPlayerName}!`, {
          style: {
            border: "2px solid #3b82f6",
            paddingInline: "10px",
            paddingTop: 0,
            paddingBottom: 0,
            maxHeight: "min-content",
            color: "#e0f2fe",
            backgroundColor: "#1e3a8a",
          },
        });
        setRoom((prev) => data.room);
      }
      if (eventName === "room-deleted") {
        console.log("room-deleted");
        roomLeavedRef.current = toast.dark(
          data.message,

          {
            style: {
              border: "2px solid #3b82f6",
              paddingInline: "10px",
              paddingTop: 0,
              paddingBottom: 0,
              maxHeight: "min-content",
              color: "#e0f2fe",
              backgroundColor: "#1e3a8a",
            },
          }
        );
        await new Promise((r) => setTimeout(r, 2000));
        navigate("/");
      }
      if (eventName === "admin-room-leaved") {
        console.log(event.data);
        const playerLeaved = data.player.userName;
        roomLeavedRef.current = toast.dark(
          `Room admin ${playerLeaved}Leaved!`,

          {
            style: {
              border: "2px solid #3b82f6",
              paddingInline: "10px",
              paddingTop: 0,
              paddingBottom: 0,
              maxHeight: "min-content",
              color: "#e0f2fe",
              backgroundColor: "#1e3a8a",
            },
          }
        );
        //
        await new Promise((r) => setTimeout(r, 2000));

        toast.dismiss(roomLeavedRef.current);
        roomLeavedRef.current = null;
        setGameType(data.gameType);
        setWordsLimit(data.wordsLimit);
        setRoom((prev) => data.room);
      }
      if (eventName === "admin-leaved") {
        console.log(event.data);
        roomLeavedRef.current = toast.dark(
          `New admin ${data.admin}`,

          {
            style: {
              border: "2px solid #3b82f6",
              paddingInline: "10px",
              paddingTop: 0,
              paddingBottom: 0,
              maxHeight: "min-content",
              color: "#e0f2fe",
              backgroundColor: "#1e3a8a",
            },
          }
        );
        await new Promise((r) => setTimeout(r, 2000));

        toast.dismiss(roomLeavedRef.current);
        roomLeavedRef.current = null;
        navigate("/");
      }
      if (eventName === "room-leave") {
        console.log("player leaved");
        const leavedPlayer = data.player;
        roomLeavedRef.current = toast.dark(
          `Room Leaved by ${leavedPlayer.userName}!`,

          {
            style: {
              border: "2px solid #3b82f6",
              paddingInline: "10px",
              paddingTop: 0,
              paddingBottom: 0,
              maxHeight: "min-content",
              color: "#e0f2fe",
              backgroundColor: "#1e3a8a",
            },
          }
        );
        await new Promise((r) => setTimeout(r, 2000));

        toast.dismiss(roomLeavedRef.current);
        roomLeavedRef.current = null;
        setRoom(data.room);
      }

      if (eventName === "room-error") {
        roomLeavedRef.current = toast.dark(
          data.message,

          {
            style: {
              border: "2px solid #3b82f6",
              paddingInline: "10px",
              paddingTop: 0,
              paddingBottom: 0,
              maxHeight: "min-content",
              color: "#e0f2fe",
              backgroundColor: "#1e3a8a",
            },
          }
        );
        await new Promise((r) => setTimeout(r, 2000));

        toast.dismiss(roomLeavedRef.current);
        roomLeavedRef.current = null;
        setRoom(data.room);
      }
      if (eventName === "game-started") {
        console.log("game-started", data);
        const roomId = data.room.roomId;
        setParagraph(data.paragraph);
        console.log("Start game event sent!");
        navigate(`/room/${roomId}?wordsLimit=${data.wordsLimit}`);
        console.log(roomId);
      }
    };
    socket.addEventListener("message", messageHandler);
    return () => {
      socket?.removeEventListener("message", messageHandler);
    };
  }, []);

  function handleStartGame() {
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
          const toastId = toast.error(
            data.message,
            {
              style: {
                border: "2px solid #3b82f6",
                paddingInline: "10px",
                paddingTop: 0,
                paddingBottom: 0,
                maxHeight: "min-content",
                color: "#e0f2fe",
                backgroundColor: "#1e3a8a",
              },
            }
          );
          await new Promise((r) => setTimeout(r, 2000));
          toast.dismiss(toastId);
        }
        if (eventName === "game-started") {
          console.log("game-started", data);
          const roomId = data.room.roomId;
          setParagraph(data.paragraph);
          console.log("Start game event sent!");
          navigate(`/room/${roomId}?wordsLimit=${data.wordsLimit}`);
          console.log(roomId);
        }
        if (eventName === "room-error-creating") {
          roomLeavedRef.current = toast.dark(
            data.message,

            {
              style: {
                border: "2px solid #3b82f6",
                paddingInline: "10px",
                paddingTop: 0,
                paddingBottom: 0,
                maxHeight: "min-content",
                color: "#e0f2fe",
                backgroundColor: "#1e3a8a",
              },
            }
          );
          await new Promise((r) => setTimeout(r, 2000));

          toast.dismiss(roomLeavedRef.current);
          roomLeavedRef.current = null;
          navigate(`/`);
        }
        // console.log(typeof event.data);
        // console.log(event.data);
      });
      // console.log("Start game event sent!");
    } else {
      console.error("Socket is not connected yet");
    }
  }
  function handleMessage() {
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
      console.log("setting input");
      setMessageInput("");
    }
  }

  return (
    <div className="min-h-screen  flex flex-col bg-[#27282b] px-2   max-h-full min-w-full items-center  ">
      {/* <div className="min-h-screen  h-full px-2  bg-[#27282b]   min-w-full   "> */}
      <Navigation />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        transition={Bounce}
        hideProgressBar
      />
      <div className="mt-14 gap-3  max-w-5xl w-full max-sm:flex-col max-sm:items-center  mb-2 py-3 rounded-md font-roboto px-2 flex-grow bg-[#3c3e42]  flex  justify-evenly items-stretch ">
        <div className="max-w-xl  w-full min-h-[440px]  h-[300px] mt-5  flex flex-col gap-3">
          <div className="flex font-lexand py-1 flex-col text-[#d1d0c5] font-[600] text-[2rem] px-3 ">
            <div>
              #Room | <span>{roomId}</span>
            </div>
            <div>
              T | <span>{wordsLimit}</span>
            </div>
          </div>

          <div className="h-full  py-2  flex w-full max-h-[360px] flex-col">
            <div className=" rounded-md  bg-[#363638] h-full max-sm:max-h-[250px] my-2 px-3 py-2 overflow-y-scroll custom-scrollbar">
              <Messages messages={messages} />
            </div>
            <div className=" flex flex-row gap-2  justify-between">
              <input
                placeholder="Enter a message ..."
                className="w-full text-[.84rem] placeholder-[#515254] bg-[#2b2d30] py-2 px-2 text-[#d1d0c5] outline-none rounded-sm"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <button
                onClick={handleMessage}
                className="bg-green-500 hover:bg-green-600 cursor-pointer rounded-md px-2"
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
        <div className="max-w-xs justify-between  w-full   min-h-[400px] max-h-[500px] flex flex-col  gap-3">
          <div>
            <div className="flex px-2 pt-2 items-center justify-between">
              <div className=" w-max text-[#d1d0c5]">
                Joined Typists {` (${room.players.length})`}
              </div>
              <div className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height={20}
                  viewBox="0 0 128 128"
                >
                  <path
                    fill="#686464"
                    d="M128 53.279c0 5.043-4.084 9.136-9.117 9.136-.091 0-.164 0-.255-.018l-8.914 34.06H18.286L8.734 65.01C3.884 64.81 0 60.808 0 55.892c0-5.043 4.084-9.136 9.117-9.136 5.032 0 9.117 4.093 9.117 9.136a9.557 9.557 0 0 1-.492 2.997l22.081 12.919 18.671-34.371a9.1 9.1 0 0 1-4.267-7.729c0-5.043 4.084-9.136 9.117-9.136s9.117 4.093 9.117 9.136a9.1 9.1 0 0 1-4.267 7.729l18.671 34.371 24.05-14.07a9.164 9.164 0 0 1-1.149-4.459c0-5.062 4.084-9.136 9.117-9.136 5.033 0 9.117 4.075 9.117 9.136zm-18.286 46.835H18.286v7.314h91.429v-7.314z"
                  />
                </svg>
              </div>
            </div>
            <div className="flex  flex-col h-full">
              <div className="text-[12px] px-2 text-[#646669] flex justify-between">
                <div>#</div>
                <div>#username</div>
                <div>Created By</div>
              </div>

              {/* min-h-[120px] max-h-[330px] */}
              <div className="mt-3    overflow-y-scroll max-sm:h-full   text-[#D1D0C5] custom-scrollbar">
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
                        className={`rounded-full  mr-3 ${
                          player.id === createdBy ? "opacity-100" : "opacity-0"
                        } `}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height={20}
                          fill="#5cc46b"
                          viewBox="0 0 128 128"
                        >
                          <path
                            fill="#5cc46b"
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

          <div className="  flex flex-col   ">
            <div className="flex py-2    justify-around items-center">
              <button
                onClick={handleLeaveGame}
                className="px-6 py-2  bg-[#e2b714] hover:bg-yellow-400   text-white text-sm rounded-md font-semibold  hover:shadow-lg"
              >
                Leave Room
              </button>
              <button
                type="button"
                disabled={createdBy !== Number(user.id)}
                onClick={handleStartGame}
                className={`px-10 py-2 bg-slate-400 hover:bg-slate-500 text-white text-sm rounded-md font-semibold 
              hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`}
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
