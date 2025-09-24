// app/api/weather/route.ts
import { NextRequest, NextResponse } from 'next/server'
import redis from '../../../../lib/redis'

async function fetchWithTimeout(url: string, timeout = 8000) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    try {
        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return await res.json()
    } finally {
        clearTimeout(id)
    }
}

// ---- Retry wrapper ----
async function fetchWithRetry(url: string, retries = 5, delay = 3000) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetchWithTimeout(url)
        } catch (err) {
            if (i === retries - 1) throw err
            await new Promise((r) => setTimeout(r, delay * (i + 1))) // backoff
        }
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { location, apiKey } = body

        if (!location || !apiKey) {
            return NextResponse.json(
                { error: 'Missing location or apiKey' },
                { status: 400 }
            )
        }

        const cacheKey = `weather:${location.toLowerCase()}`

        // Try Redis cache
        const cached = await redis.get(cacheKey)
        if (cached) {
            console.log('✅ Cache hit')
            return NextResponse.json(JSON.parse(cached))
        }

        // Build the external weather API URL
        const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
            location
        )}?unitGroup=uk&contentType=json&key=${apiKey}`

        const data = await fetchWithRetry(apiUrl)

        // Store in Redis for 1 hour (3600 seconds)
        await redis.set(cacheKey, JSON.stringify(data), 'EX', 3600)

        return NextResponse.json(data)
    } catch (err: any) {
        console.log(err)
        return NextResponse.json(
            { error: err.message || 'Something went wrong' },
            { status: err.statusCode || 500 }
        )
    }
}
