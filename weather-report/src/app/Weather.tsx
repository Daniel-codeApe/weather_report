"use client";
import { useState } from "react";
import { WeatherResponse } from "./types";

export default function Home() {
  const [location, setLocation] = useState("");
  const apiKey = "C3GVKTWHX6TM4L8EF72746G55"
  const [result, setResult] = useState<WeatherResponse>({});
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  async function fetchWeather() {
    setLoading(true); // show processing button
    const res = await fetch("/api/weather", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ location: location, apiKey: apiKey }),
    });

    const data = await res.json();
    setLoading(false)
    setResult(data);
  }

  return (
    <div className="p-6 align-baseline">
      <h1 className="text-xl font-bold">Weather App</h1>

      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="border p-2 mr-2"
      />

      <button
      onClick={fetchWeather}
      disabled={loading}
      className={`px-4 py-2 rounded text-white ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {loading ? "Processing..." : "Get Weather"}
    </button>

      {result && (
        <div className="grid grid-cols-2 gap-4 mt-4 p-2 bg-gray-100 rounded text-sm text-center">
          {result.days ? (result.days.map((day, index) => {
            // First card: full row with all details
            if (index === 0) {
              return (
              <div
                key={index}
                className={"col-span-2 rounded overflow-hidden shadow-lg bg-white"}
              >
                <div className="px-6 py-4">
                  <p className="font-bold text-xl mb-2">
                    <strong>{day.datetime}:</strong>
                  </p>
                  <div className="text-gray-700 text-base">
                    <p>{day.tempmax}°C max,</p>
                    <p>{day.tempmin}°C min,</p>
                    <p>Feels like: {day.feelslike}°C</p>
                    <p>Conditions: {day.conditions}</p>
                    <p>Description: {day.description}</p>
                    <p>Humidity: {day.humidity}%</p>
                    <p>Sun rise: {day.sunrise}</p>
                    <p>Sun set: {day.sunset}</p>
                    <p>UV Index: {day.uvindex}</p>
                    <p>Wind Speed: {day.windspeed} km/h</p>
                  </div>
                </div>
              </div>
      )
            }
            // Other cards: collapsible
           const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded overflow-hidden shadow-lg bg-white"
              >
                <button
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="w-full text-left px-6 py-4 focus:outline-none"
                >
                  <p className="font-bold text-lg mb-2">
                    {day.datetime}
                  </p>
                  <div className="text-gray-700">
                    <p>{day.tempmax}°C max</p>
                    <p>{day.tempmin}°C min</p>
                    <p>Conditions: {day.conditions}</p>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 text-gray-600 border-t">
                    <p>Feels like: {day.feelslike}°C</p>
                    <p>Description: {day.description}</p>
                    <p>Humidity: {day.humidity}%</p>
                    <p>Sunrise: {day.sunrise}</p>
                    <p>Sunset: {day.sunset}</p>
                    <p>UV Index: {day.uvindex}</p>
                    <p>Wind Speed: {day.windspeed} km/h</p>
                  </div>
                )}
              </div>
            );
    })) : "No data available"}
  </div>
      )}
      <script src="node_modules/@material-tailwind/html/scripts/collapse.js"></script>
    </div>
  );
}
