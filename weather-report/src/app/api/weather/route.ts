import { NextResponse } from "next/server";

export const GET = async () => {
	const apiKey = "C3GVKTWHX6TM4L8EF72746G55";
	const location = "Brisbane city";
	const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(
		location
	)}?unitGroup=uk&contentType=json&key=${apiKey}`;

	try {
		const response = await fetch(apiUrl);
		if (!response.ok) {
			throw new Error(`Error: ${response.statusText}`);
		}
		const data = await response.json();
		return NextResponse.json(data);
	} catch (error) {
		console.error("Fetch Error:", error);
		return NextResponse.json(error);
	}
};
