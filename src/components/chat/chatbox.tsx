'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import Image from 'next/image'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'
import {
  Minus,
  SendHorizontal,
  X,
  Image as ImageIcon,
  ThumbsUp,
  Smile
} from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { PopoverArrow } from '@radix-ui/react-popover'

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
        <div className='w-[330px] h-[450px] fixed z-10 right-20 bottom-0 bg-section rounded-tl-xl rounded-tr-xl border border-b-0 border-border overflow-hidden flex flex-col'>
          <div className='bg-mainColor1-400 py-2 px-3 flex items-center justify-between'>
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
                <div className='text-xs text-muted-foreground'>Người bán</div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Minus
                className='cursor-pointer rounded-md hover:bg-muted/40 transition-all duration-300 ease-in-out p-1'
                size={30}
              />
              <X
                className='cursor-pointer rounded-md hover:bg-muted/40 transition-all duration-300 ease-in-out p-1'
                size={30}
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          <div
            className='flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3'
            ref={chatBoxRef}
          >
            <div className='flex items-center justify-end'>
              <div className='bg-mainColor1-600 w-fit py-1.5 px-3 rounded-2xl max-w-4/5'>
                Hello Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Ipsa temporibus eligendi necessitatibus! Veniam reiciendis,
                numquam quod itaque sunt, harum ducimus atque illo similique,
                quis perspiciatis cum et possimus sequi aperiam!
              </div>
            </div>
            <div className='flex items-center'>
              <div className='bg-muted/60 border border-border w-fit py-1.5 px-3 rounded-2xl max-w-4/5'>
                Hello
              </div>
            </div>
            <div className='flex items-center justify-end'>
              <div className='bg-mainColor1-600 w-fit py-1.5 px-3 rounded-2xl max-w-4/5'>
                Hello Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Ipsa temporibus eligendi necessitatibus! Veniam reiciendis,
                numquam quod itaque sunt, harum ducimus atque illo similique,
                quis perspiciatis cum et possimus sequi aperiam!
              </div>
            </div>
          </div>
          <div className='flex items-center gap-3 p-2 border-t border-t-border'>
            <Tooltip>
              <TooltipTrigger>
                <Label className='cursor-pointer'>
                  <ImageIcon
                    className='hover:bg-muted/50 p-1.5 rounded-full'
                    size={35}
                  />
                  <Input type='file' className='sr-only' />
                </Label>
              </TooltipTrigger>
              <TooltipContent>Upload images</TooltipContent>
            </Tooltip>
            <div className='relative w-full'>
              <Input
                className='peer pe-9 rounded-full focus-visible:ring-0 focus-visible:border-border'
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
                      className='cursor-pointer hover:bg-muted/40 rounded-full p-1.5'
                      size={35}
                    />
                  </PopoverTrigger>
                  <PopoverContent
                    side='top'
                    className='relative -translate-x-[36%] w-fit p-0 border-none'
                  >
                    <EmojiPicker
                      theme={Theme.DARK}
                      emojiStyle={EmojiStyle.FACEBOOK}
                      skinTonesDisabled
                      allowExpandReactions={false}
                      lazyLoadEmojis
                      autoFocusSearch={false}
                      style={{ borderBottomRightRadius: '0'}}
                      onEmojiClick={(emoji) => handlePickEmoji(emoji)}
                    />
                    <PopoverArrow className='relative left-[126px] fill-[#363636]' width={20} height={15} />
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
