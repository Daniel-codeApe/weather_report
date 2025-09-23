'use client'
import { useState } from 'react'
import { WeatherResponse } from './types'
import { IoRainyOutline } from 'react-icons/io5'
import { CiCloudSun } from 'react-icons/ci'
import { CiSun } from 'react-icons/ci'
import { LuSunrise } from 'react-icons/lu'
import { LuSunset } from 'react-icons/lu'

export default function Home() {
    const [location, setLocation] = useState('')
    const apiKey = 'C3GVKTWHX6TM4L8EF72746G55'
    const [result, setResult] = useState<WeatherResponse>({})
    const [loading, setLoading] = useState(false)
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    async function fetchWeather() {
        setLoading(true) // show processing button
        const res = await fetch('/api/weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ location: location, apiKey: apiKey }),
        })

        const data = await res.json()
        setLoading(false)
        setResult(data)
    }

    const getTheme = (condition: string) => {
        if (condition.toLowerCase().includes('rain')) {
            return {
                bg: '/rainy.jpg',
                text: 'text-white',
                icon: <IoRainyOutline />,
            }
        }
        if (condition.toLowerCase().includes('cloud')) {
            return {
                bg: '/cloudy.jpg',
                text: 'text-white',
                icon: <CiCloudSun />,
            }
        }
        return { bg: '/sunny.jpg', text: 'text-black', icon: <CiSun /> } // sunny = dark text
    }

    return (
        <div className="p-6 flex justify-center flex-col items-center min-h-screen bg-gradient-to-b from-blue-200 to-white">
            <h1 className="text-xl font-bold center">Weather App</h1>

            <div className="w-full max-w-md flex flex-col space-y-4">
                <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border p-2 rounded w-full"
                />

                <button
                    onClick={fetchWeather}
                    disabled={loading}
                    className={`w-full px-4 py-2 rounded text-white ${
                        loading
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {loading ? 'Processing...' : 'Get Weather'}
                </button>
            </div>

            {result?.days ? (
                <div className="p-6 rounded-lg bg-cover bg-center flex justify-center">
                    <div className="w-full max-w-4xl gap-4 bg-white/70 p-4 rounded text-center">
                        {result.days?.map((day, index) => {
                            const theme = getTheme(day.conditions)
                            const isOpen = openIndex === index

                            return (
                                <div
                                    key={index}
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    } // toggle
                                    className={`cursor-pointer rounded overflow-hidden shadow-lg mb-4 transition-all duration-300 ${
                                        theme.text
                                    } ${
                                        isOpen
                                            ? 'col-span-2 bg-white/70'
                                            : 'bg-white/50'
                                    }`}
                                    style={{
                                        backgroundImage: `url(${theme.bg})`,
                                    }}
                                >
                                    {isOpen ? (
                                        // Expanded Card (like first one)
                                        <div className="px-6 py-4">
                                            <p className="font-bold text-xl mb-2">
                                                <strong>{day.datetime}</strong>
                                            </p>
                                            <div>
                                                <div className="flex justify-center">
                                                    <p className="text-4xl">
                                                        {theme.icon}
                                                    </p>
                                                </div>
                                                <p className="font-bold text-lg ">
                                                    {day.tempmax}°C max{' '}
                                                    {day.tempmin}°C min
                                                </p>
                                                <p>
                                                    Feels like: {day.feelslike}
                                                    °C
                                                </p>
                                                <p className="flex justify-center items-center gap-12">
                                                    <span className="flex items-center">
                                                        <LuSunrise className="inline mr-2 text-lg" />
                                                        Sunrise: {day.sunrise}
                                                    </span>
                                                    <span className="flex items-center">
                                                        <LuSunset className="inline mr-2 text-lg" />
                                                        Sunset: {day.sunset}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        // Collapsed Card (compact view)
                                        <div className="px-6 py-4 flex justify-between items-center hover:opacity-20">
                                            <p className="font-bold text-lg">
                                                {day.datetime}
                                            </p>
                                            <div className="flex items-center">
                                                <p className="text-2xl mr-2">
                                                    {theme.icon}
                                                </p>
                                                <p>
                                                    {day.tempmax}°C max /{' '}
                                                    {day.tempmin}°C min
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <p className="mt-4 text-gray-500 text-center">
                    No data available
                </p>
            )}
        </div>
    )
}
