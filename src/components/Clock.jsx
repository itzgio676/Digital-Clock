import { useEffect, useState } from "react";
import "../styles/clock.css";

const beep = new Audio("./beep.mp3");

export default function Clock() {
  const [time, setTime] = useState(new Date());
  const [is24Hour, setIs24Hour] = useState(false);
  const [temperature, setTemperature] = useState(null);
  const [unit, setUnit] = useState("F");
  const [isAnimating, setIsAnimating] = useState(false);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
  const city = "New York";

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = new Date();

      if (newTime.getMinutes() === 0 && newTime.getSeconds() === 0) {
        beep.play().catch(() => {});
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1500);
      }

      setTime(newTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchTemp() {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
        );
        const data = await res.json();
        setTemperature(data.main.temp);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    }

    if (apiKey) fetchTemp();
  }, [apiKey]);

  const formatTime = () => {
    let h = time.getHours();
    let m = time.getMinutes();
    let s = time.getSeconds();

    if (!is24Hour) {
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${pad(h)}:${pad(m)}:${pad(s)} ${ampm}`;
    }

    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  const pad = (n) => String(n).padStart(2, "0");

  const displayTemp = () => {
    if (temperature == null) return "...";
    return unit === "F"
      ? `${Math.round(temperature)} °F`
      : `${Math.round(((temperature - 32) * 5) / 9)} °C`;
  };

  return (
    <div className="clock">
      <h1 className={`clock-time ${isAnimating ? "animate-hour" : ""}`}>
        {formatTime()}
      </h1>

      <button onClick={() => setIs24Hour(!is24Hour)}>
        Toggle {is24Hour ? "12hr" : "24hr"}
      </button>

      <div className="temp">
        Temp: {displayTemp()}
        <button onClick={() => setUnit(unit === "F" ? "C" : "F")}>
          Switch to °{unit === "F" ? "C" : "F"}
        </button>
        <button
          onClick={() => {
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 1500);
            beep.play().catch(() => {});
          }}
        >
          Test hourly
        </button>
      </div>
    </div>
  );
}
