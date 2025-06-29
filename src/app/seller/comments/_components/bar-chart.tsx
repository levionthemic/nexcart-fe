'use client'

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart'

export const description = 'A bar chart'

const chartData = [
  { rate: '5', desktop: 186 },
  { rate: '4', desktop: 305 },
  { rate: '3', desktop: 237 },
  { rate: '2', desktop: 73 },
  { rate: '1', desktop: 209 }
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)'
  }
} satisfies ChartConfig

export function BarChartComponent() {
  return (
    <Card>
      <CardHeader className='py-6'>
        <CardTitle>Số lượng đánh giá theo từng mức sao</CardTitle>
        <CardDescription>Trong tháng này</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='rate'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='desktop' fill='var(--color-desktop)' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
