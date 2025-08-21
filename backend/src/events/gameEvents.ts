import { WebSocket } from "ws";
import { clearIntervals, redis, roomSockets } from "..";
import { prisma } from "../routes/userRoutes";
import { userWebSocket } from "../types";
import { startSendingUpdates } from "./redisEvents";
import { number } from "zod";

export const typingParagraphs30: string[] = [
  "Typing daily not only improves speed and accuracy but also builds confidence, making you more productive and efficient in tasks ranging from emails to coding projects without unnecessary strain or errors.",
  "The quick brown fox swiftly jumps over the lazy dog, displaying agility and precision, while the startled dog continues napping peacefully under the warm afternoon sun with no interest in the fox’s actions.",
  "Good typing posture involves sitting upright, keeping your wrists relaxed, and positioning fingers properly on the keyboard’s home row, allowing for faster movement, fewer mistakes, and reduced strain during extended periods of computer work.",
  "Consistent typing practice helps develop strong muscle memory, enabling you to type without looking at the keyboard, maintain steady accuracy, and focus entirely on the content you’re producing rather than the act of typing itself.",
  "Typing games add fun to learning by introducing challenges, speed trials, and accuracy tests that keep you engaged, improve focus, and encourage consistent practice, making skill development feel more like enjoyable play than routine work.",
  "Fast and accurate typing allows you to communicate quickly, handle more information efficiently, and complete computer tasks without losing focus, ultimately improving your workflow and giving you more time for creative or strategic thinking.",
  "Using proper hand placement on the keyboard ensures that your fingers travel the shortest possible distance, conserving energy and reducing fatigue, which helps maintain consistent speed and accuracy throughout long hours of typing practice.",
  "Learning typing skills on multiple keyboard layouts such as QWERTY, Dvorak, or Colemak can greatly improve your adaptability, preparing you to work efficiently on different systems and with various device setups without slowing down.",
  "Avoid multitasking while typing, as it breaks your rhythm, increases error rates, and slows overall speed. Focusing entirely on the text in front of you ensures faster improvement and more accurate results over time.",
  "Setting achievable typing goals like five extra words per minute each week can keep you motivated, provide clear progress benchmarks, and make the process of learning both structured and rewarding as you improve steadily.",
];
export const typingParagraphs40: string[] = [
  "Typing efficiently is a skill that benefits students, professionals, and hobbyists alike. Practicing regularly not only boosts your words per minute but also minimizes mistakes, improves focus, and reduces mental fatigue when handling complex documents or engaging in creative writing projects.",
  "The quick brown fox jumps over the lazy dog, a classic typing sentence containing every letter of the alphabet. This pangram serves as a fun warm-up exercise that enhances familiarity with the keyboard while helping typists build comfort and rhythm over time.",
  "Maintaining good typing posture involves sitting with your back straight, feet flat, and wrists level. Keeping fingers correctly positioned on the home row improves efficiency, reduces physical strain, and allows you to type comfortably for extended periods without risking repetitive stress injuries.",
  "Consistent typing drills train your brain and muscles to work together seamlessly. With time, you’ll develop the ability to type without looking at the keys, enabling you to focus fully on the content, structure, and quality of the work you’re producing.",
  "Typing games and speed challenges can transform skill building into a fun, rewarding activity. These engaging tools track progress, encourage friendly competition, and help reinforce accuracy while making practice enjoyable, which is essential for maintaining long-term dedication to improvement and skill mastery.",
  "A fast and accurate typist can respond to messages quickly, complete tasks ahead of deadlines, and handle larger volumes of work. This efficiency improves overall productivity, giving you more time to brainstorm, solve problems, and develop creative or strategic ideas effectively.",
  "Proper finger positioning on the keyboard’s home row ensures minimal movement, conserving physical energy and improving speed. Over time, this technique allows for fluid, mistake-free typing sessions that feel natural, helping you maintain focus during demanding projects or extended typing marathons.",
  "Learning alternative keyboard layouts like Dvorak or Colemak can boost typing efficiency and comfort. Mastering multiple systems makes you adaptable, allowing you to work confidently on unfamiliar devices or environments without sacrificing speed, accuracy, or overall typing quality in professional settings.",
  "Avoid splitting your attention between multiple tasks when typing, as it disrupts rhythm and lowers accuracy. A focused approach builds better habits, accelerates progress, and delivers higher-quality results, whether you’re writing code, preparing reports, or engaging in online conversations for collaboration.",
  "Setting structured, achievable typing milestones helps track progress and maintain motivation. For example, aiming to increase your words per minute gradually ensures steady improvement, builds confidence, and transforms skill development into an ongoing journey rather than a stressful or frustrating challenge.",
];
export const fifteenWordsParagraphs: string[] = [
  "Typing quickly improves both speed and accuracy, making you more efficient in daily work.",
  "The quick brown fox jumps over the lazy dog without waking it from deep sleep.",
  "Practice every day to build muscle memory and improve your typing skills over time.",
  "Accuracy matters more than speed when you are learning to type for the first time.",
  "Technology keeps evolving, and fast typing can help you keep up with the changing pace.",
  "Fingers rest on the home row keys, making it easier to reach all other keys.",
  "Learning touch typing helps avoid looking at the keyboard, keeping your eyes on the screen.",
  "Short and frequent typing sessions are better than long, tiring practices without enough breaks taken.",
  "Typing games can make the process more enjoyable while improving both speed and accuracy levels.",
  "Consistent effort and patience are necessary to master typing without unnecessary mistakes or constant corrections.",
  "Posture is important for long typing sessions to avoid strain in your wrists and back.",
  "A comfortable chair and proper desk height help maintain correct posture during prolonged typing practice.",
  "Typing with proper finger placement saves time and reduces the risk of repetitive strain injury.",
  "Your brain adapts quickly to repeated actions, making fast typing a natural skill over time.",
  "Speed tests are a great way to track progress and challenge yourself to do better.",
  "Avoid slouching when typing, as it can cause neck pain and shoulder tension over time.",
  "Keyboard shortcuts save time and make computer use faster for both work and leisure purposes.",
  "Typing skills are useful for students, professionals, and hobbyists in nearly every field imaginable today.",
  "Learning to type on different keyboard layouts can expand your adaptability and overall computer skills.",
  "Setting small typing goals can help you stay motivated and celebrate progress along the journey.",
];

