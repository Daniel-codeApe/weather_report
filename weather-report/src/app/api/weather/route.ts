// app/api/weather/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { location, apiKey } = body;

		if (!location || !apiKey) {
			return NextResponse.json(
				{ error: "Missing location or apiKey" },
				{ status: 400 }
			);
		}

		// Build the external weather API URL
		const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
			location
		)}?unitGroup=uk&contentType=json&key=${apiKey}`;

		const res = await fetch(apiUrl, { method: "GET", headers: {} });
		const data = await res.json();

		return NextResponse.json(data);
	} catch (err: any) {
		console.log(err);
		return NextResponse.json(
			{ error: err.message || "Something went wrong" },
			{ status: err.statusCode || 500 }
		);
	}
}
