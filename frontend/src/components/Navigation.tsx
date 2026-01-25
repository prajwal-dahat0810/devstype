import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/atoms/userAtom";
import { toast } from "react-toastify";
import { ErrorAlert } from "./ui/ErrorAlert";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

export default function Navigation() {
  // const [userName, setuserName] = useState("");
  const user = useRecoilValue(userAtom);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const handleModal = () => {
    setOpenModal(!openModal);
  };

  async function handleLogout() {
    try {
      const res: any = await axios.get(`${BACKEND_URL}/logout`, {
        withCredentials: true,
      });
      if (res.status === 200) {
        toast.dark(
          res.data.message === "OK"
            ? "Logout successfully !"
            : res.data.message,
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
          },
        );
        await new Promise((r) => setTimeout(r, 2000));
        window.location.href = "/signin";
        return;
      }
      if (res.status === 401) {
        toast.error(<ErrorAlert data={{ content: res.data.message }} />, {
          autoClose: 3000,
          progress: 0.3,
          icon: false,
          data: { content: res.data.message },
          theme: "colored",
        });
        return;
      }
    } catch (error: any) {
      console.log(error);
      if (error.response.status === 401) {
        toast.error(<ErrorAlert data={{ content: error.message }} />, {
          progress: 0.3,
          data: { content: error.response.data.message },
          icon: false,
          theme: "colored",
        });
        return;
      }
      if (error.name === "AxiosError") {
        toast.error(<ErrorAlert data={{ content: error.message }} />, {
          progress: 0.3,
          data: { content: error.message },
          icon: false,

          theme: "colored",
        });
        return;
      }
    }
  }
  // useEffect(() => {
  //   console.log("user get");
  //   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

  //   axios
  //     .get(`${BACKEND_URL}/me`, {
  //       withCredentials: true,
  //     })
  //     .catch((error) => {
  //       console.log("error");
  //       if (error.response.status === 401) {
  //         navigate("/signin");
  //       }
  //       console.log(error);
  //     })
  //     .then((response: any) => {
  //       console.log(response.data);
  //       setuserName(response.data.userName);
  //     });
  // }, []);
  return (
    <nav className="h-12 z-10 bg-[#323437]    items-center fixed top-0 left-0 right-0 mx-auto  p-2">
      <div className="max-w-5xl  h-9 flex px-2 justify-between mx-auto  w-full">
        <div className="flex gap-1 max-sm:gap-5      justify-between">
          <div
            onClick={() => (window.location.href = "/")}
            className=" cursor-pointer flex items-center"
          >
            <svg
              fill="#ecc504"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="-680 -1030 300 180"
              className="h-9 w-9  max-sm:h-6 max-sm:w-6"
            >
              <g>
                <path d="M -430 -910 L -430 -910 C -424.481 -910 -420 -905.519 -420 -900 L -420 -900 C -420 -894.481 -424.481 -890 -430 -890 L -430 -890 C -435.519 -890 -440 -894.481 -440 -900 L -440 -900 C -440 -905.519 -435.519 -910 -430 -910 Z"></path>
                <path d=" M -570 -910 L -510 -910 C -504.481 -910 -500 -905.519 -500 -900 L -500 -900 C -500 -894.481 -504.481 -890 -510 -890 L -570 -890 C -575.519 -890 -580 -894.481 -580 -900 L -580 -900 C -580 -905.519 -575.519 -910 -570 -910 Z "></path>
                <path d="M -590 -970 L -590 -970 C -584.481 -970 -580 -965.519 -580 -960 L -580 -940 C -580 -934.481 -584.481 -930 -590 -930 L -590 -930 C -595.519 -930 -600 -934.481 -600 -940 L -600 -960 C -600 -965.519 -595.519 -970 -590 -970 Z"></path>
                <path d=" M -639.991 -960.515 C -639.72 -976.836 -626.385 -990 -610 -990 L -610 -990 C -602.32 -990 -595.31 -987.108 -590 -982.355 C -584.69 -987.108 -577.68 -990 -570 -990 L -570 -990 C -553.615 -990 -540.28 -976.836 -540.009 -960.515 C -540.001 -960.345 -540 -960.172 -540 -960 L -540 -960 L -540 -940 C -540 -934.481 -544.481 -930 -550 -930 L -550 -930 C -555.519 -930 -560 -934.481 -560 -940 L -560 -960 L -560 -960 C -560 -965.519 -564.481 -970 -570 -970 C -575.519 -970 -580 -965.519 -580 -960 L -580 -960 L -580 -960 L -580 -940 C -580 -934.481 -584.481 -930 -590 -930 L -590 -930 C -595.519 -930 -600 -934.481 -600 -940 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 L -600 -960 C -600 -965.519 -604.481 -970 -610 -970 C -615.519 -970 -620 -965.519 -620 -960 L -620 -960 L -620 -940 C -620 -934.481 -624.481 -930 -630 -930 L -630 -930 C -635.519 -930 -640 -934.481 -640 -940 L -640 -960 L -640 -960 C -640 -960.172 -639.996 -960.344 -639.991 -960.515 Z "></path>
                <path d=" M -460 -930 L -460 -900 C -460 -894.481 -464.481 -890 -470 -890 L -470 -890 C -475.519 -890 -480 -894.481 -480 -900 L -480 -930 L -508.82 -930 C -514.99 -930 -520 -934.481 -520 -940 L -520 -940 C -520 -945.519 -514.99 -950 -508.82 -950 L -431.18 -950 C -425.01 -950 -420 -945.519 -420 -940 L -420 -940 C -420 -934.481 -425.01 -930 -431.18 -930 L -460 -930 Z "></path>
                <path d="M -470 -990 L -430 -990 C -424.481 -990 -420 -985.519 -420 -980 L -420 -980 C -420 -974.481 -424.481 -970 -430 -970 L -470 -970 C -475.519 -970 -480 -974.481 -480 -980 L -480 -980 C -480 -985.519 -475.519 -990 -470 -990 Z"></path>
                <path d=" M -630 -910 L -610 -910 C -604.481 -910 -600 -905.519 -600 -900 L -600 -900 C -600 -894.481 -604.481 -890 -610 -890 L -630 -890 C -635.519 -890 -640 -894.481 -640 -900 L -640 -900 C -640 -905.519 -635.519 -910 -630 -910 Z "></path>
                <path d=" M -515 -990 L -510 -990 C -504.481 -990 -500 -985.519 -500 -980 L -500 -980 C -500 -974.481 -504.481 -970 -510 -970 L -515 -970 C -520.519 -970 -525 -974.481 -525 -980 L -525 -980 C -525 -985.519 -520.519 -990 -515 -990 Z "></path>
                <path d=" M -660 -910 L -680 -910 L -680 -980 C -680 -1007.596 -657.596 -1030 -630 -1030 L -430 -1030 C -402.404 -1030 -380 -1007.596 -380 -980 L -380 -900 C -380 -872.404 -402.404 -850 -430 -850 L -630 -850 C -657.596 -850 -680 -872.404 -680 -900 L -680 -920 L -660 -920 L -660 -900 C -660 -883.443 -646.557 -870 -630 -870 L -430 -870 C -413.443 -870 -400 -883.443 -400 -900 L -400 -980 C -400 -996.557 -413.443 -1010 -430 -1010 L -630 -1010 C -646.557 -1010 -660 -996.557 -660 -980 L -660 -910 Z "></path>
              </g>
            </svg>

            <h1
              onClick={() => (window.location.href = "/")}
              className=" cursor-pointer max-sm:sr-only mx-[4px] font-[Lexend Deca] font-[550]  px-[4px]  text-[#d1d0c5]"
            >
              <h5 className=" -mb-2 text-[7px]  text-start px-1  top">
                dev see
              </h5>
              devstype
            </h1>
          </div>
          <div className="flex  gap-4 max-sm:gap-3 items-center">
            <div onClick={() => navigate("/")} className=" cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="#686464"
                height={20}
                className="hover:fill-[#d1d0c5]"
                viewBox="0 0 24 24"
              >
                <path d="M23 4H1a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h22a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1zm-1 14H2V6h20z" />
                <path d="M8 16h8a1 1 0 0 0 0-2H8a1 1 0 0 0 0 2zM4 13h1a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2zM9 13h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2zM14 13h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2zM19 13h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2zM4 10h1a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2zM9 10h1a1 1 0 0 0 0-2H9a1 1 0 0 0 0 2zM14 10h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2zM19 10h1a1 1 0 0 0 0-2h-1a1 1 0 0 0 0 2z" />
              </svg>
            </div>
            <div
              onClick={() => navigate("/history")}
              className=" cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height={20}
                viewBox="0 0 128 128"
                className="fill-[#686464] hover:fill-[#d1d0c5]"
              >
                <path d="M128 53.279c0 5.043-4.084 9.136-9.117 9.136-.091 0-.164 0-.255-.018l-8.914 34.06H18.286L8.734 65.01C3.884 64.81 0 60.808 0 55.892c0-5.043 4.084-9.136 9.117-9.136 5.032 0 9.117 4.093 9.117 9.136a9.557 9.557 0 0 1-.492 2.997l22.081 12.919 18.671-34.371a9.1 9.1 0 0 1-4.267-7.729c0-5.043 4.084-9.136 9.117-9.136s9.117 4.093 9.117 9.136a9.1 9.1 0 0 1-4.267 7.729l18.671 34.371 24.05-14.07a9.164 9.164 0 0 1-1.149-4.459c0-5.062 4.084-9.136 9.117-9.136 5.033 0 9.117 4.075 9.117 9.136zm-18.286 46.835H18.286v7.314h91.429v-7.314z" />
              </svg>
            </div>
            <div
              onClick={() => navigate("/about")}
              className=" cursor-pointer max-sm:sr-only"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#686464"
                className="size-5 hover:stroke-[#d1d0c5]"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
            </div>
            <div
              onClick={() => navigate("/account-settings?tab=account")}
              className=" cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-5 fill-[#686464] hover:fill-[#d1d0c5]"
              >
                <path
                  fillRule="evenodd"
                  d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className=" flex gap-3 items-center ">
          <div onClick={() => navigate("/players")} className="cursor-pointer">
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#686464"
              className="size-4"
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                clipRule="evenodd"
              />
            </svg> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#686464"
              stroke="fill-gray-200"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              {/* Center user */}
              <circle cx="12" cy="7" r="3" />
              <path d="M5.5 20c0-3.6 3.1-6 6.5-6s6.5 2.4 6.5 6" />

              {/* Left user */}
              <circle cx="5" cy="9" r="2" />
              <path d="M1.5 20c0-2.5 2-4.5 4.5-4.5" />

              {/* Right user */}
              <circle cx="19" cy="9" r="2" />
              <path d="M18 15.5c2.5 0 4.5 2 4.5 4.5" />
            </svg>
          </div>
          <div
            onClick={handleModal}
            className="flex gap-1 fill-[#686464] hover:fill-gray-200  hover:text-gray-300 text-[#686464] transition-colors duration-200 cursor-pointer items-center "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4  "
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
            <div className="min-w-20  max-w-52 fill-gray-300  transition-colors duration-200 max-sm:sr-only ">
              {user.userName !== "" ? user.userName : "Anonymous"}
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-4   max-sm:sr-only "
            >
              <path d="M5.507 4.048A3 3 0 0 1 7.785 3h8.43a3 3 0 0 1 2.278 1.048l1.722 2.008A4.533 4.533 0 0 0 19.5 6h-15c-.243 0-.482.02-.715.056l1.722-2.008Z" />
              <path
                fillRule="evenodd"
                d="M1.5 10.5a3 3 0 0 1 3-3h15a3 3 0 1 1 0 6h-15a3 3 0 0 1-3-3Zm15 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm2.25.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM4.5 15a3 3 0 1 0 0 6h15a3 3 0 1 0 0-6h-15Zm11.25 3.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM19.5 18a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                clipRule="evenodd"
              />
            </svg>
            {openModal && (
              <div
                className={` w-36  flex rounded-sm flex-col min-h-full max-sm:right-2 top-14 bg-[#2c2e31] sm:right-7 xl:right-56   absolute ${
                  openModal ? "not-sr-only" : "sr-only"
                }`}
              >
                <div
                  onClick={() => navigate("/history")}
                  className="py-1  hover:bg-[#d1d0c5] hover:text-[#2c2e31] text-[#D1D0C5]  rounded-sm flex text-[12px] px-2 gap-2 justify-between items-center"
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z" />
                  </svg>
                  <div className="w-full">User Stats</div>
                </div>
                <div
                  onClick={() => navigate("/account-settings")}
                  className=" py-1 hover:bg-[#d1d0c5] hover:text-[#2c2e31]  text-[#D1D0C5]  rounded-sm flex text-[12px] px-2 gap-2 justify-between items-center"
                >
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.34 1.804A1 1 0 0 1 9.32 1h1.36a1 1 0 0 1 .98.804l.295 1.473c.497.144.971.342 1.416.587l1.25-.834a1 1 0 0 1 1.262.125l.962.962a1 1 0 0 1 .125 1.262l-.834 1.25c.245.445.443.919.587 1.416l1.473.294a1 1 0 0 1 .804.98v1.361a1 1 0 0 1-.804.98l-1.473.295a6.95 6.95 0 0 1-.587 1.416l.834 1.25a1 1 0 0 1-.125 1.262l-.962.962a1 1 0 0 1-1.262.125l-1.25-.834a6.953 6.953 0 0 1-1.416.587l-.294 1.473a1 1 0 0 1-.98.804H9.32a1 1 0 0 1-.98-.804l-.295-1.473a6.957 6.957 0 0 1-1.416-.587l-1.25.834a1 1 0 0 1-1.262-.125l-.962-.962a1 1 0 0 1-.125-1.262l.834-1.25a6.957 6.957 0 0 1-.587-1.416l-1.473-.294A1 1 0 0 1 1 10.68V9.32a1 1 0 0 1 .804-.98l1.473-.295c.144-.497.342-.971.587-1.416l-.834-1.25a1 1 0 0 1 .125-1.262l.962-.962A1 1 0 0 1 5.38 3.03l1.25.834a6.957 6.957 0 0 1 1.416-.587l.294-1.473ZM13 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="w-full">Account Settings</div>
                </div>
                <div className="py-1 hover:bg-[#d1d0c5] hover:text-[#2c2e31] text-[#D1D0C5]  rounded-sm flex text-[12px] px-2 gap-2 justify-between items-center">
                  {" "}
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
                      d="M14 10a.75.75 0 0 0-.75-.75H3.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 14 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <button
                    onClick={handleLogout}
                    className="w-full text-start cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
