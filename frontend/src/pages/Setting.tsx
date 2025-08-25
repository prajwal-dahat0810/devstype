import Navigation from "../components/Navigation";
import { useSearchParams } from "react-router-dom";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../components/ui/animated-modal";
import axios from "axios";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../store/atoms/userAtom";
import { toast, ToastContainer } from "react-toastify";
import { ErrorAlert } from "../components/ui/ErrorAlert";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

const SettingButtons = [
  {
    id: 0,
    name: "account",
    tabName: "account",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path
          fill-rule="evenodd"
          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 1,
    name: "authentication",
    tabName: "authentication",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path
          fill-rule="evenodd"
          d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 3,
    name: "api keys",
    tabName: "apiKeys",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M6.28 5.22a.75.75 0 0 1 0 1.06L2.56 10l3.72 3.72a.75.75 0 0 1-1.06 1.06L.97 10.53a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Zm7.44 0a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L17.44 10l-3.72-3.72a.75.75 0 0 1 0-1.06ZM11.377 2.011a.75.75 0 0 1 .612.867l-2.5 14.5a.75.75 0 0 1-1.478-.255l2.5-14.5a.75.75 0 0 1 .866-.612Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
  },
  {
    id: 2,
    name: "danger zone",
    tabName: "dangerZone",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
  },
];
const AccountSettings = [
  {
    id: 0,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    name: "update account name",
    about: "Change the name of your account.",
    button: "update name",
  },
];
const authenticationSettings = [
  {
    id: 0,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    name: "change password",
    about: "Update your account password.",
    button: "change password",
  },
];
const apiKeysSettings = [
  {
    id: 0,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-4"
      >
        <path
          fill-rule="evenodd"
          d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    name: "api keys",
    about: "Generate Ape Keys to access certain API endpoints .",
    button: "generate new key",
  },
];
const dangerZoneSettings = [
  {
    id: 0,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="size-5"
      >
        <path
          fill-rule="evenodd"
          d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
          clip-rule="evenodd"
        />
      </svg>
    ),
    name: "delete account",
    about: "Deletes your account and all data connected to it.",
    button: "delete account",
  },
];
export default function Setting() {
  const setUser = useSetRecoilState(userAtom);
  const [searchParams, setSearchParams] = useSearchParams();
  const paramValue = searchParams.get("tab") || "account";
  const [updateName, setUpdateName] = useState<string>("");
  const [updateNamePassword, setUpdateNamePassword] = useState<string>("");
  async function handleUpdateName() {
    console.log("Update name clicked");
    if (updateNamePassword.length === 0 || updateName.length === 0) {
      return toast.error(
        <ErrorAlert data={{ content: "Please fill all fields" }} />,
        {
          autoClose: 3000,
          data: { content: "Please fill all fields" },
          icon: false,
          theme: "colored",
        }
      );
    }
    try {
      const response = await axios.patch(
        `${BACKEND_URL}/api/user/update`,
        {
          userName: updateName,
          password: updateNamePassword,
        },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        toast.dark("User name updated!", {
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
        setUpdateName("");
        setUpdateNamePassword("");
        const data = response.data as {
          userName: string;
          id: string;
          email: string;
        };
        setUser({
          userName: data.userName,
          id: data.id,
          email: data.email,
        });
      }
    } catch (error: any) {
      console.log(error.message, error);
      if (error.status === 401) {
        toast.error(
          <ErrorAlert data={{ content: error.response.data.message }} />,
          {
            hideProgressBar: true,
            data: { content: error.response.data.message },
            icon: false,
            theme: "colored",
          }
        );
      } else if (error.status === 409) {
        console.log("Please enter correct password");
        toast.error(
          <ErrorAlert data={{ content: error.response.data.message }} />,
          {
            hideProgressBar: true,
            data: { content: error.response.data.message },
            icon: false,
            theme: "colored",
          }
        );
      } else if (error.status === 404) {
        toast.error(
          <ErrorAlert data={{ content: error.response.data.message }} />,
          {
            hideProgressBar: true,
            data: { content: error.response.data.message },
            icon: false,
            theme: "colored",
          }
        );
      } else if (error.status === 500) {
        toast.error(
          <ErrorAlert data={{ content: error.response.data.message }} />,
          {
            hideProgressBar: true,
            data: { content: error.response.data.message },
            icon: false,
            theme: "colored",
          }
        );
      }
    }
  }
  function handleTabChange(name: string) {
    console.log("Tab changed to:", name, paramValue);
    setSearchParams({ tab: name });
  }
  return (
    <div className="min-h-screen relative bg-[#323437] flex flex-col flex-grow   max-h-full w-full items-center  ">
      <Navigation />
      <ToastContainer />
      <div className="sr-only mt-16  min-h-[100vh]  py-3 px-3 flex flex-col  h-72 max-w-7xl w-full">
        <div className=" py-2 px-3 items-center flex w-full justify-start gap-3">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#686464"
              className="size-7"
            >
              <path
                fillRule="evenodd"
                d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="text-[#646669] font-mono text-2xl">Setting</div>
        </div>
        <div className=" text-[#D1D0C5] font-mono mt-2 flex justify-between flex-col gap-3 flex-grow space-between  px-3">
          <div>This page is under development!</div>
          <div>
            Developing by{" "}
            <span
              onClick={() =>
                (window.location.href = "https://x.com/DahatPrajw56411")
              }
              className="bg-[#646669] text-[#2f3134] rounded-[2px] hover:text-[#D1D0C5] hover:bg-[#7b7e84] cursor-pointer px-1 "
            >
              Prajwal Dahat
            </span>{" "}
            !!!
          </div>
        </div>
      </div>

      <div className="  mt-16 h-full px-3  max-sm:px-1 py-3 lg:flex-row  flex-col justify-center  xl:items-baseline items-center flex max-w-6xl w-full">
        <div className=" lg:px-10 md:px-10 xl:px-3 lg:w-5/12  xl:w-5/17  w-full  max-sm:px-3    mb-6 ">
          <div className="py-4 flex bg-[#2c2e31]    rounded-lg max-sm:rounded-2xl max-sm:items-center  px-4 lg:px-3 md:flex-row lg:flex-col flex-col gap-3 max-sm:gap-2 ">
            {SettingButtons.map((button) => (
              <div
                key={button.id}
                onClick={() => handleTabChange(button.tabName)}
                className={`${
                  button.tabName === paramValue
                    ? "text-[#D1D0C5]"
                    : "text-[#646669] "
                } font-mono rounded-md cursor-pointer  py-1.5 px-2 flex  max-w-full max-sm:max-w-full  justify-start gap-3`}
              >
                <div className="w-max     rounded-full flex items-center text-md font-serif font-[1000] justify-center   ">
                  {button.icon}
                </div>
                <div className=" font-customFont ">{button.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col">
          {paramValue === "account" &&
            AccountSettings.map((tab) => (
              <div
                key={tab.id}
                className="max-w-4xl md:px-10  font-customFont w-full text-[#D1D0C5] font-mono my-2 px-3 py-2  flex xl:flex-row xl:justify-between xl:items-center flex-col gap-3 flex-grow space-between text-wrap  "
              >
                <div>
                  <div className="flex text-[#646669] py-1.5 gap-3 items-center ">
                    <div>{tab.icon}</div>
                    <div>{tab.name}</div>
                  </div>
                  <div className="">{tab.about}</div>
                </div>
                <Modal>
                  <ModalBody className="ring-[#3c3e3f] ">
                    <ModalContent className="flex gap-3 ">
                      <div className="text-2xl text-[#91969c] font-customFont">
                        Update name
                      </div>
                      <input
                        type="text"
                        placeholder="password"
                        onChange={(e) => setUpdateNamePassword(e.target.value)}
                        required={true}
                        value={updateNamePassword}
                        className="bg-[#3c3f43] ring-none outline-none  px-3 py-2 rounded-xl"
                      />
                      <input
                        type="text"
                        onChange={(e) => setUpdateName(e.target.value)}
                        required={true}
                        value={updateName}
                        placeholder="new name"
                        className="bg-[#3c3f43] ring-none outline-none px-3 py-2 rounded-xl"
                      />
                      <button
                        onClick={handleUpdateName}
                        className="mt-4 cursor-pointer w-full hover:bg-[#d1d0c5] bg-[#2c2e31] hover:text-[#56564e] text-[#1a1a1a] px-8  h-10 rounded-lg "
                      >
                        update name
                      </button>
                    </ModalContent>
                  </ModalBody>
                  <ModalTrigger className=" opacity-80 dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                    <button className="cursor-pointer hover:bg-[#d1d0c5] bg-[#2c2e31] hover:text-[#56564e] text-[#000000] px-8 xl:max-w-72 w-full h-10 rounded-lg ">
                      {tab.button}
                    </button>
                  </ModalTrigger>
                </Modal>
              </div>
            ))}
          {paramValue === "authentication" &&
            authenticationSettings.map((tab) => (
              <div
                key={tab.id}
                className="max-w-4xl md:px-10  font-customFont w-full text-[#D1D0C5] font-mono my-2 px-3 py-2  flex xl:flex-row xl:justify-between xl:items-center flex-col gap-3 flex-grow space-between text-wrap  "
              >
                <div>
                  <div className="flex text-[#646669] py-1.5 gap-3 items-center ">
                    <div>{tab.icon}</div>
                    <div>{tab.name}</div>
                  </div>
                  <div className="">{tab.about}</div>
                </div>
                <Modal>
                  <ModalBody className="ring-[#3c3e3f] ">
                    <ModalContent className="flex gap-3 items-center justify-center ">
                      <div className="text-2xl text-[#91969c] text-center font-customFont">
                        This feature is under development
                      </div>
                    </ModalContent>
                    {/* <ModalContent className=" flex gap-3 ">
                      <div className="text-2xl text-[#91969c] font-customFont">
                        Update password
                      </div>
                      <input
                        type="text"
                        placeholder="current password"
                        required={true}
                        className="bg-[#3c3f43] ring-none px-3 py-2 rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="new password"
                        required={true}
                        className="bg-[#3c3f43] ring-none px-3 py-2 rounded-xl"
                      />
                      <input
                        type="text"
                        placeholder="confirm new password"
                        required={true}
                        className="bg-[#3c3f43] ring-none px-3 py-2 rounded-xl"
                      />
                      <button className="cursor-pointer w-full hover:bg-[#d1d0c5] bg-[#2c2e31] hover:text-[#56564e] text-[#1a1a1a] px-8  h-10 rounded-lg ">
                        update password
                      </button>
                    </ModalContent> */}
                  </ModalBody>
                  <ModalTrigger className=" opacity-80 dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                    <button className="cursor-pointer hover:bg-[#d1d0c5] bg-[#2c2e31] hover:text-[#56564e] text-[#000000] px-8 xl:max-w-72 w-full h-10 rounded-lg ">
                      {tab.button}
                    </button>
                  </ModalTrigger>
                </Modal>
              </div>
            ))}
          {paramValue === "apiKeys" &&
            apiKeysSettings.map((tab) => (
              <div
                key={tab.id}
                className="max-w-4xl md:px-10  font-customFont w-full text-[#D1D0C5] font-mono my-2 px-3 py-2  flex xl:flex-row xl:justify-between xl:items-center flex-col gap-3 flex-grow space-between text-wrap  "
              >
                <div>
                  <div className="flex text-[#646669] py-1.5 gap-3 items-center ">
                    <div>{tab.icon}</div>
                    <div>{tab.name}</div>
                  </div>
                  <div className="">{tab.about}</div>
                </div>
                <Modal>
                  <ModalBody className="ring-[#3c3e3f] ">
                    <ModalContent className="flex gap-3 items-center justify-center ">
                      <div className="text-2xl text-[#91969c] font-customFont">
                        Api keys feature is under development
                      </div>
                    </ModalContent>
                  </ModalBody>
                  <ModalTrigger className=" opacity-80 dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                    <button className="cursor-pointer hover:bg-[#d1d0c5] bg-[#2c2e31] hover:text-[#56564e] text-[#000000] px-8 xl:max-w-72 w-full h-10 rounded-lg ">
                      {tab.button}
                    </button>
                  </ModalTrigger>
                </Modal>
              </div>
            ))}

          {paramValue === "dangerZone" &&
            dangerZoneSettings.map((tab) => (
              <div
                key={tab.id}
                className="max-w-4xl md:px-10  font-customFont w-full text-[#D1D0C5] font-mono my-2 px-3 py-2  flex xl:flex-row xl:justify-between xl:items-center flex-col gap-3 flex-grow space-between text-wrap  "
              >
                <div>
                  <div className="flex text-[#646669] py-1.5 gap-3 items-center ">
                    <div>{tab.icon}</div>
                    <div>{tab.name}</div>
                  </div>
                  <div className="">{tab.about}</div>
                </div>
                <Modal>
                  <ModalBody className="ring-[#3c3e3f]  ">
                    <ModalContent className="flex gap-3 items-center justify-center ">
                      <div className="text-2xl text-[#91969c] font-customFont">
                        Delete Account feature is under development.
                      </div>
                    </ModalContent>
                  </ModalBody>
                  <ModalTrigger className=" opacity-80 dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                    <button className="cursor-pointer hover:bg-[#d1d0c5] bg-[#ca4754] hover:text-[#777778] text-[#323437] px-8 xl:max-w-72 w-full h-10 rounded-lg ">
                      {tab.button}
                    </button>
                  </ModalTrigger>
                </Modal>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
