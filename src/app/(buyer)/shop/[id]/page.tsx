'use client'

import { GetProductsResponseType, getSellerProductsApi } from '@/apis/product.api'
import { getPublicSellerProfileApi } from '@/apis/user.api'
import { ProductCard } from '@/components/product'
import { ProductListItem } from '@/types/entities/product'
import { User } from '@/types/entities/user'
import { DEFAULT_IMAGE_URL } from '@/utils/constants'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useLoading } from '@/contexts/loading-context'
import { Separator } from '@/components/ui/separator'
import { Box, CalendarCheck, MessageCircle, Plus, Star, Store, UserPlus, UserRoundPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { format } from 'date-fns'
import ChatBox from '@/components/chat/chatbox'

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
        if (data) setProducts(data.data); setData(data)
      })
      .finally(() => endLoading())
  }, [sellerId])

  return (
    <div className='bg-[#F5F5FA] dark:bg-background py-4'>
      <div className='container mx-auto py-6'>
        <Tabs defaultValue='1'>
          <div className='dark:bg-mainColor1-200/50 bg-mainColor1-800/80 p-6 pb-2 rounded-xl mb-8'>
            <div className='flex items-center gap-10'>
              <div className='flex items-center gap-6 mb-6'>
                <Image
                  src={user?.avatar || DEFAULT_IMAGE_URL}
                  alt='Avatar'
                  width={96}
                  height={96}
                  className='w-24 h-24 rounded-full border object-cover'
                />
                <div className='space-y-4 text-accent'>
                  <h2 className='text-2xl font-bold'>
                    {user?.seller?.name || 'Chưa có tên'}
                  </h2>
                  <div className='text-base dark:text-muted-foreground flex items-center gap-4'>
                    <div className='flex items-center gap-1'>
                      <FaStar className='text-yellow-400 leading-0' size={16} />
                      <span className='leading-0'>4.5 / 5</span>
                    </div>
                    <Separator
                      orientation='vertical'
                      className='h-6! bg-muted-foreground'
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
                className='h-12! bg-muted-foreground'
              />
              <Button className='flex items-center gap-2 bg-mainColor1-800'>
                <Plus />
                <span>Theo dõi</span>
              </Button>

              <ChatBox className='flex items-center gap-2'>
                <MessageCircle />
                <span>Chat ngay</span>
              </ChatBox>
            </div>
            <div className='flex items-center justify-between'>
              <TabsList className='bg-transparent gap-10 w-[400px] h-fit'>
                <TabsTrigger
                  value='1'
                  className='rounded-none bg-transparent! dark:bg-transparent! shadow-none! data-[state=active]:border-b-2! data-[state=active]:text-white! data-[state=active]:border-b-white! data-[state=active]:border-transparent dark:data-[state=active]:border-transparent block py-3 h-fit text-base'
                >
                  Tất cả sản phẩm
                </TabsTrigger>
                <TabsTrigger
                  value='2'
                  className='rounded-none bg-transparent! dark:bg-transparent! shadow-none! data-[state=active]:border-b-2! data-[state=active]:text-white! data-[state=active]:border-b-white! data-[state=active]:border-transparent dark:data-[state=active]:border-transparent block py-3 h-fit text-base'
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
              <div className='bg-section text-2xl font-semibold p-4 pb-1 rounded-xl'>
                <div className=''>
                  Tất cả sản phẩm:{' '}
                  <span className='text-muted-foreground text-xl'>
                    ({products?.length} sản phẩm)
                  </span>
                </div>
                <TabsList className='space-x-10 bg-transparent h-fit'>
                  <TabsTrigger
                    value='product-1'
                    className='rounded-none bg-transparent! dark:bg-transparent! shadow-none! data-[state=active]:border-b-2! data-[state=active]:text-white! data-[state=active]:border-b-white! data-[state=active]:border-transparent dark:data-[state=active]:border-transparent block py-3 h-fit text-base'
                  >
                    Phổ biến
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-2'
                    className='rounded-none bg-transparent! dark:bg-transparent! shadow-none! data-[state=active]:border-b-2! data-[state=active]:text-white! data-[state=active]:border-b-white! data-[state=active]:border-transparent dark:data-[state=active]:border-transparent block py-3 h-fit text-base'
                  >
                    Bán chạy
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-3'
                    className='rounded-none bg-transparent! dark:bg-transparent! shadow-none! data-[state=active]:border-b-2! data-[state=active]:text-white! data-[state=active]:border-b-white! data-[state=active]:border-transparent dark:data-[state=active]:border-transparent block py-3 h-fit text-base'
                  >
                    Hàng mới
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-4'
                    className='rounded-none bg-transparent! dark:bg-transparent! shadow-none! data-[state=active]:border-b-2! data-[state=active]:text-white! data-[state=active]:border-b-white! data-[state=active]:border-transparent dark:data-[state=active]:border-transparent block py-3 h-fit text-base'
                  >
                    Giá thấp đến cao
                  </TabsTrigger>
                  <TabsTrigger
                    value='product-5'
                    className='rounded-none bg-transparent! dark:bg-transparent! shadow-none! data-[state=active]:border-b-2! data-[state=active]:text-white! data-[state=active]:border-b-white! data-[state=active]:border-transparent dark:data-[state=active]:border-transparent block py-3 h-fit text-base'
                  >
                    Giá cao đến thấp
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value='product-1'>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5'>
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
            <div className='bg-section p-4 rounded-lg flex items-center h-fit'>
              <div className='flex items-center justify-around flex-1'>
                <div className='flex flex-col items-center justify-center gap-4 text-2xl'>
                  <div className=''>Tỉ lệ hủy</div>
                  <div className='text-green-500 text-4xl'>0 %</div>
                </div>
                <div className='flex flex-col items-center justify-center gap-4 text-2xl'>
                  <div className=''>Tỉ lệ thành công</div>
                  <div className='text-green-500 text-4xl'>0 %</div>
                </div>
              </div>
              <Separator orientation='vertical' className='data-[orientation=vertical]:h-72 mx-10'/>
              <div className='flex-1 space-y-6'>
                <div className="flex items-center">
                  <div className="flex items-center gap-2 w-[40%] text-muted-foreground">
                    <CalendarCheck />
                    <span>Thành viên từ năm</span>
                  </div>
                  <div className='flex-1'>{format(user?.seller?.foundedDate || Date.now(), 'yyyy')}</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2 w-[40%] text-muted-foreground">
                    <Box />
                    <span>Sản phẩm</span>
                  </div>
                  <div className='flex-1'>{data?.meta.total}</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2 w-[40%] text-muted-foreground">
                    <Store />
                    <span>Mô tả cửa hàng</span>
                  </div>
                  <div className='flex-1'>{user?.seller?.description || 'Không có mô tả'}</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2 w-[40%] text-muted-foreground">
                    <Star />
                    <span>Đánh giá</span>
                  </div>
                  <div className='flex-1 leading-none'>4.5 / 5 <FaStar className='text-yellow-400 inline ml-1 mr-3' size={16} />(5.5tr+)</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2 w-[40%] text-muted-foreground">
                    <UserPlus />
                    <span>Người theo dõi</span>
                  </div>
                  <div className='flex-1'>510.5k+</div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center gap-2 w-[40%] text-muted-foreground">
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
