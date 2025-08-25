import { Footer } from "../components/Footer";
import Navigation from "../components/Navigation";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalTrigger,
} from "../components/ui/animated-modal";

const ContactButtons = [
  {
    id: 1,
    name: "Mail",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="size-6 "
      >
        <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
        <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
      </svg>
    ),
    link: "mailto:dahatprajwal19@gmail.com",
  },
  {
    id: 2,
    name: "Discord",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        className="size-6 "
        viewBox="0 0 50 50"
      >
        <path d="M 41.625 10.769531 C 37.644531 7.566406 31.347656 7.023438 31.078125 7.003906 C 30.660156 6.96875 30.261719 7.203125 30.089844 7.589844 C 30.074219 7.613281 29.9375 7.929688 29.785156 8.421875 C 32.417969 8.867188 35.652344 9.761719 38.578125 11.578125 C 39.046875 11.867188 39.191406 12.484375 38.902344 12.953125 C 38.710938 13.261719 38.386719 13.429688 38.050781 13.429688 C 37.871094 13.429688 37.6875 13.378906 37.523438 13.277344 C 32.492188 10.15625 26.210938 10 25 10 C 23.789063 10 17.503906 10.15625 12.476563 13.277344 C 12.007813 13.570313 11.390625 13.425781 11.101563 12.957031 C 10.808594 12.484375 10.953125 11.871094 11.421875 11.578125 C 14.347656 9.765625 17.582031 8.867188 20.214844 8.425781 C 20.0625 7.929688 19.925781 7.617188 19.914063 7.589844 C 19.738281 7.203125 19.34375 6.960938 18.921875 7.003906 C 18.652344 7.023438 12.355469 7.566406 8.320313 10.8125 C 6.214844 12.761719 2 24.152344 2 34 C 2 34.175781 2.046875 34.34375 2.132813 34.496094 C 5.039063 39.605469 12.972656 40.941406 14.78125 41 C 14.789063 41 14.800781 41 14.8125 41 C 15.132813 41 15.433594 40.847656 15.621094 40.589844 L 17.449219 38.074219 C 12.515625 36.800781 9.996094 34.636719 9.851563 34.507813 C 9.4375 34.144531 9.398438 33.511719 9.765625 33.097656 C 10.128906 32.683594 10.761719 32.644531 11.175781 33.007813 C 11.234375 33.0625 15.875 37 25 37 C 34.140625 37 38.78125 33.046875 38.828125 33.007813 C 39.242188 32.648438 39.871094 32.683594 40.238281 33.101563 C 40.601563 33.515625 40.5625 34.144531 40.148438 34.507813 C 40.003906 34.636719 37.484375 36.800781 32.550781 38.074219 L 34.378906 40.589844 C 34.566406 40.847656 34.867188 41 35.1875 41 C 35.199219 41 35.210938 41 35.21875 41 C 37.027344 40.941406 44.960938 39.605469 47.867188 34.496094 C 47.953125 34.34375 48 34.175781 48 34 C 48 24.152344 43.785156 12.761719 41.625 10.769531 Z M 18.5 30 C 16.566406 30 15 28.210938 15 26 C 15 23.789063 16.566406 22 18.5 22 C 20.433594 22 22 23.789063 22 26 C 22 28.210938 20.433594 30 18.5 30 Z M 31.5 30 C 29.566406 30 28 28.210938 28 26 C 28 23.789063 29.566406 22 31.5 22 C 33.433594 22 35 23.789063 35 26 C 35 28.210938 33.433594 30 31.5 30 Z"></path>
      </svg>
    ),
    link: "https://discord.gg/UWVZy3KE",
  },
  {
    id: 3,
    name: "Twitter",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        className="size-6 "
        viewBox="0 0 50 50"
      >
        <path d="M 50.0625 10.4375 C 48.214844 11.257813 46.234375 11.808594 44.152344 12.058594 C 46.277344 10.785156 47.910156 8.769531 48.675781 6.371094 C 46.691406 7.546875 44.484375 8.402344 42.144531 8.863281 C 40.269531 6.863281 37.597656 5.617188 34.640625 5.617188 C 28.960938 5.617188 24.355469 10.21875 24.355469 15.898438 C 24.355469 16.703125 24.449219 17.488281 24.625 18.242188 C 16.078125 17.8125 8.503906 13.71875 3.429688 7.496094 C 2.542969 9.019531 2.039063 10.785156 2.039063 12.667969 C 2.039063 16.234375 3.851563 19.382813 6.613281 21.230469 C 4.925781 21.175781 3.339844 20.710938 1.953125 19.941406 C 1.953125 19.984375 1.953125 20.027344 1.953125 20.070313 C 1.953125 25.054688 5.5 29.207031 10.199219 30.15625 C 9.339844 30.390625 8.429688 30.515625 7.492188 30.515625 C 6.828125 30.515625 6.183594 30.453125 5.554688 30.328125 C 6.867188 34.410156 10.664063 37.390625 15.160156 37.472656 C 11.644531 40.230469 7.210938 41.871094 2.390625 41.871094 C 1.558594 41.871094 0.742188 41.824219 -0.0585938 41.726563 C 4.488281 44.648438 9.894531 46.347656 15.703125 46.347656 C 34.617188 46.347656 44.960938 30.679688 44.960938 17.09375 C 44.960938 16.648438 44.949219 16.199219 44.933594 15.761719 C 46.941406 14.3125 48.683594 12.5 50.0625 10.4375 Z"></path>
      </svg>
    ),
    link: "https://x.com/DahatPrajw56411",
  },
  {
    id: 4,
    name: "Github",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        className="size-6 "
        viewBox="0 0 30 30"
      >
        <path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path>
      </svg>
    ),
    link: "https://github.com/prajwal-dahat0810/devstype/",
  },
];
export default function About() {
  return (
    <div className="min-h-screen relative bg-[#323437] flex flex-col flex-grow   max-h-full w-full items-center  ">
      <Navigation />
      <div className="mt-16 h-full py-3 px-3   max-w-5xl w-full">
        <div className=" py-2 px-3 text-[#646669] flex w-full flex-col justify-center items-center  font-mono">
          <div className="">
            This was developed with inspiration from{" "}
            <span className=" hover:text-[#D1D0C5]">Monkeytype</span>.
          </div>
          <div className="">
            <span className="underline hover:text-[#D1D0C5]">Supported</span>{" "}
            and expanded by many awesome people.
          </div>
          <div className="">Launched on 19th of Feb, 2025.</div>
        </div>
        <div className=" py-2 px-3 flex w-full justify-start gap-3">
          <div className="w-8 h-8 rounded-full flex items-center text-2xl font-serif font-[1000] justify-center text-[#323437]  bg-[#646669]">
            i
          </div>
          <div className="text-[#646669] font-mono text-2xl">about</div>
        </div>
        <div className="text-[#D1D0C5] font-mono my-2 flex  flex-col gap-3 flex-grow space-between text-wrap px-3">
          <div>
            This is develop only for side project that helps people to chill and
            helps to better his typing speed with competition.
            <br />
            Test yourself in words mode, track your progress and improve your
            speed.
            <br />
            Results will show your word count other metric like accuracy, words
            per minute.
            <br />
          </div>
          <div>
            Develop by{" "}
            <span
              onClick={() => (
                window.open("https://x.com/DahatPrajw56411"), "_blank"
              )}
              className="bg-[#646669] hover:bg-[#7b7e84] hover:text-[#D1D0C5] text-[#2f3134] rounded-[2px] cursor-pointer px-1 "
            >
              Prajwal Dahat
            </span>{" "}
            !!!
          </div>
        </div>{" "}
        <div className="mt-16 h-full py-3 px-3   max-w-5xl w-full">
          <div className=" py-2  flex w-full items-center justify-start gap-3">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#646669"
                className="size-8  "
              >
                <path
                  fill-rule="evenodd"
                  d="M19.449 8.448 16.388 11a4.52 4.52 0 0 1 0 2.002l3.061 2.55a8.275 8.275 0 0 0 0-7.103ZM15.552 19.45 13 16.388a4.52 4.52 0 0 1-2.002 0l-2.55 3.061a8.275 8.275 0 0 0 7.103 0ZM4.55 15.552 7.612 13a4.52 4.52 0 0 1 0-2.002L4.551 8.45a8.275 8.275 0 0 0 0 7.103ZM8.448 4.55 11 7.612a4.52 4.52 0 0 1 2.002 0l2.55-3.061a8.275 8.275 0 0 0-7.103 0Zm8.657-.86a9.776 9.776 0 0 1 1.79 1.415 9.776 9.776 0 0 1 1.414 1.788 9.764 9.764 0 0 1 0 10.211 9.777 9.777 0 0 1-1.415 1.79 9.777 9.777 0 0 1-1.788 1.414 9.764 9.764 0 0 1-10.212 0 9.776 9.776 0 0 1-1.788-1.415 9.776 9.776 0 0 1-1.415-1.788 9.764 9.764 0 0 1 0-10.212 9.774 9.774 0 0 1 1.415-1.788A9.774 9.774 0 0 1 6.894 3.69a9.764 9.764 0 0 1 10.211 0ZM14.121 9.88a2.985 2.985 0 0 0-1.11-.704 3.015 3.015 0 0 0-2.022 0 2.985 2.985 0 0 0-1.11.704c-.326.325-.56.705-.704 1.11a3.015 3.015 0 0 0 0 2.022c.144.405.378.785.704 1.11.325.326.705.56 1.11.704.652.233 1.37.233 2.022 0a2.985 2.985 0 0 0 1.11-.704c.326-.325.56-.705.704-1.11a3.016 3.016 0 0 0 0-2.022 2.985 2.985 0 0 0-.704-1.11Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>

            <div className="text-[#646669] font-mono text-2xl">support</div>
          </div>
          <div className="text-[#D1D0C5] font-mono my-2 flex  flex-col gap-3 flex-grow space-between text-wrap ">
            <div>
              Thanks to everyone who has supported this project. It would not be
              possible without you and your continued support.
            </div>

            <Modal>
              <ModalBody className="ring-[#3c3e3f] ">
                {/* <ModalContent className="flex gap-3 items-center justify-center ">
                  <div className="text-2xl text-[#91969c] text-center font-customFont">
                    This feature is under development
                  </div>
                </ModalContent> */}
                <ModalContent className="max-w-3xl flex gap-3 ">
                  <div className="text-2xl text-[#91969c] font-customFont">
                    Support Monkeytype
                  </div>
                  <div className="px-2">
                    Thank you so much for thinking about supporting this
                    project.
                  </div>

                  <button
                    onClick={() =>
                      window.open("https://ko-fi.com/devstype", "blank")
                    }
                    className="cursor-pointer w-full hover:bg-[#d1d0c5] bg-[#2c2e31] fill-[#1a1a1a] hover:fill-[#56564e] hover:text-[#56564e] text-[#1a1a1a] px-8 py-8  flex justify-center items-center rounded-lg "
                  >
                    <svg
                      id="Layer_1"
                      data-name="Layer 1"
                      className="h-10 w-10 "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 122.88 118.19"
                    >
                      <defs>
                        <style>.cls-1</style>
                      </defs>
                      <title>loan</title>
                      <path
                        className="cls-1"
                        d="M103.91,75.47,79.13,88.28,77.39,85,95.1,75.86l.23-.11A3.49,3.49,0,0,0,96.78,71l-.84-1.58.06,0-4.07-7.52L76.12,32.11l3.73-1.94,24.06,45.3Zm7.18,8.66h10.74a1,1,0,0,1,1,1.05v26.06a1.07,1.07,0,0,1-1,1.06H111.09a1.07,1.07,0,0,1-1.06-1.06V85.18a1.06,1.06,0,0,1,1.06-1.05ZM106.59,110V86.47H96c-4.49.81-9,3.24-13.47,6.07H74.31c-3.73.22-5.68,4-2.06,6.48,2.89,2.11,6.69,2,10.59,1.64,2.69-.13,2.81,3.48,0,3.49-1,.08-2-.15-3-.15-4.87,0-8.87-.94-11.32-4.78l-1.24-2.88L55.09,90.28c-6.12-2-10.47,4.39-6,8.84a160.53,160.53,0,0,0,27.24,16c6.75,4.11,13.51,4,20.25,0l10-5.15ZM14.49,9.5a1.9,1.9,0,0,1,.31-1.18C15.45,7.45,17,7.7,18,7.7a14.49,14.49,0,0,0,3.08-.24A35.78,35.78,0,0,0,25.48,6c3.73-1.34,7.08-2.33,10.64-3.62,8-2.87,5.6-3.49,13.81,0A89.24,89.24,0,0,1,60.24,7.55a6.45,6.45,0,0,1,1.31.94,6.19,6.19,0,0,1,1,1.32c3.14,4.57,5.83,9.2,8.41,13.83.87,1.63,1.23,3.17.64,4.14-2.43,4-6.8-1.69-11.5-5.46-2-1.59-4.67-3-7-4.61-3-1.24-4.36-2.42-7.55-3.09-4.89-.42-5.29,6.6,1.14,6.86C51,21.65,60,25.61,62.56,29.25c2.36,3.4,1.06,6.74-3.74,6.62l-4-.75c-6.39-1.2-6.21-1.44-12.86-.2-3.57.66-7.31,1.35-11,.66-2.24-.41-3.42-1.31-5.42-2.84a17.81,17.81,0,0,0-3.18-2.22,12,12,0,0,0-2.92-1.24c-1.53-.37-3.69.15-4.58-1.17a2.4,2.4,0,0,1-.37-1.31V9.5ZM1,5.16H11a1,1,0,0,1,1,1V30.44a1,1,0,0,1-1,1H1a1,1,0,0,1-1-1V6.15a1,1,0,0,1,1-1ZM69,50.75a6.79,6.79,0,1,1-6.78,6.78A6.79,6.79,0,0,1,69,50.75Zm3.12-19L94,73,67.6,86.66,43.89,42.07l8.33-4.31.29.06,5.75,1.07a2.63,2.63,0,0,0,.49,0,10.47,10.47,0,0,0,3.12-.35L54.31,42.5a4.4,4.4,0,0,1-1.88,5.93L67.34,76a4.4,4.4,0,0,1,5.93,1.88l10.44-5.41a4.39,4.39,0,0,1,1.88-5.92L70.69,39h0a4.4,4.4,0,0,1-5.93-1.89l-.14.08a6,6,0,0,0,1.45-1.79,6.37,6.37,0,0,0,.71-2.79,7,7,0,0,0,0-1c2,1,3.75,1.18,5.35.15Z"
                      />
                    </svg>
                    Donate
                  </button>
                </ModalContent>
              </ModalBody>
              <ModalTrigger className=" opacity-80 dark:bg-white dark:text-black text-white flex justify-center group/modal-btn">
                <button className="hover:bg-[#d1d0c5] hover:text-[#323437] rounded-lg bg-[#2c2e31] py-8 w-full text-[#D1D0C5] font-normal font-mono text-2xl">
                  <div className="flex gap-2 items-center justify-center ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      className="size-8  "
                      fill="currentColor"
                    >
                      <path d="M10.464 8.746c.227-.18.497-.311.786-.394v2.795a2.252 2.252 0 0 1-.786-.393c-.394-.313-.546-.681-.546-1.004 0-.323.152-.691.546-1.004ZM12.75 15.662v-2.824c.347.085.664.228.921.421.427.32.579.686.579.991 0 .305-.152.671-.579.991a2.534 2.534 0 0 1-.921.42Z" />
                      <path
                        fill-rule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v.816a3.836 3.836 0 0 0-1.72.756c-.712.566-1.112 1.35-1.112 2.178 0 .829.4 1.612 1.113 2.178.502.4 1.102.647 1.719.756v2.978a2.536 2.536 0 0 1-.921-.421l-.879-.66a.75.75 0 0 0-.9 1.2l.879.66c.533.4 1.169.645 1.821.75V18a.75.75 0 0 0 1.5 0v-.81a4.124 4.124 0 0 0 1.821-.749c.745-.559 1.179-1.344 1.179-2.191 0-.847-.434-1.632-1.179-2.191a4.122 4.122 0 0 0-1.821-.75V8.354c.29.082.559.213.786.393l.415.33a.75.75 0 0 0 .933-1.175l-.415-.33a3.836 3.836 0 0 0-1.719-.755V6Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    <span>support</span>
                  </div>
                </button>
              </ModalTrigger>
            </Modal>
          </div>
        </div>
        <div className="mt-16 h-full py-3 px-3   max-w-5xl w-full">
          <div className=" py-2  flex w-full items-center justify-start gap-3">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="#646669"
                className="size-8"
              >
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
            </div>

            <div className="text-[#646669] font-mono text-2xl">support</div>
          </div>
          <div className="text-[#D1D0C5] font-mono my-2 flex  flex-col gap-3 flex-grow space-between text-wrap ">
            <div>
              If you encounter a bug, have a feature request or just want to say
              hi - here are the different ways you can contact me directly.
            </div>
            <div className="flex max-sm:flex-col gap-3">
              {ContactButtons.map((button) => (
                <button
                  key={button.id}
                  onClick={() => window.open(button.link, "_blank")}
                  className="hover:bg-[#d1d0c5] hover:text-[#323437] rounded-lg bg-[#2c2e31] py-5 w-full text-[#D1D0C5] fill-[#D1D0C5] hover:fill-[#323437] font-normal font-mono text-2xl max-sm:text-[18px]"
                >
                  <div className="flex gap-2 items-center justify-center ">
                    <span className="">{button.icon}</span>
                    <span>{button.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="bottom-0">
        <Footer />
      </div>
    </div>
  );
}
