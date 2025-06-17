import { useForm } from 'react-hook-form'
import Rating from '@/components/ui/rating'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { FIELD_REQUIRED_MESSAGE } from '@/utils/validators'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

interface ReviewSubmitData {
  rating: number,
  content: string
}

export default function ReviewModal({
  onSubmitReview,
  updateStartTyping,
  updateStopTyping
}: {
  onSubmitReview: (data: ReviewSubmitData) => void
  updateStartTyping: () => void
  updateStopTyping: () => void
}) {
  const formSchema = z.object({
    rating: z.number().min(1, { message: FIELD_REQUIRED_MESSAGE }),
    content: z.string().default('')
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      content: ''
    }
  })

  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (open) updateStartTyping()
    else updateStopTyping()
  }, [open])

  const handleSubmit = (data: ReviewSubmitData) => {
    setOpen(false)
    onSubmitReview(data)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-mainColor2-800 hover:bg-mainColor2-800/80'>
          Đánh giá
        </Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-8'
          >
            <DialogHeader>
              <DialogTitle>Đánh giá sản phẩm</DialogTitle>
              <DialogDescription>
                Gửi đánh giá sản phẩm kèm bình luận cho sản phẩm.
              </DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem className='flex flex-col items-start'>
                  <FormLabel className='text-base'>Đánh giá</FormLabel>
                  <FormControl className='w-full'>
                    <Rating
                      onChange={field.onChange}
                      defaultSelected={field.value}
                    />
                  </FormControl>
                  <FormDescription>
                    Hãy chọn số sao đánh giá cho sản phẩm vừa mua của bạn.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-base'>Bình luận</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Bình luận...'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Bạn có thể viết bình luận kèm theo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Hủy
                </Button>
              </DialogClose>
              <Button type='submit'>Hoàn tất</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
