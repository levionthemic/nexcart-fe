import { IoMenu } from 'react-icons/io5'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Category } from '@/types/entities/category'
import { getCategoriesApi } from '@/apis/category.api'

export default function MenuBar() {
  const [categories, setCategories] = useState<Category[]>([])
  useEffect(() => {
    getCategoriesApi().then((data) => setCategories(data))
  }, [])
  return (
    <div
      className='bg-mainColor1-400 rounded-full'
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
                <button className='flex items-center gap-2 py-1 px-4 text-white hover:text-mainColor1-400 hover:bg-white rounded-full cursor-pointer transition-all'>
                  <IoMenu className='text-2xl' />
                  <span>Danh mục</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className='w-auto bg-section rounded-lg shadow-xl p-1'>
                <div className="max-h-96 overflow-auto rounded-lg custom-scrollbar">
                  <ul className='grid grid-cols-4 gap-y-4 mb-2 last:mb-0'>
                    {categories?.map((category) => (
                      <li key={category.id}>
                        <Link
                          href={`/category/${category.slug}`}
                          className='block font-medium py-1 px-3 hover:bg-mainColor1-100 rounded cursor-pointer text-mainColor1-700'
                        >
                          {category.name}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <ul className="ml-4 mt-1 space-y-0">
                            {category.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/category/${child.slug}`}
                                  className="block py-0.5 px-1 hover:bg-mainColor1-50 rounded cursor-pointer text-mainColor1-600 text-sm"
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
          <ul className='flex items-center gap-8 text-white text-sm'>
            <Link href={'/'}>
              <li className='py-1 px-4 rounded-full hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
                Trang chủ
              </li>
            </Link>
            <Link href={'/product'}>
              <li className='py-1 px-4 rounded-full hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
                Sản phẩm
              </li>
            </Link>
            <li className='py-1 px-4 rounded-full hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
              Giới thiệu
            </li>
            <li className='py-1 px-4 rounded-full hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
              Liên hệ
            </li>
          </ul>
          <div className='flex items-center gap-4'>
            <span>Chế độ: </span>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}
