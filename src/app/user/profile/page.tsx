'use client'

import productImg from '@/assets/logo.png'
import Image from 'next/image'
import UserHeader from '../_components/header'
import ProfileLeftForm from './left-form'
import ProfileRightForm from './right-form'
import { Ratings } from '@/components/ui/ratings'
import UploadImage from '@/components/upload/upload-image'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { selectCurrentUser, uploadUserAvatarAction } from '@/redux/user/userSlice'
import { toast } from 'sonner'

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
      <div className='flex items-center bg-white dark:bg-background rounded-lg h-[100vh] overflow-auto relative custom-scrollbar'>
        <div className='px-6 h-full w-full'>
          {/* Header */}
          <UserHeader />

          {/* Content */}
          <div className='mb-4'>
            <div className='text-3xl font-semibold uppercase text-mainColor1-800'>
              Hồ sơ
            </div>
            <p className='text-sm text-gray-500'>
              Chào mừng bạn trở về nhà! Đây là nơi bạn có thể kiểm tra các hoạt
              động đã làm của mình.
            </p>
          </div>

          <div className='grid grid-cols-4 gap-8'>
            <div className='my-4'>
              <div className='text-lg font-medium text-mainColor2-800'>
                Ảnh đại diện
              </div>
              <div className='mb-2 text-sm text-muted-foreground'>
                Tải lên ảnh đại diện của bạn để cá nhân hóa tài khoản.
              </div>
              <UploadImage onImageUploaded={handleUploadAvatar} imageUrl={currentUser?.avatar || ''} />
            </div>
            <div className='col-span-3'>
              <div className='grid grid-cols-2 gap-10'>
                <div className='my-4'>
                  <div className='flex items-center justify-between'>
                    <div className='text-lg font-medium text-mainColor2-800'>
                      Thông tin cá nhân
                    </div>
                  </div>

                  <ProfileLeftForm />
                </div>

                <div className='my-4'>
                  <div className='text-lg font-medium text-mainColor2-800'>
                    Thông tin tài khoản
                  </div>
                  <ProfileRightForm />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-4 mt-8'>
                <div className=''>
                  <div className='text-lg font-medium text-mainColor2-800 mb-1/2'>
                    Sản phẩm đã xem gần đây
                  </div>
                  <p className='mb-3 text-sm text-muted-foreground'>
                    Hãy xem tuần vừa rồi bạn đã xem các sản phẩm nào!
                  </p>
                  <ul>
                    <li className='flex items-center gap-4 mb-4'>
                      <div className='flex items-center flex-1 gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='w-10 h-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='font-medium line-clamp-1'>
                            Tên sản phẩm
                          </span>
                          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='border rounded-lg py-1.5 px-2 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                    <li className='flex items-center gap-4 mb-4'>
                      <div className='flex items-center flex-1 gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='w-10 h-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='font-medium line-clamp-1'>
                            Tên sản phẩm
                          </span>
                          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='border rounded-lg py-1.5 px-2 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                    <li className='flex items-center gap-4 mb-4'>
                      <div className='flex items-center flex-1 gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='w-10 h-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='font-medium line-clamp-1'>
                            Tên sản phẩm
                          </span>
                          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='border rounded-lg py-1.5 px-2 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                    <li className='flex items-center gap-4 mb-4'>
                      <div className='flex items-center flex-1 gap-3'>
                        <Image
                          src={productImg}
                          alt=''
                          className='w-10 h-10 rounded-lg'
                        />
                        <div className='flex flex-col'>
                          <span className='font-medium line-clamp-1'>
                            Tên sản phẩm
                          </span>
                          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                            <span>{4.5}</span>
                            <Ratings rating={4.5} variant='yellow' />
                          </div>
                        </div>
                      </div>
                      <div className='border rounded-lg py-1.5 px-2 text-sm font-semibold'>
                        Xem chi tiết
                      </div>
                    </li>
                  </ul>
                </div>
                <div className=''>
                  <div className='text-lg font-medium text-right text-mainColor2-800'>
                    Đánh giá của bạn
                  </div>
                  <p className='mb-3 text-sm text-right text-muted-foreground'>
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
