'use client'

import { useImageUpload } from '@/hooks/use-image-upload'
import { Button } from '@/components/ui/button'
import { CircleUserRoundIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, updateUserAPI } from '@/redux/user/userSlice'
import Image from 'next/image'
import { AccountStatus } from '@/types/enums/account'
import { AppDispatch } from '@/redux/store'

export default function UploadImage({ fieldName }: { fieldName: string }) {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)
  const {
    previewUrl,
    fileInputRef,
    handleThumbnailClick: handleButtonClick,
    handleFileChange,
    handleRemove,
    fileName,
    file
  } = useImageUpload()

  const handleUploadImage = () => {
    const reqData = new FormData()
    reqData.append(fieldName, file as File)
    reqData.append('status', AccountStatus.ACTIVE)
    reqData.append('role', currentUser?.role as string)

    toast.promise(dispatch(updateUserAPI(reqData)), {
      loading: 'Đang tải hình ảnh lên...',
      success: (res) => {
        if (!res.error) {
          handleRemove()
          return 'Tải hình ảnh lên thành công!'
        }
        throw res
      }
    })
  }

  return (
    <div>
      <div className='inline-flex items-center gap-2 align-top w-full'>
        <div
          className='border-input relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border'
          aria-label={
            previewUrl ? 'Preview of uploaded image' : 'Default user avatar'
          }
        >
          {previewUrl ? (
            <Image
              className='h-full w-full object-cover'
              src={previewUrl}
              alt='Preview of uploaded image'
              width={32}
              height={32}
            />
          ) : (
            <div aria-hidden='true'>
              <CircleUserRoundIcon className='opacity-60' size={16} />
            </div>
          )}
        </div>
        <div className='relative inline-block flex-1'>
          <div className=' flex items-center gap-2'>
            <Button
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault()
                handleButtonClick()
              }}
              aria-haspopup='dialog'
              className='w-full'
              variant={fileName ? 'outline' : undefined}
            >
              {fileName ? 'Thay đổi' : 'Chọn'}
            </Button>
            {fileName && <Button onClick={handleUploadImage}>Tải lên</Button>}
          </div>
          <input
            type='file'
            ref={fileInputRef}
            onChange={handleFileChange}
            className='hidden'
            accept='image/*'
            aria-label='Upload image file'
          />
        </div>
      </div>
      {fileName && (
        <div className='mt-2'>
          <div className='inline-flex gap-2 text-xs'>
            <p
              className='text-muted-foreground truncate max-w-32'
              aria-live='polite'
            >
              {fileName}
            </p>{' '}
            <button
              onClick={handleRemove}
              className='font-medium text-red-500 hover:underline'
              aria-label={`Remove ${fileName}`}
            >
              Xóa
            </button>
          </div>
        </div>
      )}
      <div className='sr-only' aria-live='polite' role='status'>
        {previewUrl
          ? 'Image uploaded and preview available'
          : 'No image uploaded'}
      </div>
    </div>
  )
}
