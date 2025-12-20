import Link from 'next/link'
import { useEffect, useState } from 'react'
import { IoMenu } from 'react-icons/io5'

import { getCategoriesApi } from '@/apis/category.api'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Category } from '@/types/entities/category'

export default function MenuBar() {
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    getCategoriesApi().then((data) => setCategories(data))
  }, [])
  return (
    <div
      className='bg-mainColor1-400'
      style={{
        boxShadow:
          'rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px'
      }}
    >
      <div className='container mx-auto'>
        <div className='flex items-center justify-between'>
          {/* Popover for categories */}
          <div className='relative'>
            <Popover>
              <PopoverTrigger asChild>
                <button className='hover:text-mainColor1-400 flex cursor-pointer items-center gap-2 rounded-full px-4 py-1 text-white transition-all hover:bg-white'>
                  <IoMenu className='text-2xl' />
                  <span>Danh mục</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className='bg-section w-auto rounded-lg p-1 shadow-xl'>
                <div className='custom-scrollbar max-h-96 overflow-auto rounded-lg'>
                  <ul className='mb-2 grid grid-cols-4 gap-y-4 last:mb-0'>
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/category/${category.slug}`}
                          className='hover:bg-mainColor1-100 text-mainColor1-700 block cursor-pointer rounded px-3 py-1 font-medium'
                        >
                          {category.name}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <ul className='mt-1 ml-4 space-y-0'>
                            {category.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/category/${child.slug}`}
                                  className='hover:bg-mainColor1-50 text-mainColor1-600 block cursor-pointer rounded px-1 py-0.5 text-sm'
                                >
                                  {child.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <ul className='flex items-center gap-8 text-sm text-white'>
            <Link href={'/'}>
              <li className='hover:text-mainColor1-400 cursor-pointer rounded-full px-4 py-1 transition-all hover:bg-white hover:duration-300 hover:ease-in-out'>
                Trang chủ
              </li>
            </Link>
            <Link href={'/product'}>
              <li className='hover:text-mainColor1-400 cursor-pointer rounded-full px-4 py-1 transition-all hover:bg-white hover:duration-300 hover:ease-in-out'>
                Sản phẩm
              </li>
            </Link>
            <li className='hover:text-mainColor1-400 cursor-pointer rounded-full px-4 py-1 transition-all hover:bg-white hover:duration-300 hover:ease-in-out'>
              Giới thiệu
            </li>
            <li className='hover:text-mainColor1-400 cursor-pointer rounded-full px-4 py-1 transition-all hover:bg-white hover:duration-300 hover:ease-in-out'>
              Liên hệ
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
