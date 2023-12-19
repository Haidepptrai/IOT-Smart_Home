import { Line } from "react-chartjs-2";
import { Typography } from "@mui/material";

const CustomLineChart = ({ name, data, options }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Typography variant="h5" className="text-lg font-semibold mb-4">
        {name}
      </Typography>
      <Line data={data} options={options} />
    </div>
  );
};

export default CustomLineChart;
