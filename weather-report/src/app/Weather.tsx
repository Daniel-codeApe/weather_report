"use client"

import { useEffect, useState } from "react";
import { WeatherResponse } from "./types";



export default function Weather() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      const res = await fetch("/api/weather");
      const data = await res.json();
      setWeather(data);
    }
    fetchWeather();
  }, []);
  

  if (!weather) return <p>Loading...</p>;

    return (
    <div>
      <h2>Raw Weather Data</h2>
      <pre>{JSON.stringify(weather, null, 2)}</pre>
    </div>
  );
}
