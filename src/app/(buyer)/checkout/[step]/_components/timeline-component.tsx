'use client'

import clsx from 'clsx'
import { useParams } from 'next/navigation'

import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '@/components/ui/timeline'

interface TimelineComponentProps {
  items: {
    id: number
    title: string
    description: string
  }[]
}
export default function TimelineComponent({ items }: TimelineComponentProps) {
  const params = useParams()
  const step = Number(params.step) || 1

  return (
    <Timeline defaultValue={3} orientation='horizontal'>
      {items.map((item) => (
        <TimelineItem key={item.id} step={step}>
          <TimelineHeader>
            <TimelineSeparator
              className={clsx({
                'bg-mainColor1-400 top-5 left-5': true,
                invisible: step < item.id + 1
              })}
            />
            <TimelineTitle
              className={clsx({
                'text-mainColor1-800 text-md font-bold': true,
                invisible: step < item.id
              })}
            >
              {item.title}
            </TimelineTitle>
            <TimelineIndicator
              className={clsx({
                'flex h-fit w-fit items-center justify-center border-none': true,
                invisible: step < item.id
              })}
            >
              <div className='bg-mainColor1-600 flex h-7 w-7 items-center justify-center rounded-full text-sm text-white'>
                {item.id}
              </div>
            </TimelineIndicator>
          </TimelineHeader>
          <TimelineContent className={clsx({ invisible: step < item.id })}>
            {item.description}
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  )
}
