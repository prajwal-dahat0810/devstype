import { Footer } from "../components/Footer";
import Navigation from "../components/Navigation";

export default function Setting() {
  return (
    <div className="min-h-screen relative bg-[#323437] flex flex-col flex-grow   max-h-full w-full items-center  ">
      <Navigation />
      <div className="mt-16 min-h-full py-3 px-3 flex flex-col  h-72 max-w-5xl w-full">
        <div className=" py-2 px-3 items-center flex w-full justify-start gap-3">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#686464"
              className="size-7"
            >
              <path
                fill-rule="evenodd"
                d="M11.828 2.25c-.916 0-1.699.663-1.85 1.567l-.091.549a.798.798 0 0 1-.517.608 7.45 7.45 0 0 0-.478.198.798.798 0 0 1-.796-.064l-.453-.324a1.875 1.875 0 0 0-2.416.2l-.243.243a1.875 1.875 0 0 0-.2 2.416l.324.453a.798.798 0 0 1 .064.796 7.448 7.448 0 0 0-.198.478.798.798 0 0 1-.608.517l-.55.092a1.875 1.875 0 0 0-1.566 1.849v.344c0 .916.663 1.699 1.567 1.85l.549.091c.281.047.508.25.608.517.06.162.127.321.198.478a.798.798 0 0 1-.064.796l-.324.453a1.875 1.875 0 0 0 .2 2.416l.243.243c.648.648 1.67.733 2.416.2l.453-.324a.798.798 0 0 1 .796-.064c.157.071.316.137.478.198.267.1.47.327.517.608l.092.55c.15.903.932 1.566 1.849 1.566h.344c.916 0 1.699-.663 1.85-1.567l.091-.549a.798.798 0 0 1 .517-.608 7.52 7.52 0 0 0 .478-.198.798.798 0 0 1 .796.064l.453.324a1.875 1.875 0 0 0 2.416-.2l.243-.243c.648-.648.733-1.67.2-2.416l-.324-.453a.798.798 0 0 1-.064-.796c.071-.157.137-.316.198-.478.1-.267.327-.47.608-.517l.55-.091a1.875 1.875 0 0 0 1.566-1.85v-.344c0-.916-.663-1.699-1.567-1.85l-.549-.091a.798.798 0 0 1-.608-.517 7.507 7.507 0 0 0-.198-.478.798.798 0 0 1 .064-.796l.324-.453a1.875 1.875 0 0 0-.2-2.416l-.243-.243a1.875 1.875 0 0 0-2.416-.2l-.453.324a.798.798 0 0 1-.796.064 7.462 7.462 0 0 0-.478-.198.798.798 0 0 1-.517-.608l-.091-.55a1.875 1.875 0 0 0-1.85-1.566h-.344ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div className="text-[#646669] font-mono text-2xl">Setting</div>
        </div>
        <div className="text-[#D1D0C5] font-mono mt-2 flex justify-between flex-col gap-3 flex-grow space-between  px-3">
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
      <div className="wrapper mt-10 absolute bottom-0 left-0 w-full flex flex-col items-center gap-2">
        <Footer />
      </div>
    </div>
  );
}
