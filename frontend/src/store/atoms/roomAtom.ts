import { atom } from "recoil";

export const paragraphAtom = atom({
  key: "paragraphAtom",
  default: "The quick brown fox jumps over the lazy dog.",
});
