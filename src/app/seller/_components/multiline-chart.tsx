'use client'

import { useState } from 'react'
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
  { month: 'T10', revenue: 186, orders: 80 },
  { month: 'T11', revenue: 305, orders: 200 },
  { month: 'T12', revenue: 237, orders: 120 },
  { month: 'T1', revenue: 73, orders: 190 },
  { month: 'T2', revenue: 209, orders: 130 },
  { month: 'T3', revenue: 214, orders: 140 }
]

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: 'var(--chart-1)'
  },
  orders: {
    label: 'Tổng đơn hàng',
    color: 'var(--chart-2)'
  }
}

const CustomLegend = ({ payload, hoverKey, setHoverKey }) => {
  return (
    <ul className="flex flex-wrap justify-end gap-6">
      {payload.map((entry) => {
        const isHovered = hoverKey === entry.dataKey

        return (
          <li
            key={entry.dataKey}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${isHovered ? 'font-bold' : ''}`}
            onMouseEnter={() => setHoverKey(entry.dataKey)}
            onMouseLeave={() => setHoverKey(null)}
          >
            <span
              className="inline-block h-1 w-6 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.value === 'revenue' ? 'Doanh thu' : 'Tổng đơn hàng'}</span>
          </li>
        )
      })}
    </ul>
  )
}


export default function MultiLineChartComponent() {
  const [hoverKey, setHoverKey] = useState(null)

  return (
    <Card>
      <CardHeader className='py-6'>
        <CardTitle>Doanh thu và tổng số đơn hàng</CardTitle>
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
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Legend verticalAlign="top" height={36} fontSize={'0.875rem'}
              content={
                <CustomLegend
                  hoverKey={hoverKey}
                  setHoverKey={setHoverKey}
                />
              }
            />

            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />

            <Line
              dataKey="revenue"
              type="monotone"
              stroke="var(--color-revenue)"
              strokeWidth={hoverKey === 'revenue' ? 3 : 2}
              dot={false}
            />
            <Line
              dataKey="orders"
              type="monotone"
              stroke="var(--color-orders)"
              strokeWidth={hoverKey === 'orders' ? 3 : 2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
  