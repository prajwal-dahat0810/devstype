import { useEffect, useId, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { socketAtom } from "../store/atoms/socketAtom";
import { roomAtom } from "../store/atoms/testAtom";
import { userAtom } from "../store/atoms/userAtom";
import axios from "axios";
const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL as string;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

// export function useWebSocket() {
//   const [socket, setSocket] = useRecoilState(socketAtom);
//   const [token, setToken] = useState("");
//   const room = useRecoilValue(roomAtom);
//   const userId = useRecoilValue(userAtom);
//   // console.log(useId, room);

//   useEffect(() => {
//     if (socket) return;

//     const getToken = async () => {
//       try {
//         const res = await axios.get(`${BACKEND_URL}/refresh`, {
//           withCredentials: true, // Ensures cookies are sent
//         });

//         if (res.data.token) {
//           setToken(res.data.token);
//         } else {
//           console.error("Token not received from server");
//         }
//       } catch (err) {
//         console.error("Error getting token", err);
//       }
//     };
//     getToken().then(() => {
//       if (!token) return;
//       const ws = new WebSocket(`${WEBSOCKET_URL}?${token}`);
//       console.log(ws);
//       ws.onopen = () => {
//         console.log("Connected to WebSocket server");
//         setSocket(() => ws);

//         return;
//       };

//       ws.onclose = () => {
//         setSocket(() => null);
//         // ws.close();
//         console.log("WebSocket connection closed");
//       };

//       const handleUnload = () => {
//         console.log("removing from", room.roomId);
//         if (ws.readyState === WebSocket.OPEN) {
//           console.log("removing from ", room.roomId);
//           window.removeEventListener("beforeunload", handleUnload);
//           ws.send(
//             JSON.stringify({
//               event: "leave-room",
//               data: { userId, roomId: room.roomId },
//             })
//           );

//           ws.close();
//         }
//       };
//       window.addEventListener("beforeunload", handleUnload);
//       return () => {
//         window.removeEventListener("beforeunload", handleUnload);
//         console.log("removing from", room.roomId);
//         // if (ws.readyState === WebSocket.OPEN) {
//         //   ws.send(
//         //     JSON.stringify({
//         //       event: "leave-room",
//         //       data: { userId, roomId: room?.roomId },
//         //     })
//         //   );

//         // }
//       };
//     });
//   }, []);

//   // useEffect(() => {
//   //   console.log("Updated socket state:", socket);
//   // }, [socket]);

//   return { socket };
// }
export function useWebSocket() {
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [token, setToken] = useState("");
  const room = useRecoilValue(roomAtom);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    if (socket) return;

    const getToken = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/refresh`, {
          withCredentials: true, // Ensures cookies are sent
        });

        if (res.data.token) {
          setToken(res.data.token);
        } else {
          console.error("Token not received from server");
        }
      } catch (err) {
        console.error("Error getting token", err);
      }
    };

    getToken().then(() => {
      if (!token) return; // Ensure token is set before continuing

      const ws = new WebSocket(`${WEBSOCKET_URL}?token=${token}`);
      console.log(ws);

      ws.onopen = () => {
        console.log("Connected to WebSocket server");
        setSocket(() => ws);
      };

      ws.onclose = () => {
        setSocket(() => null);
        console.log("WebSocket connection closed");
      };

      const handleUnload = () => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      };

      window.addEventListener("beforeunload", handleUnload);

      return () => {
        window.removeEventListener("beforeunload", handleUnload);
      };
    });
  }, [token]); // Re-run effect when token updates
  return { soc: socket };
}