export const gameEvents = async (ws: userWebSocket, eventData: any) => {
  const userId = ws.userId;

  const { event, data }: { event: string; data: any } = JSON.parse(eventData);
  if (event === "history") {
    const { filter } = data;

    console.log(
      "history event received for user:",
      userId,
      "with filter:",
      filter
    );

    try {
      if (filter && filter === "all-time") {
        const response = await prisma.game.findMany({
          where: {
            players: {
              some: {
                id: Number(userId),
              },
            },
          },
          orderBy: {
            startedAt: "desc",
          },
          select: {
            roomId: true,
            startedAt: true,
            finishAt: true,
            state: true,
          },
        });
        const history = response.map((game) => ({
          roomId: game.roomId,
          startedAt: game.startedAt,
          finishAt: game.finishAt,
          state: game.state,
        }));
        console.log("history:", history);
        return ws.send(
          JSON.stringify({
            event: "updated-history",
            data: {
              history,
            },
          })
        );
      } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const response = await prisma.game.findMany({
          where: {
            players: {
              some: {
                id: Number(userId),
              },
            },
            startedAt: {
              gte: thirtyDaysAgo,
            },
          },

          orderBy: {
            startedAt: "desc",
          },
          select: {
            roomId: true,
            startedAt: true,
            finishAt: true,
            state: true,
          },
        });
        const history = response.map((game) => ({
          roomId: game.roomId,
          startedAt: game.startedAt,
          finishAt: game.finishAt,
          state: game.state,
        }));
        console.log("history:", history);
        return ws.send(
          JSON.stringify({
            event: "updated-history",
            data: {
              history,
            },
          })
        );
      }
    } catch (e) {
      return ws.send(
        JSON.stringify({
          event: "history-error",
          data: {
            message: "history not available!!!",
            error: e,
          },
        })
      );
    }
  }

  if (event === "update-score") {
    const { roomId, time, wpm, accuracy, totalTyped, wordsLimit } = data;
    const getRoom = await redis.get(`progress:${roomId}-${userId}`);
    const parsedRoom = JSON.parse(getRoom as string);
    parsedRoom.time = time;
    parsedRoom.wpm = wpm;
    parsedRoom.accuracy = accuracy;
    parsedRoom.totalTyped = totalTyped;
    await redis.set(
      `progress:${roomId}-${userId}`,
      JSON.stringify(
        parsedRoom || { wpm: 0, time: 0, accuracy: 0, totalTyped: 0 }
      )
    );
    // console.log("updated", updatedProgress);
    return;
  }
  if (event === "start-game") {
    const { roomId } = data;
    const getRoom = await redis.get(`room:${roomId}`);
    if (!getRoom) {
      console.log("room not found");
      //
      return ws.send(
        JSON.stringify({
          event: "game-error",
          data: {
            message: "Room not found!!!",
          },
        })
      );
    }
    const parsedRoomData: { room: any; wordsLimit: number; gameType: string } =
      JSON.parse(getRoom as string);
    // console.log(parsedRoomData.room.players);
    const wordsLimit = parsedRoomData.wordsLimit;
    const gameType = parsedRoomData.gameType;
    const timeLimit = wordsLimit === 40 ? 150 : wordsLimit === 30 ? 120 : 60;

    try {
      const updatedRoom = await prisma.game.update({
        where: {
          roomId: roomId,
        },
        data: {
          state: "IN_PROGRESS",
          startedAt: new Date().toISOString(),
          players: {
            set: parsedRoomData.room.players.map((p: { id: any }) => ({
              id: Number(p.id),
            })),
          },
        },
        select: {
          roomId: true,
          startedAt: true,
          finishAt: true,
          state: true,
          players: {
            select: {
              id: true,
              userName: true,
              email: true,
            },
          },
          createdBy: true,
        },
      });
      parsedRoomData.room = updatedRoom;
      const updatedRedisRoom = await redis.set(
        `room:${roomId}`,
        JSON.stringify(parsedRoomData)
      );
      // console.log(updatedRedisRoom);
      const progress = await Promise.all(
        updatedRoom.players.map(
          async (player: { userName: string; id: number }) => {
            await redis.set(
              `progress:${roomId}-${player.id}`,
              JSON.stringify({ time: 0, wpm: 0, accuracy: 0, totalTyped: 0 })
            );
            return {
              id: player.id,
              userName: player.userName,
              progress: { time: 0, wpm: 0, accuracy: 0, totalTyped: 0 },
            };
          }
        )
      );

      const clients = roomSockets.get(roomId);
      // console.log(clients?.size);
      if (!clients) {
        return ws.send(
          JSON.stringify({
            event: "game-error",
            data: {
              message: "Some error happen!!!",
            },
          })
        );
      }
      const id = Math.floor(Math.random() * 10);
      const paragraph =
        parsedRoomData.wordsLimit === 15
          ? fifteenWordsParagraphs[id]
          : parsedRoomData.wordsLimit === 30
          ? typingParagraphs30[id]
          : typingParagraphs40[id];
      clients.forEach((client) => {
        client.send(
          JSON.stringify({
            event: "game-started",
            data: {
              paragraph: paragraph,
              wordsLimit,
              room: parsedRoomData.room,
              gameType,
            },
          })
        );
      });
      startSendingUpdates(roomId, updatedRoom, clients);
      setTimeout(async () => {
        clearInterval(clearIntervals.get(roomId));
        clearIntervals.delete(roomId);
        console.log("Stop sending updates to client");

        (async () => {
          const finishedRoom = await prisma.game.update({
            where: {
              roomId: roomId,
            },
            data: {
              state: "COMPLETED",
              finishAt: new Date().toISOString(),
            },
            select: {
              startedAt: true,
              state: true,
              roomId: true,
              finishAt: true,
              createdBy: true,
              players: {
                select: {
                  id: true,
                  userName: true,
                  email: true,
                },
              },
            },
          });
          await Promise.all(
            finishedRoom.players.map(async (player) => {
              await redis.del(`progress:${roomId}-${player.id}`);
            })
          );

          const delRoom = await redis.del(`room:${roomId}`);
        })();
        clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN)
            client.send(
              JSON.stringify({
                event: "game-end",
                data: {
                  message: "Game completed and ended!!!",
                },
              })
            );
          //
        });
        roomSockets.delete(roomId);
      }, timeLimit * 1000);
    } catch (e) {
      return ws.send(
        JSON.stringify({
          event: "game-error",
          data: {
            message: "Room not found!!!",
            error: e,
          },
        })
      );
    }

    // "game-history"
  }
  // You can add more game logic here (e.g., typing progress, score updates)
};
