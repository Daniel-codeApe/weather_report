'use client'
import { useEffect, useState } from 'react'
import { WeatherResponse } from './types'
import { IoRainyOutline } from 'react-icons/io5'
import { CiCloudSun } from 'react-icons/ci'
import { CiSun } from 'react-icons/ci'
import { LuSunrise } from 'react-icons/lu'
import { LuSunset } from 'react-icons/lu'
import { FaRegSnowflake } from 'react-icons/fa'
import { sentencePools } from './sentencePools'

export default function Home() {
    const [location, setLocation] = useState('')
    const apiKey = 'C3GVKTWHX6TM4L8EF72746G55'
    const [result, setResult] = useState<WeatherResponse>({})
    const [status, setStatus] = useState<
        'idle' | 'loading' | 'error' | 'success'
    >('idle')
    const [condition, setCondition] = useState<string>('') // sunny, cloudy, rainy, snowy
    const [sentence, setSentence] = useState('')

    function getRandomSentence(key: keyof typeof sentencePools): string {
        const pool = sentencePools[key]
        return pool[Math.floor(Math.random() * pool.length)]
    }

    async function fetchWeather() {
        setStatus('loading')

        try {
            const res = await fetch('/api/weather', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ location, apiKey }),
            })

            const data = await res.json()
            setStatus(res.ok ? 'success' : 'error')
            setResult(data)

            // Inline condition mapper
            if (res.ok && data?.days?.[0]?.conditions) {
                const cond = data.days[0].conditions.toLowerCase()

                if (cond.includes('rain')) {
                    setCondition('rainy')
                } else if (cond.includes('cloud')) {
                    setCondition('cloudy')
                } else if (cond.includes('snow')) {
                    setCondition('snowy')
                } else if (cond.includes('wind')) {
                    setCondition('windy')
                } else {
                    setCondition('sunny') // fallback
                }
            }
        } catch (err) {
            console.error('Weather fetch failed', err)
            setStatus('error')
        }
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
        if (condition.toLowerCase().includes('snow')) {
            return {
                weather: 'snowy',
                bg: '/snowy.jpg',
                text: 'text-black',
                icon: <FaRegSnowflake />,
            }
        }
        return { bg: '/sunny.jpg', text: 'text-black', icon: <CiSun /> }
    }

    useEffect(() => {
        if (status === 'idle') {
            setSentence(getRandomSentence('idle'))
        } else if (status === 'loading') {
            setSentence(getRandomSentence('loading'))
        } else if (status === 'success') {
            setSentence(
                getRandomSentence(condition as keyof typeof sentencePools)
            )
        }
    }, [status, condition])

    return (
        <div
            className={`min-h-screen p-6 transition-colors duration-700 bg-[url(/hut.jpg)] bg-cover bg-center flex flex-col`}
        >
            {/* Input and Button */}
            <div className="w-full max-w-md flex flex-col space-y-4 mb-6 justify-center mx-auto">
                <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="border p-2 rounded w-full bg-white text-black"
                />

                <button
                    onClick={fetchWeather}
                    disabled={status === 'loading'}
                    className={`w-full px-4 py-2 rounded text-white ${
                        status === 'loading'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                >
                    {status === 'loading' ? 'Processing...' : 'Get Weather'}
                </button>

                {/* Dynamic Sentence */}
                <p className="mt-4 text-black font-bold italic text-center bg-white/70 bg-opacity-50 p-4 rounded">
                    {sentence}
                </p>
            </div>

            {result?.days ? (
                <div className="bg-white bg-opacity-50 p-4 rounded-lg shadow-md mx-auto w-full max-w-8xl flex-grow overflow-y-auto max-h-[60vh]">
                    {/* Top row */}
                    <div className="grid grid-cols-3 gap-4">
                        {/* Today’s Weather */}
                        <div className="col-span-2 rounded-2xl shadow-lg p-6 text-center">
                            {(() => {
                                const today = result.days[0]
                                const theme = getTheme(today.conditions)
                                return (
                                    <div
                                        className="text-center min-h-[250px] rounded-xl p-6 flex flex-col justify-center"
                                        style={{
                                            backgroundImage: `url(${theme.bg})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            color: theme.text.includes('white')
                                                ? 'white'
                                                : 'black',
                                        }}
                                    >
                                        <h2 className="text-xl font-bold mb-2">
                                            {today.datetime}
                                        </h2>
                                        <div className="flex justify-center text-5xl mb-2">
                                            {theme.icon}
                                        </div>
                                        <p className="font-semibold text-lg">
                                            {today.tempmax}°C max /{' '}
                                            {today.tempmin}°C min
                                        </p>
                                        <p>Feels like: {today.feelslike}°C</p>
                                    </div>
                                )
                            })()}
                        </div>

                        {/* Extra Info */}
                        <div className="rounded-2xl shadow-lg p-6 text-center">
                            {(() => {
                                const today = result.days[0]
                                return (
                                    <div
                                        className="min-h-[250px] rounded-xl p-6 flex flex-col justify-center"
                                        style={{
                                            backgroundImage: `url(${
                                                getTheme(today.conditions).bg
                                            })`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            color: getTheme(
                                                today.conditions
                                            ).text.includes('white')
                                                ? 'white'
                                                : 'black',
                                        }}
                                    >
                                        <h2 className="text-lg font-semibold mb-4">
                                            Details
                                        </h2>
                                        <ul className="space-y-2">
                                            <li className="flex items-center justify-center">
                                                <LuSunrise className="mr-2" />{' '}
                                                Sunrise: {today.sunrise}
                                            </li>
                                            <li className="flex items-center justify-center">
                                                <LuSunset className="mr-2" />{' '}
                                                Sunset: {today.sunset}
                                            </li>
                                            <li>
                                                💧 Humidity: {today.humidity}%
                                            </li>
                                            <li>
                                                🌬️ Wind: {today.windspeed} km/h
                                            </li>
                                        </ul>
                                    </div>
                                )
                            })()}
                        </div>
                    </div>

                    {/* Roller for next days */}
                    <div className="mt-6 overflow-x-auto">
                        <div className="flex space-x-4">
                            {result.days
                                .slice(1)
                                .map((day: any, index: number) => {
                                    const theme = getTheme(day.conditions)
                                    return (
                                        <div
                                            key={index}
                                            className={`flex-none w-32 rounded-xl shadow-md p-4 text-center`}
                                            style={{
                                                backgroundImage: `url(${theme.bg})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                color: theme.text.includes(
                                                    'white'
                                                )
                                                    ? 'white'
                                                    : 'black',
                                            }}
                                        >
                                            <p className="font-medium">
                                                {day.datetime}
                                            </p>
                                            <p className="text-2xl flex justify-center my-2">
                                                {theme.icon}
                                            </p>
                                            <p className="text-sm">
                                                {day.tempmax}°C / {day.tempmin}
                                                °C
                                            </p>
                                        </div>
                                    )
                                })}
                        </div>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}
