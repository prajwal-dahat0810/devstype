import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import Navigation from "../components/Navigation";
import { useRecoilValue } from "recoil";
import { socketAtom } from "../store/atoms/socketAtom";
import { Bounce, toast, ToastContainer } from "react-toastify";

const FilterButton = [
  {
    id: 0,
    name: "all-time",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5  "
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-6.5 6.326a6.52 6.52 0 0 1-1.5.174 6.487 6.487 0 0 1-5.011-2.36l.49-.98a.423.423 0 0 1 .614-.164l.294.196a.992.992 0 0 0 1.491-1.139l-.197-.593a.252.252 0 0 1 .126-.304l1.973-.987a.938.938 0 0 0 .361-1.359.375.375 0 0 1 .239-.576l.125-.025A2.421 2.421 0 0 0 12.327 6.6l.05-.149a1 1 0 0 0-.242-1.023l-1.489-1.489a.5.5 0 0 1-.146-.353v-.067a6.5 6.5 0 0 1 5.392 9.23 1.398 1.398 0 0 0-.68-.244l-.566-.566a1.5 1.5 0 0 0-1.06-.439h-.172a1.5 1.5 0 0 0-1.06.44l-.593.592a.501.501 0 0 1-.13.093l-1.578.79a1 1 0 0 0-.553.894v.191a1 1 0 0 0 1 1h.5a.5.5 0 0 1 .5.5v.326Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 1,
    name: "last-month",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path d="M5.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H6a.75.75 0 0 1-.75-.75V12ZM6 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H6ZM7.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H8a.75.75 0 0 1-.75-.75V12ZM8 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H8ZM9.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V10ZM10 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H10ZM9.25 14a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H10a.75.75 0 0 1-.75-.75V14ZM12 9.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V10a.75.75 0 0 0-.75-.75H12ZM11.25 12a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V12ZM12 13.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V14a.75.75 0 0 0-.75-.75H12ZM13.25 10a.75.75 0 0 1 .75-.75h.01a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75H14a.75.75 0 0 1-.75-.75V10ZM14 11.25a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75h.01a.75.75 0 0 0 .75-.75V12a.75.75 0 0 0-.75-.75H14Z" />
        <path
          fill-rule="evenodd"
          d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
  },
];

