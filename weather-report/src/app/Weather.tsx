"use client";
import { useState } from "react";

export default function Home() {
  const [location, setLocation] = useState("");
  const apiKey = "C3GVKTWHX6TM4L8EF72746G55"
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    <div className="p-6">
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
        <pre className="mt-4 p-2 bg-gray-100 rounded text-sm">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
