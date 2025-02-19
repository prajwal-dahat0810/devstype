import { atom } from "recoil";

export type roomDataType = {
  roomId: string;
  state: any;
  startAt: string;
  finishAt: string;
  createdBy: number;
  players: roomPlayerType[];
};

export type roomPlayerType = {
  id: number;
  userName: string;
  email: string;
};
export const roomAtom = atom({
  key: "roomAtom",
  default: {
    roomId: "",
    state: "",
    startAt: "",
    finishAt: "",
    createdBy: 0 as Number,
    players: [] as roomPlayerType[],
  },
});
