'use client'

import { PopoverArrow } from '@radix-ui/react-popover'
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme
} from 'emoji-picker-react'
import {
  Image as ImageIcon,
  Minus,
  SendHorizontal,
  Smile,
  ThumbsUp,
  X
} from 'lucide-react'
import Image from 'next/image'
import { ReactNode, useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function ChatBox({
  children,
  className
}: {
  children: ReactNode
  className: string
}) {
  const [isOpen, setOpen] = useState(false)
  const [isTyping, setTyping] = useState(false)
  const [text, setText] = useState('')

  const chatBoxRef = useRef<HTMLDivElement>(null)
  // useEffect(() => {
  //   if (chatBoxRef.current) {
  //     chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
  //   }
  // }, [messages])

  useEffect(() => {
    if (isOpen && chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }
  }, [isOpen])

  const handlePickEmoji = (emoji: EmojiClickData) => {
    console.log(emoji)
    setText((prev) => prev + emoji.emoji)
  }

  return (
    <div>
      <Button
        variant='outline'
        className={className}
        onClick={() => setOpen(true)}
      >
        {children}
      </Button>
      {isOpen && (
        <div className='bg-section border-border fixed right-20 bottom-0 z-10 flex h-[450px] w-[330px] flex-col overflow-hidden rounded-tl-xl rounded-tr-xl border border-b-0'>
          <div className='bg-mainColor1-400 flex items-center justify-between px-3 py-2'>
            <div className='flex items-center gap-2'>
              <Image
                src={DEFAULT_IMAGE_URL}
                alt=''
                width={40}
                height={40}
                className='size-10 rounded-full'
              />
              <div>
                <div className='font-medium'>Tên người bán</div>
                <div className='text-muted-foreground text-xs'>Người bán</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Minus
                className='hover:bg-muted/40 cursor-pointer rounded-md p-1 transition-all duration-300 ease-in-out'
                size={30}
              />
              <X
                className='hover:bg-muted/40 cursor-pointer rounded-md p-1 transition-all duration-300 ease-in-out'
                size={30}
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div
            className='custom-scrollbar flex-1 space-y-3 overflow-y-auto p-2'
            ref={chatBoxRef}
          >
            <div className='flex items-center justify-end'>
              <div className='bg-mainColor1-600 w-fit max-w-4/5 rounded-2xl px-3 py-1.5'>
                Hello Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Ipsa temporibus eligendi necessitatibus! Veniam reiciendis,
                numquam quod itaque sunt, harum ducimus atque illo similique,
                quis perspiciatis cum et possimus sequi aperiam!
              </div>
            </div>
            <div className='flex items-center'>
              <div className='bg-muted/60 border-border w-fit max-w-4/5 rounded-2xl border px-3 py-1.5'>
                Hello
              </div>
            </div>
            <div className='flex items-center justify-end'>
              <div className='bg-mainColor1-600 w-fit max-w-4/5 rounded-2xl px-3 py-1.5'>
                Hello Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Ipsa temporibus eligendi necessitatibus! Veniam reiciendis,
                numquam quod itaque sunt, harum ducimus atque illo similique,
                quis perspiciatis cum et possimus sequi aperiam!
              </div>
            </div>
          </div>
          <div className='border-t-border flex items-center gap-3 border-t p-2'>
            <Tooltip>
              <TooltipTrigger>
                <Label className='cursor-pointer'>
                  <ImageIcon
                    className='hover:bg-muted/50 rounded-full p-1.5'
                    size={35}
                  />
                  <Input type='file' className='sr-only' />
                </Label>
              </TooltipTrigger>
              <TooltipContent>Upload images</TooltipContent>
            </Tooltip>
            <div className='relative w-full'>
              <Input
                className='peer focus-visible:border-border rounded-full pe-9 focus-visible:ring-0'
                type='text'
                placeholder='Nhập tin nhắn...'
                onFocus={() => setTyping(true)}
                onBlur={() => setTyping(false)}
                onChange={(e) => setText(e.target.value)}
                value={text}
              />
              <div className='text-muted-foreground/80 absolute inset-y-0 end-0 flex items-center justify-center pe-0 peer-disabled:opacity-50'>
                <Popover>
                  <PopoverTrigger>
                    <Smile
                      className='hover:bg-muted/40 cursor-pointer rounded-full p-1.5'
                      size={35}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    side='top'
                    className='relative w-fit -translate-x-[36%] border-none p-0'
                  >
                    <EmojiPicker
                      theme={Theme.DARK}
                      emojiStyle={EmojiStyle.FACEBOOK}
                      skinTonesDisabled
                      allowExpandReactions={false}
                      lazyLoadEmojis
                      autoFocusSearch={false}
                      style={{ borderBottomRightRadius: '0' }}
                      onEmojiClick={(emoji) => handlePickEmoji(emoji)}
                    />
                    <PopoverArrow
                      className='relative left-[126px] fill-[#363636]'
                      width={20}
                      height={15}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {isTyping ? <SendHorizontal /> : <ThumbsUp />}
          </div>
        </div>
      )}
    </div>
  )
}
