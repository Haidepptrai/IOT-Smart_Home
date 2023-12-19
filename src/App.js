import React, { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { signOut } from "firebase/auth";
import { auth } from "./firebase/firebase";
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
import { database } from "./firebase/firebase"; // Import your Firebase configuration
import "./index.css";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Alert, Fade, Modal } from "@mui/material";
import CustomLineChart from "./component/LineChart";

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
  const navigate = useNavigate();
  const [humidityData, setHumidityData] = useState([]);
  const [temperatureData, setTemperatureData] = useState([]);
  const [gasWarning, setGasWarning] = useState("");
  const [lightSensor, setLightSensor] = useState("");

  //Handle modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    // Load initial data from local storage
    const savedHumidityData =
      JSON.parse(localStorage.getItem("humidityData")) || [];
    const savedTemperatureData =
      JSON.parse(localStorage.getItem("temperatureData")) || [];

    setHumidityData(savedHumidityData);
    setTemperatureData(savedTemperatureData);

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

        localStorage.setItem(
          "humidityData",
          JSON.stringify(updatedHumidityData)
        );
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

        localStorage.setItem(
          "temperatureData",
          JSON.stringify(updatedTemperatureData)
        );
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
    <Box
      sx={{ width: "100%" }}
      className="px-10 pt-10 bg-gradient-to-r from-cyan-500 to-blue-500"
    >
      <Box className="flex justify-between items-center mb-12">
        <Typography variant="h4" className="text-2xl font-bold text-gray-800">
          Smart House Data
        </Typography>
        <Button onClick={handleOpen} variant="contained" color="error">
          Logout
        </Button>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                fontWeight={700}
                component="h2"
              >
                Confirm Logout
              </Typography>
              <Typography id="transition-modal-description" sx={{ mt: 2 }}>
                Do you want to logout?
              </Typography>
              <Box className="flex justify-end">
                <Button
                  onClick={handleLogout}
                  variant="contained"
                  color="error"
                  className="text-white px-4 py-2 rounded"
                >
                  Yes
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      </Box>

      <div className="flex flex-col gap-8">
        <CustomLineChart
          name={"Humid Data"}
          data={humidityChartData}
          options={options}
        />
        <CustomLineChart
          name={"Temperature Data"}
          data={temperatureChartData}
          options={options}
        />
      </div>

      <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8">
        <Box>
          <Typography variant="h5" className="text-lg font-semibold">
            Gas Warning
          </Typography>

          {gasWarning === "Warning" ? (
            <Alert severity="error" variant="filled">
              Gas Warning
            </Alert>
          ) : (
            <Alert variant="filled" severity="success">
              No Gas Detected
            </Alert>
          )}
        </Box>
        <Box>
          <Typography variant="h5" className="text-lg font-semibold">
            Light Sensor
          </Typography>
          {lightSensor === "No Light" ? (
            <Alert severity="error" variant="filled">
              No Light
            </Alert>
          ) : (
            <Alert variant="filled" severity="success">
              Light Detected
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
