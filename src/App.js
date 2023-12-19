import React, { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { Line } from "react-chartjs-2";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { database } from "./firebase"; // Import your Firebase configuration
import "./index.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  const [humidityData, setHumidityData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [gasWarning, setGasWarning] = useState("");
  const [lightSensor, setLightSensor] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Firebase references
    const humidityRef = ref(database, "humidity");
    const temperatureRef = ref(database, "temperature");
    const gasWarningRef = ref(database, "gasWarning");
    const lightSensorRef = ref(database, "lightSensor");

    // Subscribe to the data
    const humidityListener = onValue(humidityRef, (snapshot) => {
      const newHumidityValue = snapshot.val();
      const timestamp = new Date().toLocaleString(); // Get the current timestamp

      setHumidityData((currentHumidityData) => {
        const updatedHumidityData = [
          ...currentHumidityData,
          { humidData: newHumidityValue, time: timestamp },
        ];

        if (updatedHumidityData.length > 15) {
          updatedHumidityData.shift();
        }

        return updatedHumidityData;
      });
    });

    const temperatureListener = onValue(temperatureRef, (snapshot) => {
      const newTemperatureValue = snapshot.val();
      const timestamp = new Date().toLocaleString(); // Get the current timestamp

      setTemperatureData((currentTemperatureData) => {
        const updatedTemperatureData = [
          ...currentTemperatureData,
          { tempData: newTemperatureValue, time: timestamp },
        ];

        if (updatedTemperatureData.length > 15) {
          updatedTemperatureData.shift();
        }
        console.log(temperatureData);

        return updatedTemperatureData;
      });
    });

    const gasWarningListener = onValue(gasWarningRef, (snapshot) => {
      const data = snapshot.val();
      setGasWarning(data ? "Warning" : "No Warning");
    });

    const lightSensorListener = onValue(lightSensorRef, (snapshot) => {
      const data = snapshot.val();
      setLightSensor(data ? "Light Detected" : "No Light");
    });

    // Clean up listeners
    return () => {
      humidityListener();
      temperatureListener();
      gasWarningListener();
      lightSensorListener();
    };
  }, []);

  // Chart configuration for Humidity
  const humidityChartData = {
    labels: humidityData.map((entry) => entry.time),
    datasets: [
      {
        label: "Humidity",
        data: humidityData.map((entry) => entry.humidData),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  // Chart configuration for Temperature
  const temperatureChartData = {
    labels: temperatureData.map((entry) => entry.time),
    datasets: [
      {
        label: "Temperature",
        data: temperatureData.map((entry) => entry.tempData),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Humidity and Temperature Data",
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90, // Rotate labels to 90 degrees
          minRotation: 90, // Keep them at 90 degrees even when resizing
        },
      },
    },
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  return (
    <Box sx={{ width: "100%" }} className="px-10">
      <Box className="flex justify-between items-center mb-12">
        <Typography variant="h4" className="text-2xl font-bold text-gray-800">
          Smart House Data
        </Typography>
        <Button
          onClick={handleLogout}
          variant="contained"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Logout
        </Button>
      </Box>

      <div className="flex flex-col gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Typography variant="h5" className="text-lg font-semibold mb-4">
            Humidity Data
          </Typography>
          <Line data={humidityChartData} options={options} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Typography variant="h5" className="text-lg font-semibold mb-4">
            Temperature Data
          </Typography>
          <Line data={temperatureChartData} options={options} />
        </div>
      </div>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        <Box>
          <Typography variant="h5" className="text-lg font-semibold">
            Gas Warning
          </Typography>
          <TextField
            value={gasWarning}
            variant="outlined"
            className="bg-white p-4 rounded border border-gray-300"
            // sx={{
            //   color: gasWarning ? "black" : "red",
            // }}
            disabled
          />
        </Box>
        <Box>
          <Typography variant="h5" className="text-lg font-semibold">
            Light Sensor
          </Typography>
          <TextField
            value={lightSensor}
            variant="outlined"
            className="bg-white p-4 rounded border border-gray-300"
            // sx={{
            //   color: lightSensor == true ? "black" : "red",
            // }}
            disabled
          />
        </Box>
      </Box>
    </Box>
  );
}
