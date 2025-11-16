/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  AlertCircleIcon,
  CheckCircleIcon,
  ImageIcon,
  LoaderIcon,
  UploadIcon,
  XIcon
} from 'lucide-react'
import {  useState } from 'react'

import { useFileUpload } from '@/hooks/use-file-upload'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface UploadImageProps {
  onImageUploaded?: (file: File) => Promise<void>
  maxSizeMB?: number
  className?: string
  imageUrl?: string
}

export default function UploadImage({
  onImageUploaded,
  maxSizeMB = 2,
  className,
  imageUrl
}: UploadImageProps) {
  const maxSize = maxSizeMB * 1024 * 1024

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps
    }
  ] = useFileUpload({
    accept: 'image/svg+xml,image/png,image/jpeg,image/jpg,image/gif',
    maxSize
  })

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false)

  const previewUrl = files[0]?.preview || imageUrl || null
  const hasNewFile = files[0]?.file instanceof File
  const hasUploadedImage = uploadSuccess && !error
  const hasExistingImage = imageUrl && !files[0]?.file

  // Handle save button click
  const handleSave = () => {
    setError(null)
    setLoading(true)
    setUploadSuccess(false)
    if (files[0]?.file instanceof File && onImageUploaded) {
      onImageUploaded(files[0].file)
        .then(() => {
          setUploadSuccess(true)
        })
        .catch((err) => {
          setError(err.message || 'Upload failed')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  // Handle removing uploaded image
  const handleRemoveImage = () => {
    if (files[0]?.id) {
      removeFile(files[0].id)
    }
    setError(null)
    setUploadSuccess(false)
  }

  return (
    <div className={`flex flex-col gap-2 ${className || ''}`}>
      <div className='relative'>
        {/* Drop area */}
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          data-dragging={isDragging || undefined}
          className='relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-input p-4 transition-colors has-[input:focus]:border-ring has-[input:focus]:ring-[3px] has-[input:focus]:ring-ring/50 data-[dragging=true]:bg-accent/50'
        >
          <input
            {...(getInputProps() as any)}
            className='sr-only'
            aria-label='Upload image file'
            disabled={loading}
          />

          {/* Loading overlay */}
          {loading && (
            <div className='absolute inset-0 z-10 flex items-center justify-center bg-background/80'>
              <div className='flex flex-col items-center gap-2'>
                <LoaderIcon className='size-6 animate-spin text-primary' />
                <p className='text-sm text-muted-foreground'>Đang tải lên...</p>
              </div>
            </div>
          )}

          {previewUrl ? (
            <div className='absolute inset-0 flex items-center justify-center p-4'>
              <Image
                src={previewUrl}
                alt={files[0]?.file?.name || imageUrl || 'Uploaded image'}
                className='mx-auto max-h-full rounded object-contain'
                width={208}
                height={208}
              />
              {/* Success indicator */}
              {hasUploadedImage && !loading && (
                <div className='absolute top-2 left-2'>
                  <div className='flex size-6 items-center justify-center rounded-full bg-green-500 text-white'>
                    <CheckCircleIcon className='size-4' />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center px-4 py-3 text-center'>
              <div
                className='mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border bg-background'
                aria-hidden='true'
              >
                <ImageIcon className='size-4 opacity-60' />
              </div>
              <p className='mb-1.5 text-sm font-medium'>Kéo thả hình ảnh</p>
              <p className='text-xs text-muted-foreground'>
                SVG, PNG, JPG hoặc GIF (max. {maxSizeMB}MB)
              </p>
              <Button
                variant='outline'
                className='mt-4'
                onClick={openFileDialog}
                disabled={loading}
              >
                <UploadIcon
                  className='-ms-1 size-4 opacity-60'
                  aria-hidden='true'
                />
                Chọn hình ảnh
              </Button>
            </div>
          )}
        </div>

        {previewUrl && !loading && hasNewFile && (
          <div className='absolute top-4 right-4'>
            <button
              type='button'
              className='z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white transition-[color,box-shadow] outline-none hover:bg-black/80 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50'
              onClick={handleRemoveImage}
              aria-label='Remove image'
            >
              <XIcon className='size-4' aria-hidden='true' />
            </button>
          </div>
        )}
      </div>

      {/* Error messages */}
      {(errors.length > 0 || error) && (
        <div
          className='flex items-center gap-1 text-xs text-destructive'
          role='alert'
        >
          <AlertCircleIcon className='size-3 shrink-0' />
          <span>{error || errors[0]}</span>
        </div>
      )}

      {/* Success message */}
      {hasUploadedImage && (
        <div className='flex items-center gap-1 text-xs text-green-600'>
          <CheckCircleIcon className='size-3 shrink-0' />
          <span>Tải lên thành công!</span>
        </div>
      )}

      {/* Save button - shows when user has selected a new file */}
      {hasNewFile && !loading && (
        <Button
          onClick={handleSave}
          className='w-full'
          disabled={loading || errors.length > 0}
        >
          {loading ? (
            <>
              <LoaderIcon className='mr-2 size-4 animate-spin' />
              Đang tải lên...
            </>
          ) : (
            <>
              <UploadIcon className='mr-2 size-4' />
              {hasExistingImage ? 'Cập nhật hình ảnh' : 'Lưu hình ảnh'}
            </>
          )}
        </Button>
      )}

      {/* Change Image button - shows when user has existing image but no new file selected */}
      {hasExistingImage && !loading && (
        <Button
          onClick={openFileDialog}
          variant='outline'
          className='w-full'
          disabled={loading}
        >
          <ImageIcon className='mr-2 size-4' />
          Thay đổi hình ảnh
        </Button>
      )}
    </div>
  )
}
