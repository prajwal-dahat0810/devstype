import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;
import { Footer } from "../components/Footer";
export const contextClass = {
  success: "bg-blue-600",
  error: "bg-red-100",
  info: "bg-gray-600",
  warning: "bg-orange-400",
  default: "bg-indigo-600",
  dark: "bg-white-600 font-gray-300",
};

export default function () {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [signupEmail, setSignupEmail] = useState<string>("");
  const [signupPassword, setSignupPassword] = useState<string>("");
  const [userName, setUsername] = useState<string>("");
  const navigate = useNavigate();

  async function handleSignup() {
    const promise: Promise<{ message: string }> = new Promise(
      (resolve, reject) => {
        if (
          signupEmail === "" ||
          signupPassword === "" ||
          signupPassword.length <= 5 ||
          userName === ""
        ) {
          if (userName === "") {
            return reject({ message: "Enter username (at least 4 character)" });
          }
          if (signupEmail === "") {
            return reject({ message: "Enter valid email" });
          }

          if (signupPassword === "" || signupPassword.length <= 5) {
            if (signupPassword === "") {
              return reject({
                message: "Please enter password",
              });
            } else {
              return reject({
                message: " Password must be at least 5 characters long!",
              });
            }
          }
        }
        if (signupEmail.match("@") === null) {
          return reject({
            message: "Please enter valid email",
          });
        }
        axios
          .post(
            `${BACKEND_URL}/signup`,
            {
              userName,
              password: signupPassword,
              email: signupEmail,
            },
            {
              withCredentials: true,
              headers: {
                Authorization: "application/json",
              },
            }
          )
          .then((data) => {
            setSignupEmail("");
            setSignupPassword("");
            setUsername("");
            console.log(data, "daa");
            if (data.status === 200) {
              resolve({ message: "User created successfully!" });
            }
          })
          .catch((error) => {
            if (error.message === "Network Error")
              reject({ message: error.message });

            reject({
              message: error.response.data.message,
              status: error.response.status,
            });
          });
      }
    );

    toast.promise(promise, {
      loading: "Loading...",
      success: (data: { message: string }) => {
        setTimeout(() => {
          toast.info("Login now !");
        }, 1000);
        return `${data.message}`;
      },
      error: (data: { message: string; status: number }) => {
        return `${data.message}`;
      },
      toasterId: window.innerWidth > 425 ? "bigScreen" : "smallScreen",
    });
  }

  async function handleLogin() {
    const promise: Promise<{ message: string }> = new Promise(
      (resolve, reject) => {
        if (email === "" || password === "" || password.length <= 5) {
          if (email === "") {
            reject({ message: "Please enter email" });
          }
          if (password === "") {
            reject({ message: "Please enter password" });
          }
          if (password.length <= 5) {
            return reject({ message: "Password should be min 5 character" });
          }
        }
        if (email.match("@") === null) {
          return reject({ message: "Enter a valid email" });
        }
        axios
          .post(
            `${BACKEND_URL}/signin`,
            {
              email,
              password,
            },
            {
              withCredentials: true,
              headers: {
                Authorization: "application/json",
              },
            }
          )
          .then((res) => {
            console.log(res.data);
            if (res.status === 200) {
              resolve({ message: "Signin successfully !" });
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.message === "Network Error")
              reject({ message: err.message });

            reject({
              message: err.response.data.message,
              status: err.response.status,
            });
          });
      }
    );
    toast.promise(promise, {
      loading: "Loading...",
      success: (data: { message: string }) => {
        return `${data.message}`;
      },
      error: (data: { message: string; status: number }) => {
        return `${data.message}`;
      },
      toasterId: window.innerWidth > 425 ? "bigScreen" : "smallScreen",
    });
  }

  return (
    <div className="min-h-[100vh]   bg-[#323437] flex flex-col  flex-grow justify-center  max-h-full w-full items-center  ">
      <div className="   bg-[#323437] flex  flex-grow justify-center  h-full w-full items-center  ">
        <div className=" min-h-80  max-sm:min-h-max grid col-span-full my-4  w-full   max-w-5xl">
          <div className="col-start-1 max-sm:mt-10 col-span-1 max-sm:col-start-1 max-sm:row-start-2 max-sm:col-span-2 flex flex-col  max-w-xl items-center justify-center ">
            <div className="flex  gap-3 py-4   justify-center items-center max-w-[300px] w-full  flex-col">
              <div className="w-full text-[#646669] px-2 flex justify-start items-center  gap-1 font-mono ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
                  </svg>
                </div>
                <div>register</div>
              </div>
              <input
                type="text"
                aria-label=""
                className="w-full text-[#d1d0c5]  focus:outline-2 focus:outline-amber-200   px-2 py-2  font-mono placeholder:text-[#696a6c] bg-[#2C2E31] p-1 rounded-sm "
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                value={userName}
              />
              <input
                type="text"
                aria-label=""
                value={signupEmail}
                className="w-full text-[#d1d0c5]  focus:outline-2 focus:outline-amber-200    px-2 py-2  font-mono placeholder:text-[#696a6c] bg-[#2C2E31] p-1 rounded-sm "
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="email"
              />
              <input
                type="text"
                aria-label=""
                className="w-full text-[#d1d0c5]  focus:outline-2 focus:outline-amber-200    px-2 py-2  font-mono placeholder:text-[#696a6c] bg-[#2C2E31] p-1 rounded-sm "
                onChange={(e) => setSignupPassword(e.target.value)}
                placeholder="password"
                value={signupPassword}
              />
              <button
                onClick={handleSignup}
                className="w-full cursor-pointer hover:bg-[#d1d0c5] hover:text-[#323437] py-1.5  text-[#646669] flex justify-center items-center gap-2   px-2   font-mono  bg-[#35383c] p-1 rounded-sm "
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path d="M10 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM16.25 5.75a.75.75 0 0 0-1.5 0v2h-2a.75.75 0 0 0 0 1.5h2v2a.75.75 0 0 0 1.5 0v-2h2a.75.75 0 0 0 0-1.5h-2v-2Z" />
                  </svg>
                </div>{" "}
                sign up
              </button>
            </div>
          </div>
          <div className="col-start-2 max-sm:mt-36 max-sm:col-start-1 max-sm:row-start-3 max-sm:col-span-2  col-span-1 flex flex-col  max-w-xl items-center justify-center ">
            <div className="flex  gap-3 py-4   justify-center items-center max-w-[300px] w-full  flex-col">
              <div className="w-full text-[#646669] px-2 flex justify-start items-center  gap-3 font-mono ">
                <div className="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M1 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H1.75A.75.75 0 0 1 1 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>login</div>
              </div>
              <input
                type="text"
                aria-label=""
                className="w-full text-[#d1d0c5]   focus:outline-2 focus:outline-amber-200   px-2 py-2  font-mono placeholder:text-[#696a6c] bg-[#2C2E31] p-1 rounded-sm "
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
              />
              <input
                type="text"
                aria-label=""
                className="w-full text-[#d1d0c5]    focus:outline-2 focus:outline-amber-200  px-2 py-2  font-mono placeholder:text-[#696a6c] bg-[#2C2E31] p-1 rounded-sm "
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
              <button
                onClick={handleLogin}
                className="w-full cursor-pointer hover:bg-[#d1d0c5] hover:text-[#323437] py-1.5  text-[#646669] flex justify-center items-center gap-2   px-2   font-mono  bg-[#35383c] p-1 rounded-sm " // onClick={handleLogin}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="size-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M17 4.25A2.25 2.25 0 0 0 14.75 2h-5.5A2.25 2.25 0 0 0 7 4.25v2a.75.75 0 0 0 1.5 0v-2a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 .75.75v11.5a.75.75 0 0 1-.75.75h-5.5a.75.75 0 0 1-.75-.75v-2a.75.75 0 0 0-1.5 0v2A2.25 2.25 0 0 0 9.25 18h5.5A2.25 2.25 0 0 0 17 15.75V4.25Z"
                      clipRule="evenodd"
                    />
                    <path
                      fillRule="evenodd"
                      d="M1 10a.75.75 0 0 1 .75-.75h9.546l-1.048-.943a.75.75 0 1 1 1.004-1.114l2.5 2.25a.75.75 0 0 1 0 1.114l-2.5 2.25a.75.75 0 1 1-1.004-1.114l1.048-.943H1.75A.75.75 0 0 1 1 10Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                sign in
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
