'use client'

import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

import productImg from '@/assets/logo.png'
import UploadImage from '@/components/shared/upload-image'
import { Ratings } from '@/components/ui/ratings'
import { AppDispatch } from '@/redux/store'
import {
  selectCurrentUser,
  uploadUserAvatarAction
} from '@/redux/user/userSlice'

import UserHeader from '../_components/header'

import ProfileLeftForm from './left-form'
import ProfileRightForm from './right-form'

export default function UserProfile() {
  const dispatch = useDispatch<AppDispatch>()
  const currentUser = useSelector(selectCurrentUser)
  const handleUploadAvatar = async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    try {
      await dispatch(uploadUserAvatarAction(formData)).unwrap()
      toast.success('Cập nhật ảnh đại diện thành công!')
    } catch (error) {
      console.error('Failed to upload avatar:', error)
      toast.error('Cập nhật ảnh đại diện thất bại!')
      throw error
    }
  }
  return (
    <div className='px-4 pr-0'>
      <div className='dark:bg-background custom-scrollbar relative flex h-[100vh] items-center overflow-auto rounded-lg bg-white'>
        <div className='h-full w-full px-6'>
          {/* Header */}
          <UserHeader />

          {/* Content */}
          <div className='mb-4'>
            <div className='text-mainColor1-800 text-3xl font-semibold uppercase'>
              Hồ sơ
            </div>
            <p className='text-sm text-gray-500'>
              Chào mừng bạn trở về nhà! Đây là nơi bạn có thể kiểm tra các hoạt
              động đã làm của mình.
            </p>
          </div>

          <div className='grid grid-cols-4 gap-8'>
            <div className='my-4'>
              <div className='text-mainColor2-800 text-lg font-medium'>
                Ảnh đại diện
              </div>
              <div className='text-muted-foreground mb-2 text-sm'>
                Tải lên ảnh đại diện của bạn để cá nhân hóa tài khoản.
              </div>
              <UploadImage
                onImageUploaded={handleUploadAvatar}
                imageUrl={currentUser?.avatar || ''}
              />
            </div>
            <div className='col-span-3'>
              <div className='grid grid-cols-2 gap-10'>
                <div className='my-4'>
                  <div className='flex items-center justify-between'>
                    <div className='text-mainColor2-800 text-lg font-medium'>
                      Thông tin cá nhân
                    </div>
                  </div>

                  <ProfileLeftForm />
                </div>

                <div className='my-4'>
                  <div className='text-mainColor2-800 text-lg font-medium'>
                    Thông tin tài khoản
                  </div>
                  <ProfileRightForm />
                </div>
              </div>

              <div className='mt-8 grid grid-cols-2 gap-4'>
                <div className=''>
                  <div className='text-mainColor2-800 mb-1/2 text-lg font-medium'>
                    Sản phẩm đã xem gần đây
                  </div>
                  <p className='text-muted-foreground mb-3 text-sm'>
                    Hãy xem tuần vừa rồi bạn đã xem các sản phẩm nào!
                  </p>
                  <ul>
                    <li className='mb-4 flex items-center gap-4'>
                      <div className='flex flex-1 items-center gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='h-10 w-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='line-clamp-1 font-medium'>
                            Tên sản phẩm
                          </span>
                          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                    <li className='mb-4 flex items-center gap-4'>
                      <div className='flex flex-1 items-center gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='h-10 w-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='line-clamp-1 font-medium'>
                            Tên sản phẩm
                          </span>
                          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                    <li className='mb-4 flex items-center gap-4'>
                      <div className='flex flex-1 items-center gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='h-10 w-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='line-clamp-1 font-medium'>
                            Tên sản phẩm
                          </span>
                          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                    <li className='mb-4 flex items-center gap-4'>
                      <div className='flex flex-1 items-center gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='h-10 w-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='line-clamp-1 font-medium'>
                            Tên sản phẩm
                          </span>
                          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='rounded-lg border px-2 py-1.5 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                  </ul>
                </div>
                <div className=''>
                  <div className='text-mainColor2-800 text-right text-lg font-medium'>
                    Đánh giá của bạn
                  </div>
                  <p className='text-muted-foreground mb-3 text-right text-sm'>
                    Hãy xem tuần vừa rồi bạn đã tương tác như thế nào!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
