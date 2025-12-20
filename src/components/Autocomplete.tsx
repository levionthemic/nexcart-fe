'use client'

import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { useId, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DataType {
  id: number | string
  value: number | string
  label: string
}

interface AutocompleteProps {
  data?: DataType[]
  label?: string
  title?: string
  flag: string
  error: boolean
  defaultValue: string | number
  onChange: (value: string | number) => void
  getDetails?: ({ id, type }: { id: string | number; type: string }) => void
}

export default function Autocomplete({
  data,
  label,
  title,
  getDetails,
  flag,
  error,
  defaultValue,
  onChange
}: AutocompleteProps) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<string | number>(defaultValue)

  return (
    <div className='*:not-first:mt-0'>
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className={`placeholder:text-opacity-50 flex w-full justify-between rounded-xl border placeholder:text-sm placeholder:text-green-50 focus:border-[2px] focus:outline-none ${
              error ? 'border-red-400!' : 'border-mainColor1-100/50!'
            }`}
          >
            <span className={cn('truncate', !value && 'text-muted-foreground')}>
              {value
                ? data?.find((i) => String(i.value) === String(value))?.label
                : title}
            </span>
            <ChevronDownIcon
              size={16}
              className='text-muted-foreground/80 shrink-0'
              aria-hidden='true'
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0'
          align='start'
        >
          <Command>
            <CommandInput
              placeholder='Tìm kiếm...'
              className='border-none outline-none focus:border-none'
            />
            <CommandList>
              <CommandEmpty>Không có kết quả.</CommandEmpty>
              <CommandGroup>
                {data?.map((i) => (
                  <CommandItem
                    key={i.id}
                    value={String(i.value)}
                    onSelect={(currentValue) => {
                      getDetails?.({ id: i.id, type: flag })
                      const newValue =
                        currentValue === i.label ||
                        currentValue === String(i.value)
                          ? i.value
                          : ''
                      setValue(String(newValue))
                      setOpen(false)
                      onChange(newValue)
                    }}
                  >
                    {i.label}
                    {String(value) === String(i.value) && (
                      <CheckIcon size={16} className='ml-auto' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
