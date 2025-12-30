/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { format } from 'date-fns'
import {
  Box,
  CalendarCheck,
  MessageCircle,
  Plus,
  Star,
  Store,
  UserPlus,
  UserRoundPlus
} from 'lucide-react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'

import {
  GetProductsResponseType,
  getSellerProductsApi
} from '@/apis/product.api'
import { getPublicSellerProfileApi } from '@/apis/user.api'
import ChatBox from '@/components/features/chat/chatbox'
import { ProductCard } from '@/components/features/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLoading } from '@/contexts/loading-context'
import { ProductListItem } from '@/types/entities/product'
import { User } from '@/types/entities/user'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'

export default function ShopDetail() {
  const { startLoading, endLoading, apiLoadingCount } = useLoading()

  const [user, setUser] = useState<User | null>(null)
  const sellerId = useParams().id as string

  useEffect(() => {
    startLoading()
    getPublicSellerProfileApi(sellerId)
      .then((data) => {
        if (data) setUser(data)
      })
      .finally(() => endLoading())
  }, [sellerId])

  const [products, setProducts] = useState<ProductListItem[] | null>(null)
  const [data, setData] = useState<GetProductsResponseType>()
  useEffect(() => {
    startLoading()
    getSellerProductsApi(sellerId)
      .then((data) => {
        if (data) setProducts(data.data)
        setData(data)
      })
      .finally(() => endLoading())
  }, [sellerId])

  return (
    <div className='dark:bg-background bg-[#F5F5FA] py-4'>
      <div className='container mx-auto py-6'>
        <Tabs defaultValue='1'>
          <div className='dark:bg-mainColor1-200/50 bg-mainColor1-800/80 mb-8 rounded-xl p-6 pb-2'>
            <div className='flex items-center gap-10'>
              <div className='mb-6 flex items-center gap-6'>
                <Image
                  src={user?.avatar || DEFAULT_IMAGE_URL}
                  alt='Avatar'
                  width={96}
                  height={96}
                  className='h-24 w-24 rounded-full border object-cover'
                />
                <div className='text-accent space-y-4'>
                  <h2 className='text-2xl font-bold'>
                    {user?.seller?.name || 'Chưa có tên'}
                  </h2>
                  <div className='dark:text-muted-foreground flex items-center gap-4 text-base'>
                    <div className='flex items-center gap-1'>
                      <FaStar className='leading-0 text-yellow-400' size={16} />
                      <span className='leading-0'>4.5 / 5</span>
                    </div>
                    <Separator
                      orientation='vertical'
                      className='bg-muted-foreground h-6!'
                    />
                    <div className='flex items-center gap-1'>
                      <UserRoundPlus size={16} className='leading-0' />
                      <div className='leading-0'>Người theo dõi: 510.5k+</div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator
                orientation='vertical'
                className='bg-muted-foreground h-12!'
              />
              <Button className='bg-mainColor1-800 flex items-center gap-2'>
                <Plus />
                <span>Theo dõi</span>
              </Button>

              <ChatBox className='flex items-center gap-2'>
                <MessageCircle />
                <span>Chat ngay</span>
              </ChatBox>
            </div>
            <div className='flex items-center justify-between'>
              <TabsList className='h-fit w-[400px] gap-10 bg-transparent'>
                <TabsTrigger
                  value='1'
                  className='block h-fit rounded-none bg-transparent! py-3 text-base shadow-none! data-[state=active]:border-b-2! data-[state=active]:border-transparent data-[state=active]:border-b-white! data-[state=active]:text-white! dark:bg-transparent! dark:data-[state=active]:border-transparent'
                >
                  Tất cả sản phẩm
                </TabsTrigger>
                <TabsTrigger
                  value='2'
                  className='block h-fit rounded-none bg-transparent! py-3 text-base shadow-none! data-[state=active]:border-b-2! data-[state=active]:border-transparent data-[state=active]:border-b-white! data-[state=active]:text-white! dark:bg-transparent! dark:data-[state=active]:border-transparent'
                >
                  Hồ sơ cửa hàng
                </TabsTrigger>
              </TabsList>
              <Input
                type='text'
                className='w-96'
                placeholder='Tìm sản phẩm tại cửa hàng...'
              />
            </div>
          </div>
          <TabsContent value='1'>
            <Tabs defaultValue='product-1' className='w-full'>
              <div className='bg-section rounded-xl p-4 pb-1 text-2xl font-semibold'>
                <div className=''>
                  Tất cả sản phẩm:{' '}
                  <span className='text-muted-foreground text-xl'>
                    ({products?.length} sản phẩm)
                  </span>
                </div>
                <TabsList className='h-fit space-x-10 bg-transparent'>
                  <TabsTrigger
                    value='product-1'
                    className='block h-fit rounded-none bg-transparent! py-3 text-base shadow-none! data-[state=active]:border-b-2! data-[state=active]:border-transparent data-[state=active]:border-b-white! data-[state=active]:text-white! dark:bg-transparent! dark:data-[state=active]:border-transparent'
                  >
                    Phổ biến
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-2'
                    className='block h-fit rounded-none bg-transparent! py-3 text-base shadow-none! data-[state=active]:border-b-2! data-[state=active]:border-transparent data-[state=active]:border-b-white! data-[state=active]:text-white! dark:bg-transparent! dark:data-[state=active]:border-transparent'
                  >
                    Bán chạy
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-3'
                    className='block h-fit rounded-none bg-transparent! py-3 text-base shadow-none! data-[state=active]:border-b-2! data-[state=active]:border-transparent data-[state=active]:border-b-white! data-[state=active]:text-white! dark:bg-transparent! dark:data-[state=active]:border-transparent'
                  >
                    Hàng mới
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-4'
                    className='block h-fit rounded-none bg-transparent! py-3 text-base shadow-none! data-[state=active]:border-b-2! data-[state=active]:border-transparent data-[state=active]:border-b-white! data-[state=active]:text-white! dark:bg-transparent! dark:data-[state=active]:border-transparent'
                  >
                    Giá thấp đến cao
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-5'
                    className='block h-fit rounded-none bg-transparent! py-3 text-base shadow-none! data-[state=active]:border-b-2! data-[state=active]:border-transparent data-[state=active]:border-b-white! data-[state=active]:text-white! dark:bg-transparent! dark:data-[state=active]:border-transparent'
                  >
                    Giá cao đến thấp
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value='product-1'>
                <div className='grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'>
                  {apiLoadingCount ? (
                    'Đang tải dữ liệu...'
                  ) : (
                    <>
                      {!products || products.length === 0
                        ? 'Không có kết quả'
                        : products?.map((product, index) => (
                            <ProductCard
                              product={product}
                              loading={false}
                              key={index}
                            />
                          ))}
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
          <TabsContent value='2'>
            <div className='bg-section flex h-fit items-center rounded-lg p-4'>
              <div className='flex flex-1 items-center justify-around'>
                <div className='flex flex-col items-center justify-center gap-4 text-2xl'>
                  <div className=''>Tỉ lệ hủy</div>
                  <div className='text-4xl text-green-500'>0 %</div>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 text-2xl'>
                  <div className=''>Tỉ lệ thành công</div>
                  <div className='text-4xl text-green-500'>0 %</div>
                </div>
              </div>
              <Separator
                orientation='vertical'
                className='mx-10 data-[orientation=vertical]:h-72'
              />
              <div className='flex-1 space-y-6'>
                <div className='flex items-center'>
                  <div className='text-muted-foreground flex w-[40%] items-center gap-2'>
                    <CalendarCheck />
                    <span>Thành viên từ năm</span>
                  </div>
                  <div className='flex-1'>
                    {format(user?.seller?.foundedDate || Date.now(), 'yyyy')}
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='text-muted-foreground flex w-[40%] items-center gap-2'>
                    <Box />
                    <span>Sản phẩm</span>
                  </div>
                  <div className='flex-1'>{data?.meta.total}</div>
                </div>
                <div className='flex items-center'>
                  <div className='text-muted-foreground flex w-[40%] items-center gap-2'>
                    <Store />
                    <span>Mô tả cửa hàng</span>
                  </div>
                  <div className='flex-1'>
                    {user?.seller?.description || 'Không có mô tả'}
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='text-muted-foreground flex w-[40%] items-center gap-2'>
                    <Star />
                    <span>Đánh giá</span>
                  </div>
                  <div className='flex-1 leading-none'>
                    4.5 / 5{' '}
                    <FaStar
                      className='mr-3 ml-1 inline text-yellow-400'
                      size={16}
                    />
                    (5.5tr+)
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='text-muted-foreground flex w-[40%] items-center gap-2'>
                    <UserPlus />
                    <span>Người theo dõi</span>
                  </div>
                  <div className='flex-1'>510.5k+</div>
                </div>
                <div className='flex items-center'>
                  <div className='text-muted-foreground flex w-[40%] items-center gap-2'>
                    <MessageCircle />
                    <span>Phản hồi chat</span>
                  </div>
                  <div className='flex-1'>Chưa có</div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
