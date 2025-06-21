'use server';

/**
 * @fileOverview A blood demand forecasting AI agent.
 *
 * - forecastBloodDemand - A function that handles the blood demand forecasting process.
 * - ForecastBloodDemandInput - The input type for the forecastBloodDemand function.
 * - ForecastBloodDemandOutput - The return type for the forecastBloodDemand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ForecastBloodDemandInputSchema = z.object({
  historicalData: z
    .string()
    .describe('Historical data of blood demand, as a CSV string.'),
  forecastHorizon: z
    .string()
    .describe('The forecast horizon in days. e.g., 7 days, 30 days, 90 days'),
});
export type ForecastBloodDemandInput = z.infer<typeof ForecastBloodDemandInputSchema>;

const ForecastBloodDemandOutputSchema = z.object({
  forecastSummary: z.string().describe('A summary of the forecasted blood demand.'),
  suggestedActions: z
    .string()
    .describe('Suggested actions for the admin based on the forecast.'),
});
export type ForecastBloodDemandOutput = z.infer<typeof ForecastBloodDemandOutputSchema>;

export async function forecastBloodDemand(input: ForecastBloodDemandInput): Promise<ForecastBloodDemandOutput> {
  return forecastBloodDemandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'forecastBloodDemandPrompt',
  input: {schema: ForecastBloodDemandInputSchema},
  output: {schema: ForecastBloodDemandOutputSchema},
  prompt: `You are an expert in blood inventory management and demand forecasting.

You will analyze the historical blood demand data and forecast future demand, then provide actionable suggestions for the admin to optimize inventory levels.

Analyze the following historical data:

Historical Data: {{{historicalData}}}

Forecast Horizon: {{{forecastHorizon}}}

Based on the analysis, provide a forecast summary and suggest actions for the admin.
`,
});

const forecastBloodDemandFlow = ai.defineFlow(
  {
    name: 'forecastBloodDemandFlow',
    inputSchema: ForecastBloodDemandInputSchema,
    outputSchema: ForecastBloodDemandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
