import axios from "axios";
import { useEffect, useMemo, useRef, useState } from "react";
import { useWebSocket } from "../hooks/webSocketConnection";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { roomAtom, roomDataType } from "../store/atoms/testAtom";
import Navigation from "../components/Navigation";
import { socketAtom } from "../store/atoms/socketAtom";
import { userAtom } from "../store/atoms/userAtom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { Footer } from "../components/Footer";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
export default function Landing() {
  const gameTypeOptions = ["Words"];
  const wordsOptions = [15];
  const alertRef: any = useRef(null);
  const { soc }: any = useWebSocket();
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();
  const [gameType, setGameType] = useState(gameTypeOptions[0]);
  const [wordsLimit, setWordsLimit] = useState(wordsOptions[0]);
  const [room, setRoom] = useRecoilState(roomAtom);
  const [roomInputId, setRoomInputId] = useState("");
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/me`, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        setUser({
          userName: response.data.user.userName,
          id: response.data.user.id,
          email: response.data.user.email,
        });
        console.log("user Authorized");
      })
      .catch((error) => {
        console.log("error");
        console.log(error);

        // window.location.href = "/signin";
        // if (error.response.request.status === 401) {
        //   window.location.href = "/signin";
        // }
      });
  }, [setSocket]);

  // useEffect(() => {
  //   const messageHandler = async function (event: { data: string }) {
  //     const { event: eventName, data: data } = JSON.parse(event.data);
  //     //// write a logic to only 10 player allow in a room
  //     console.log("room-error", data.message);

  //   };

  //   soc?.addEventListener("message", messageHandler);

  //   return () => {
  //     socket?.removeEventListener("message", messageHandler);
  //   };
  // }, []);

  // console.log(socket);
  const createRoom = () => {
    // toast.dark("Room Created !", {
    //   style: {
    //     border: "2px solid #16a34a",
    //     paddingInline: "10px",
    //     paddingTop: 0,
    //     paddingBottom: 0,
    //     maxHeight: "min-content",
    //     color: "#d1fae5",
    //     backgroundColor: "#052e16",
    //   },
    // });
    const loadId = toast.loading("Creating Room...", {
      style: {
        border: "1px solid #22c55e",
        paddingBlock: "10px",
        maxHeight: "min-content",
        color: "#22c55e",
        backgroundColor: "#27282b",
        fontWeight: "bold",
      },
    });
    if (socket) {
      socket.send(
        JSON.stringify({
          event: "create-room",
          data: { wordsLimit, gameType },
        })
      );
      socket.onmessage = async function (event) {
        toast.dismiss(loadId);
        const { event: eventName, data: data } = JSON.parse(event.data);
        if (eventName === "room-created") {
          console.log("room created");
          ///set room state
          toast.dark("Room Created !", {
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
          const roomData: roomDataType = data.room;
          setRoom({
            roomId: roomData.roomId,
            state: roomData.state,
            startAt: roomData.startAt,
            finishAt: roomData.finishAt,
            createdBy: roomData.createdBy,
            players: roomData.players,
          });
          navigate(`/room?gameType=${gameType}&wordsLimit=${wordsLimit}`);
          console.log(room);
        }
      };
    }
  };

  const joinRoom = () => {
    if (socket) {
      const loadId = toast.loading("Joining Room...", {
        style: {
          border: "1px solid #3b82f6",
          paddingBlock: "10px",
          maxHeight: "min-content",
          color: "#e0f2fe",
          backgroundColor: "#27282b",
          fontWeight: "bold",
        },
      });
      socket.send(
        JSON.stringify({
          event: "join-room",
          data: {
            roomId: roomInputId,
            userId: user.id,
            email: user.email,
            userName: user.userName,
          },
        })
      );
      socket.onmessage = async function (event) {
        const { event: eventName, data: data } = JSON.parse(event.data);
        //// write a logic to only 10 player allow in a room
        toast.dismiss(loadId);
        if (eventName === "player-joined") {
          toast.dismiss(loadId);
          setGameType(data.gameType);
          setWordsLimit(data.wordsLimit);
          const roomData: roomDataType = data.room;
          alertRef.current = toast.dark(
            data.message ? data.message : "Room Joined !",

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
          setRoom({
            roomId: roomData.roomId,
            state: roomData.state,
            startAt: roomData.startAt,
            finishAt: roomData.finishAt,
            createdBy: roomData.createdBy,
            players: roomData.players,
          });

          toast.dismiss(alertRef.current);
          alertRef.current = null;
          navigate(`/room?gameType=${gameType}&wordsLimit=${wordsLimit}`);
          // navigate(`/room`);
          return;
        }

        if (eventName === "room-joined-already") {
          toast.dismiss(loadId);
          const roomData: roomDataType = data.room;
          alertRef.current = toast.dark(
            data.message ? data.message : "Room Joined !",

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
          setGameType(data.gameType);
          setWordsLimit(data.wordsLimit);
          setRoom({
            roomId: roomData.roomId,
            state: roomData.state,
            startAt: roomData.startAt,
            finishAt: roomData.finishAt,
            createdBy: roomData.createdBy,
            players: roomData.players,
          });

          toast.dismiss(alertRef.current);
          alertRef.current = null;
          navigate(`/room?gameType=${gameType}&wordsLimit=${wordsLimit}`);
          // navigate(`/room`);
          return;
        }
        if (eventName === "room-error") {
          console.log("room-error", data.message);
          alertRef.current = toast.error(
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
          toast.dismiss(alertRef.current);
          alertRef.current = null;
          // navigate(`/room?gameType=${gameType}&wordsLimit=${wordsLimit}`);
          // navigate(`/`);
        }
      };
    }
  };

  if (!socket) {
    return <div>Connecting to Socket Server...</div>;
  }

  return (
    <div className="min-h-screen  flex flex-col bg-[#27282b] px-2   max-h-full min-w-full items-center  ">
      <Navigation />{" "}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        transition={Bounce}
        hideProgressBar
      />
      <div className="mt-14 gap-3  max-w-5xl w-full  items-center  max-sm:flex-col mx-4 mb-2 py-3 rounded-md font-roboto px-4 flex-grow bg-[#3c3e42]  flex  justify-evenly  ">
        <div className="max-w-xl  w-full min-h-[400px] h-full flex flex-col gap-4">
          <div className=" h-full">
            <div className="flex   font-mono  text-[#d1d0c5] font-[600] text-[2rem] px-3 justify-between items-center">
              Multiplayer Playground
            </div>
            <div className="mb-3 flex font-mono   items-center  gap-1  text-[14px] font-[400] text-[#d1d0c5]   px-3 ">
              <div>
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
              </div>
              Create a room{" "}
            </div>
          </div>

          <div className="bg-[#373739]  min-h-56 flex flex-col justify-between max-sm:h-full py-2 rounded-md">
            <div className="flex py-3  flex-row mx-2 gap-3  justify-between">
              <select
                onChange={(e) => {
                  setGameType(e.target.value);
                }}
                className="w-full bg-[#2f3032] text-[#d1d0c5] p-1 outline-none rounded-sm border"
                name="selectedFruit"
              >
                {gameTypeOptions.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>

              <select
                className="w-full  p-1 border bg-[#313132]  text-[#d1d0c5] rounded-sm  outline-none "
                name="selectedFruit"
                lang=""
                onChange={(e) => setWordsLimit(Number(e.currentTarget.value))}
              >
                {wordsOptions.map((option) => {
                  return (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  );
                })}
              </select>
            </div>

            <button
              onClick={createRoom}
              className=" font-custom cursor-pointer flex items-center justify-center gap-1 mt-2 bg-gradient-to-r from-green-400 to-emerald-600 to-90% text-[#e5e5e3] p-1 mx-3 rounded-md"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Create a Room
            </button>
          </div>
          {/* <button onClick={joinRoom}>Join Room</button> */}
          {/* <button onClick={startGame}>Start Game</button>
          <button onClick={getRoomDetails}>Get room</button> */}
        </div>
        <div className="max-w-xl  w-full min-h-[400px] h-full flex flex-col gap-4">
          <div className=" h-full">
            <div className="flex font-mono  font-customMono  text-[#d1d0c5] font-[600] text-[2rem] px-3 justify-between items-center">
              Join Room
            </div>
            <div className="mb-3 flex font-mono  items-center  gap-1  text-[14px] font-[400] text-[#d1d0c5]   px-3 ">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M1 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H1.75A.75.75 0 0 1 1 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Join room{" "}
            </div>
          </div>
          {/* <div className="bg-[#373739]  min-h-56 flex flex-col justify-between max-sm:h-full py-2 rounded-md"> */}
          <div className="flex justify-between bg-[#373739]  min-h-36 p-4 rounded-md flex-col">
            <input
              onChange={(e) => setRoomInputId(e.target.value)}
              placeholder="Enter Room Code ..."
              className="w-full text-[.84rem] placeholder-[#515254] bg-[#2b2d30] py-2 px-2 text-[#d1d0c5] outline-none rounded-sm"
              type="text"
            />
            <button
              onClick={joinRoom}
              className=" flex items-center gap-2 justify-center cursor-pointer bg-[#4179e8] bg-linear-to-t from-sky-500 to-indigo-600 text-[#e5e5e3] p-1  rounded-md"
            >
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M1 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H1.75A.75.75 0 0 1 1 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>{" "}
              Join Room
            </button>
          </div>
          {/* <button onClick={startGame}>Start Room</button>
          <button onClick={joinRoom}>Join Room</button>
          {/* <button onClick={startGame}>Start Game</button>
          <button onClick={getRoomDetails}>Get room</button> */}
        </div>
      </div>{" "}
      <div className="wrapper  bottom-0 left-0 w-full flex flex-col items-center gap-2">
        <Footer />
      </div>
    </div>
  );
}
