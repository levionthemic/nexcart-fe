'use client'

import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { useImageUpload } from '@/hooks/use-image-upload'

export default function UploadAvatar({
  fieldName,
  defaultImageUrl,
  onValueChange
}: {
  fieldName: string
  defaultImageUrl: string | undefined
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
        {(defaultImageUrl || previewUrl) && (
          <div
            className='relative flex shrink-0 items-center justify-center overflow-hidden'
            aria-label={
              previewUrl ? 'Preview of uploaded image' : 'Default user avatar'
            }
          >
            <Image
              className='border-input size-32 rounded-full border object-cover'
              src={String(previewUrl || defaultImageUrl)}
              alt='Preview of uploaded image'
              width={128}
              height={128}
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
              {fileName || defaultImageUrl ? 'Thay đổi' : 'Chọn'}
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
