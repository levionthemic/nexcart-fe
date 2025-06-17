import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/redux/user/userSlice'
import productImg from '@/assets/logo.png'
import UploadAvatar from '@/components/UploadAvatar'
import { IoIosLogOut, IoMdStar, IoMdStarOutline } from 'react-icons/io'
import Rating from 'react-rating'
import { TrendingUp } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import UserHeader from '../_components/header'
import ProfileLeftForm from './left-form'
import ProfileRightForm from './right-form'
import LogoutComponent from '@/components/logout/logout'

export default function UserProfile() {
  const currentUser = useSelector(selectCurrentUser)

  return (
    <div className='px-4'>
      <div className='flex items-center bg-white rounded-lg h-[100vh] overflow-auto relative'>
        <div className='px-2 h-full w-[75%]'>
          {/* Header */}
          <UserHeader />

          {/* Content */}
          <div>
            <div className='text-3xl font-semibold uppercase text-mainColor1-800'>
              Hồ sơ
            </div>
            <p className='text-sm text-gray-500'>
              Chào mừng bạn trở về nhà! Đây là nơi bạn có thể kiểm tra các hoạt
              động đã làm của mình.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-8'>
            <div className='my-4'>
              <div className='text-lg font-medium text-mainColor2-800'>
                Thông tin cá nhân
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
                        <Rating
                          emptySymbol={<IoMdStarOutline />}
                          fullSymbol={<IoMdStar />}
                          initialRating={4.5}
                          readonly
                          className='text-[#FBCA04] text-lg leading-none'
                        />
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
                        <Rating
                          emptySymbol={<IoMdStarOutline />}
                          fullSymbol={<IoMdStar />}
                          initialRating={4.5}
                          readonly
                          className='text-[#FBCA04] text-lg leading-none'
                        />
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
                        <Rating
                          emptySymbol={<IoMdStarOutline />}
                          fullSymbol={<IoMdStar />}
                          initialRating={4.5}
                          readonly
                          className='text-[#FBCA04] text-lg leading-none'
                        />
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
                        <Rating
                          emptySymbol={<IoMdStarOutline />}
                          fullSymbol={<IoMdStar />}
                          initialRating={4.5}
                          readonly
                          className='text-[#FBCA04] text-lg leading-none'
                        />
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

        <div className='flex-1 px-4 flex items-center sticky top-0 right-0 min-h-[100vh]'>
          <div className='bg-gray-100/80 h-[95vh] rounded-xl flex-1 grid grid-rows-2 py-4'>
            <div className='relative flex flex-col items-center justify-center text-center'>
              <LogoutComponent
                icon={
                  <IoIosLogOut className='absolute top-0 text-xl cursor-pointer right-3 text-mainColor1-800' />
                }
              />
              <UploadAvatar avatar={String(currentUser?.avatar)} />
              <div className='mt-6 text-xl font-medium text-mainColor2-800'>
                {currentUser?.name}
              </div>
              <div className='text-xs text-mainColor2-800/90'>
                {currentUser?.email}
              </div>
            </div>
            <div className='grid grid-rows-4 py-2 mx-6 bg-white rounded-xl'>
              <div className='py-2 mx-2'>
                <div className='bg-[#F7F7FE] w-fit text-center text-xs text-mainColor1-600 px-2 py-1.5 rounded-lg font-medium'>
                  Sản phẩm đã xem
                </div>
                <div className='flex items-end justify-between mt-1 mb-4'>
                  <span className='my-1 ml-1 text-xl font-bold leading-none'>
                    2380
                  </span>
                  <div className='flex items-center gap-2 text-sm text-green-500'>
                    <TrendingUp className='w-4 leading-none' />
                    <span>6.53%</span>
                  </div>
                </div>

                <Separator />
              </div>

              <div className='py-2 mx-2'>
                <div className='bg-[#F9F6FE] w-fit text-center text-xs text-mainColor2-800/90 px-3 py-1.5 rounded-lg font-medium'>
                  Đơn đặt hàng
                </div>
                <div className='flex items-end justify-between mt-1 mb-4'>
                  <span className='my-1 ml-1 text-xl font-bold leading-none'>
                    32
                  </span>
                  <div className='flex items-center gap-2 text-sm text-green-500'>
                    <TrendingUp className='w-4 leading-none' />
                    <span>6.53%</span>
                  </div>
                </div>
                <Separator />
              </div>

              <div className='py-2 mx-2'>
                <div className='bg-[#FEF6F5] w-fit text-center text-xs text-red-500 px-3 py-1.5 rounded-lg font-medium'>
                  Sản phẩm yêu thích
                </div>
                <div className='flex items-end justify-between mt-1 mb-4'>
                  <span className='my-1 ml-1 text-xl font-bold leading-none'>
                    127
                  </span>
                  <div className='flex items-center gap-2 text-sm text-green-500'>
                    <TrendingUp className='w-4 leading-none' />
                    <span>6.53%</span>
                  </div>
                </div>
                <Separator />
              </div>
              <div className='py-2 mx-2'>
                <div className='bg-[#F3FEF8] w-fit text-center text-xs text-green-500 px-3 py-1.5 rounded-lg font-medium'>
                  Đánh giá
                </div>
                <div className='flex items-end justify-between mt-1'>
                  <span className='my-1 ml-1 text-xl font-bold leading-none'>
                    12
                  </span>
                  <div className='flex items-center gap-2 text-sm text-green-500'>
                    <TrendingUp className='w-4 leading-none' />
                    <span>6.53%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
