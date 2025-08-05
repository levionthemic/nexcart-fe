import { IoMenu } from 'react-icons/io5'
import Link from 'next/link'
import { ModeToggle } from '@/components/mode-toggle'

export default function MenuBar() {
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
          <IoMenu className='text-2xl text-white cursor-pointer hover:scale-110 transition-transform hover:ease-in-out hover:duration-300' />
          <ul className='flex items-center gap-8 text-white text-sm'>
            <Link href={'/'}>
              <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
                Trang chủ
              </li>
            </Link>
            <Link href={'/product'}>
              <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
                Sản phẩm
              </li>
            </Link>
            <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
              Giới thiệu
            </li>
            <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
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
