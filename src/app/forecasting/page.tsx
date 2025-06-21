import Header from "@/components/layout/header";
import ForecastingForm from "@/components/forecasting/forecasting-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function ForecastingPage() {
  return (
    <div className="flex flex-col gap-8">
      <Header title="Demand Forecasting" />
      <main className="grid flex-1 gap-8 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Blood Demand Predictive Tool</CardTitle>
                <CardDescription>
                  Use historical data to forecast future blood demand and receive
                  suggestions for optimizing inventory levels.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ForecastingForm />
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-1">
             <Card className="bg-primary/10 border-primary/40">
                <CardHeader className="flex flex-row items-center gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                        <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle>How it Works</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                    <p>
                        Our AI-powered forecasting tool analyzes past demand to predict future needs. 
                        This helps in planning blood drives and managing stock efficiently to prevent shortages.
                    </p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>
                            <strong>Provide Data:</strong> Paste historical blood demand data in CSV format. The more data, the better the prediction.
                        </li>
                        <li>
                            <strong>Set Horizon:</strong> Choose how far into the future you want to forecast.
                        </li>
                        <li>
                            <strong>Get Insights:</strong> The AI will provide a forecast summary and actionable suggestions.
                        </li>
                    </ol>
                </CardContent>
             </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
