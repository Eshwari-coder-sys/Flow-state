"use client"

import * as React from "react"
import { RadialBar, RadialBarChart, Legend, Tooltip, ResponsiveContainer } from "recharts"
import type { InventoryItem } from "@/lib/types"

import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface BloodTypeChartProps {
  data: InventoryItem[]
}

export default function BloodTypeChart({ data }: BloodTypeChartProps) {
    const chartData = React.useMemo(() => {
        const bloodTypeCounts = data.reduce((acc, item) => {
            acc[item.bloodType] = (acc[item.bloodType] || 0) + item.quantity;
            return acc;
        }, {} as Record<string, number>);

        const total = Object.values(bloodTypeCounts).reduce((sum, count) => sum + count, 0);

        return Object.entries(bloodTypeCounts).map(([name, value], index) => ({
            name,
            value,
            fill: `hsl(var(--chart-${(index % 5) + 1}))`,
            total,
        })).sort((a,b) => b.value - a.value);

    }, [data]);

  const chartConfig = React.useMemo(() => {
    return chartData.reduce((acc, item) => {
      acc[item.name] = { label: item.name, color: item.fill };
      return acc;
    }, {} as any);
  }, [chartData]);

  if (!chartData || chartData.length === 0) {
    return <div className="flex items-center justify-center h-60 text-muted-foreground">No data to display</div>
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square h-full max-h-[300px]"
    >
      <ResponsiveContainer>
        <RadialBarChart
          data={chartData}
          startAngle={90}
          endAngle={-270}
          innerRadius="50%"
          outerRadius="80%"
        >
          <Tooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel nameKey="name" />}
          />
          <RadialBar dataKey="value" background cornerRadius={10} />
          <Legend
            iconSize={10}
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
