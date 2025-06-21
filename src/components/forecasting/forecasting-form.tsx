"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Wand2, Loader2, BarChart, FileText } from "lucide-react";

import { getBloodDemandForecast } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { ForecastBloodDemandOutput } from "@/ai/flows/forecast-blood-demand";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const forecastingFormSchema = z.object({
  historicalData: z.string().min(20, {
    message: "Please provide sufficient historical data (at least 20 characters).",
  }),
  forecastHorizon: z.string(),
});

const sampleData = `date,demand
2023-01-01,15
2023-01-02,12
2023-01-03,18
2023-01-04,20
2023-01-05,17
2023-01-06,22
2023-01-07,25
2023-01-08,23
2023-01-09,19
2023-01-10,16`;

export default function ForecastingForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ForecastBloodDemandOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof forecastingFormSchema>>({
    resolver: zodResolver(forecastingFormSchema),
    defaultValues: {
      historicalData: sampleData,
      forecastHorizon: "7 days",
    },
  });

  async function onSubmit(values: z.infer<typeof forecastingFormSchema>) {
    setLoading(true);
    setResult(null);

    const response = await getBloodDemandForecast(values);
    setLoading(false);

    if (response.success && response.data) {
      setResult(response.data);
    } else {
      toast({
        variant: "destructive",
        title: "Forecasting Error",
        description: response.error || "An unexpected error occurred.",
      });
    }
  }

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="historicalData"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Historical Data (CSV format)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="date,demand&#10;2023-01-01,15&#10;..."
                    className="min-h-[150px] font-mono text-xs"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="forecastHorizon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Forecast Horizon</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select horizon" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {["7 days", "30 days", "90 days"].map((horizon) => (
                      <SelectItem key={horizon} value={horizon}>
                        {horizon}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={loading} size="lg">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2" />
            )}
            Generate Forecast
          </Button>
        </form>
      </Form>
      
      {(loading || result) && (
        <div className="space-y-6 pt-6">
            <h3 className="text-xl font-semibold">Forecast Results</h3>
            {loading && <ForecastingSkeleton />}
            {result && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-primary/20 p-3 rounded-full">
                                <BarChart className="w-5 h-5 text-primary" />
                            </div>
                           <CardTitle>Forecast Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.forecastSummary}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="bg-accent/20 p-3 rounded-full">
                                <FileText className="w-5 h-5 text-accent" />
                            </div>
                           <CardTitle>Suggested Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{result.suggestedActions}</p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
      )}
    </div>
  );
}

const ForecastingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardContent>
        </Card>
    </div>
)