export default function () {
  const tabs = {
    "all-time": "All-time history of games",
    "last-month": "Last 30 history of games",
  };
  const [loading, setLoading] = useState(true);
  const [historyData, setHistoryData] = useState<any>(null);
  type FilterKey = keyof typeof tabs;
  const [error, setError] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all-time");
  const socket = useRecoilValue(socketAtom);
  useEffect(() => {
    if (socket) {
      setLoading(true);
      socket.send(
        JSON.stringify({
          event: "history",
          data: {
            filter: activeFilter,
          },
        })
      );

      socket.onmessage = async function (event) {
        const { event: eventName, data: data } = JSON.parse(event.data);
        if (eventName === "updated-history") {
          console.log("History data received:", data);
          setHistoryData(data.history);
          setLoading(false);
        }
        if (eventName === "history-error") {
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
          setError(data.message);
          setLoading(false);
          console.error("Error fetching history:", data.message);
        }
      };
    }
  }, []);
  function handleHistoryFilter(e: React.MouseEvent<HTMLDivElement>) {
    const filterKey = e.currentTarget.textContent
      ?.toLowerCase()
      .replace(" ", "-") as FilterKey;
    if (socket) {
      setActiveFilter(filterKey);
      setLoading(true);
      socket.send(
        JSON.stringify({
          event: "history",
          data: {
            filter: filterKey,
          },
        })
      );
      socket.onmessage = async function (event) {
        const { event: eventName, data: data } = JSON.parse(event.data);
        if (eventName === "updated-history") {
          console.log("History data received:", data);
          setHistoryData(data.history);
          setLoading(false);
        }
        if (eventName === "history-error") {
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
          setError(data.message);
          setLoading(false);
          console.error("Error fetching history:", data.message);
        }
      };
    }
  }

  return (
    <div className="min-h-screen relative bg-[#323437] flex flex-col flex-grow   max-h-full w-full items-center  ">
      <Navigation />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        transition={Bounce}
        hideProgressBar
      />
      <div className="mt-16 h-full px-3  max-sm:px-1 py-3 xl:flex-row  flex-col justify-center  xl:items-baseline items-center flex max-w-6xl w-full">
        <div className=" lg:px-20 md:px-10 xl:px-3 xl:w-3/17  w-full    mb-6 ">
          <div className="py-4 flex bg-[#2c2e31]   rounded-lg  px-4 lg:px-3 flex-col gap-3 max-sm:gap-2 ">
            {FilterButton.map((button) => (
              <div
                onClick={handleHistoryFilter}
                className={` ${
                  button.id === 0 ? "bg-[#e2b714]" : "bg-[#d1d0c5]"
                } font-mono rounded-md cursor-pointer ${
                  button.id === 0 ? "hover:bg-[#f8c302]" : "hover:bg-[#f3f2f2]"
                } py-1.5 px-2 flex  max-w-full max-sm:max-w-full  justify-start gap-3`}
              >
                <div className="w-max   text-[#30302f]  rounded-full flex items-center text-md font-serif font-[1000] justify-center   ">
                  {button.icon}
                </div>
                <div className=" font-mono text-[#30302f]">{button.name}</div>
              </div>
            ))}
          </div>
        </div>
        <div className=" max-w-4xl w-full text-[#D1D0C5] font-mono my-2 flex  flex-col gap-3 flex-grow space-between text-wrap  ">
          <div className="flex flex-col  p-3 gap-2 my-2 border-b-4 border-[#2c2e31] pb-3">
            {" "}
            <div className="max-sm:text-2xl text-4xl">{tabs[activeFilter]}</div>
          </div>
          <div className="h-16  bg-[#2C2E31] rounded-md"></div>
          {loading ? (
            <div className="flex  h-96 justify-center items-center ">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e2b714]"></div>
            </div>
          ) : (historyData && historyData.length === 0) || error !== "" ? (
            <div className="text-center h-96 text-[#D1D0C5] text-lg">
              {error
                ? "History not available at this time!"
                : "No history available for this filter."}
            </div>
          ) : (
            <table className="table-auto w-full">
              <thead className="">
                <tr>
                  <th className="px-4 py-2 text-left text-[#666469] text-[11.2px] font-normal">
                    #
                  </th>
                  <th className="px-4 max-sm:px-5 py-2 text-left text-[#666469] text-[11.2px] font-normal">
                    Room ID
                  </th>
                  <th className="px-4 max-sm:px-2 py-2 text-left text-[#666469] text-[11.2px] font-normal">
                    State
                  </th>
                  <th className="px-4 py-2 text-left text-[#666469] text-[11.2px] font-normal">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className=" ">
                {historyData.map((item: any, index: number) => (
                  <tr
                    key={item.roomId}
                    className={` text-[16px]  rounded-sm max-sm:text-[11.2px] ${
                      index % 2 === 0 ? "bg-[#2C2E31]" : ""
                    } text-[#D1D0C5]`}
                  >
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 max-sm:px-5 py-2">{item.roomId}</td>
                    <td className="px-4 max-sm:px-2 py-2">{item.state}</td>
                    <td className="max-sm:px-3 ">
                      <div className="flex flex-col ">
                        <div className="text-[#D1D0C5] text-[12px] block ">
                          {new Date(item.startedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "2-digit",
                              month: "short",
                              day: "2-digit",
                            }
                          )}
                        </div>
                        <div className="text-[10px] sm:text-[9px] align-right text-[#666469]">
                          {new Date(item.startedAt).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              hour12: false,
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>{" "}
      </div>
      <div className="mt-4">
        <Footer></Footer>
      </div>
    </div>
  );
}
