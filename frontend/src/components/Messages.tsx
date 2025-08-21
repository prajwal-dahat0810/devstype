export type messageType = {
  id: string | number;
  userName: string;
  message: string;
};

export const Messages = ({ messages }: { messages: messageType[] }) => {
  console.log("Messages component rendered with messages:", messages);
  return (
    <div className="w-full px-3 py-2 min-h-56 flex gap-3 flex-col overflow-y-scroll  custom-scrollbar ">
      {messages.length === 0 ? (
        <div className="w-full h-full min-h-56  gap-3 text-[#D1D0C5]  flex ">
          No messages yet...
        </div>
      ) : (
        messages.map((message: messageType, index: number) => {
          return (
            <div key={index} className="w-full   gap-3   flex ">
              <div className="w-9 bg-[#484b49] text-[#D1D0C5] h-9 items-center justify-center flex rounded-full ">
                {message.userName ? message.userName.toUpperCase()[0] : "A"}
              </div>
              <div className="flex flex-col max-w-3/4 pr-3">
                <div className="font-customFont text-[10px]  text-[#787676]">
                  {message.userName}
                </div>

                <div className=" font-sans text-[#d9d0d0] text-wrap">
                  {message.message}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
