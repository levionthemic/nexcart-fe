'use client'

import clsx from 'clsx'

import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
} from '@/components/ui/timeline'
import { useParams } from 'next/navigation'

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
                'bg-mainColor1-400 left-5 top-5': true,
                invisible: step < item.id + 1
              })}
            />
            <TimelineTitle
              className={clsx({
                'text-mainColor1-800 font-bold text-md': true,
                invisible: step < item.id
              })}
            >
              {item.title}
            </TimelineTitle>
            <TimelineIndicator
              className={clsx({
                'border-none flex items-center justify-center w-fit h-fit':
                  true,
                invisible: step < item.id
              })}
            >
              <div className='rounded-full w-7 h-7 flex items-center justify-center text-white bg-mainColor1-600 text-sm'>
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
