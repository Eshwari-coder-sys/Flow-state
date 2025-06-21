"use server";

import { forecastBloodDemand, type ForecastBloodDemandInput } from "@/ai/flows/forecast-blood-demand";

export async function getBloodDemandForecast(input: ForecastBloodDemandInput) {
    try {
        const result = await forecastBloodDemand(input);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in forecast:", error);
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
        return { success: false, error: errorMessage };
    }
}
