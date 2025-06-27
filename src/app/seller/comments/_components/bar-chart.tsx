import { Bar, BarChart, XAxis, YAxis } from 'recharts'

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
  { rate: '5', quantity: 305 },
  { rate: '4', quantity: 184 },
  { rate: '3', quantity: 25 },
  { rate: '2', quantity: 12 },
  { rate: '1', quantity: 12 }
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))'
  }
}

export function BarChartComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Số lượng đánh giá theo từng mức sao</CardTitle>
        <CardDescription>Trong tháng này</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20
            }}
          >
            <XAxis type="number" dataKey="quantity" hide />
            <YAxis
              dataKey="rate"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="quantity" fill="var(--color-desktop)" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
