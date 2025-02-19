import { ToastContentProps } from "react-toastify";
import cx from "clsx";
type Props = Partial<ToastContentProps> & {
  data: any;
};
export const ErrorAlert = ({ data }: { data: { content: string } }) => {
  return (
    <div className="flex flex-col w-full">
      <div className={cx("text-sm font-semibold -mt-2 text-[#f7e9e9]")}>
        error
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm">{data.content}</p>
      </div>
    </div>
  );
};
