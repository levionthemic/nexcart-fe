'use client'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { useImageUpload } from '@/hooks/use-image-upload'

export default function UploadImage({
  fieldName,
  onValueChange
}: {
  fieldName: string
  onValueChange: (file: File | null) => void
}) {
  const {
    previewUrl,
    fileInputRef,
    handleThumbnailClick: handleButtonClick,
    handleFileChange,
    handleRemove,
    fileName
  } = useImageUpload()

  return (
    <div>
      <div className='w-full space-y-2'>
        {previewUrl && (
          <div
            className='border-input relative flex aspect-square size-1/2 shrink-0 items-center justify-center overflow-hidden rounded-md border'
            aria-label={
              previewUrl ? 'Preview of uploaded image' : 'Default user avatar'
            }
          >
            <Image
              className='h-full w-full object-cover'
              src={previewUrl}
              alt='Preview of uploaded image'
              width={32}
              height={32}
            />
          </div>
        )}
        <div className='relative inline-block flex-1'>
          <div className='flex items-center gap-2'>
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
          </div>
          <input
            type='file'
            ref={fileInputRef}
            onChange={(e) => handleFileChange(e, onValueChange)}
            className='hidden'
            accept='image/*'
            aria-label='Upload image file'
            name={fieldName}
          />
        </div>
      </div>
      {fileName && (
        <div className='mt-2'>
          <div className='inline-flex gap-2 text-xs'>
            <p
              className='text-muted-foreground max-w-32 truncate'
              aria-live='polite'
            >
              {fileName}
            </p>{' '}
            <button
              onClick={() => handleRemove(onValueChange)}
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
