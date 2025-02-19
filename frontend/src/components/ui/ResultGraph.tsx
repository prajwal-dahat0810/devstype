import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
} from "recharts";
export const ResultGraph = ({ wpmData }: any) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        className=""
        data={wpmData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey="time"
          // label={{
          //   value: "Time (s)",
          //   fontSize: "12px",
          //   position: "insideBottom",
          //   offset: -10,
          // }}
          tick={{ strokeWidth: 0.4, fontWeight: "500", fontSize: "10px" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ strokeWidth: 0.4, fontWeight: "500", fontSize: "10px" }}
          label={{
            value: "Words Per Minute ",
            angle: -90,
            fontSize: "10px",
            fontWeight: "450",
            position: "middle",
          }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          viewBox={{ width: 1100, height: 12 }}
          contentStyle={{
            background: "#27282b",
            fontFamily: "monospace",
            color: "#d1d0c5",
            border: "none",
          }}
          cursor={false}
        />
        <Line
          animationBegin={200}
          animationEasing="ease-out"
          type="monotone"
          animationDuration={4000}
          dataKey="wpm"
          stroke="#e4d037"
          strokeWidth={2.2}
          dot={{ r: 0, fill: "yellow" }}
          activeDot={{ stroke: "yellow", r: 1 }}
          className="bg-amber-600"
        />
        <Line
          animationBegin={200}
          animationEasing="ease-out"
          animationDuration={4000}
          type="monotone"
          dataKey="accuracy"
          stroke="green"
          strokeWidth={2.2}
          dot={{ r: 0 }}
          activeDot={{ r: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
