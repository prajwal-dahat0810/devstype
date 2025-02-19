export type messageType = {
  id: string | number;
  userName: string;
  message: string;
};

// const messages = [
//   { id: 1, userName: "prajwal", message: "hi there" },
//   { id: 2, userName: "mithilesh", message: "hi there" },
//   { id: 3, userName: "samar", message: "hi ther2e" },
//   { id: 3, userName: "samar", message: "hi ther2e" },
//   { id: 3, userName: "samar", message: "hi ther2e" },
//   { id: 3, userName: "samar", message: "hi ther2e" },
//   { id: 3, userName: "samar", message: "hi ther2e" },
// ];
export const Messages = ({ messages }: { messages: messageType[] }) => {
  return (
    <div className="w-full h-full flex gap-1 flex-col overflow-y-scroll  custom-scrollbar ">
      {messages.map((message: messageType, index: number) => {
        return (
          <div
            key={index}
            className="w-full items-center gap-2 px-1 h-min flex "
          >
            <div className="w-10 bg-[#484b49] text-[#D1D0C5] h-10 items-center justify-center flex rounded-full border">
              {message.userName.toUpperCase()[0]}
            </div>
            <div className="relative">
              <div className="font-mono text-[#787676]">{message.userName}</div>

              <div className=" font-sans text-[#d9d0d0]">{message.message}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
