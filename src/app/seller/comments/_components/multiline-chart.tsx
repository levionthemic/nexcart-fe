'use client'

import { CartesianGrid, Legend, Line, LineChart, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'
const chartData = [
  { month: 'T10', rate5: 186, rate4: 80 },
  { month: 'T11', rate5: 305, rate4: 200 },
  { month: 'T12', rate5: 237, rate4: 120 },
  { month: 'T1', rate5: 73, rate4: 190 },
  { month: 'T2', rate5: 209, rate4: 130 },
  { month: 'T3', rate5: 214, rate4: 140 }
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)'
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--chart-2)'
  }
}

export function MultiLineChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Xu hướng thay đổi số đánh giá 5 và 4 sao</CardTitle>
        <CardDescription>Trong 12 tháng vừa qua</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Legend verticalAlign="top" height={36} align='right' fontWeight='bold' fontSize={'0.875rem'}/>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="rate5"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="rate4"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
