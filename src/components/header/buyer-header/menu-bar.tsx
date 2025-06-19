import { IoMenu } from 'react-icons/io5'
import { FaPhoneAlt } from 'react-icons/fa'
import Link from 'next/link'

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
            <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
              <Link href={'/buyer'}>Trang chủ</Link>
            </li>
            <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
              Sản phẩm
            </li>
            <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
              Giới thiệu
            </li>
            <li className='py-2 px-4 hover:text-mainColor1-400 hover:bg-white cursor-pointer transition-all hover:ease-in-out hover:duration-300'>
              Liên hệ
            </li>
          </ul>
          <div className='flex items-center gap-3 text-white text-sm'>
            <FaPhoneAlt className='animate-phoneShake' /> 0798 576 809
          </div>
        </div>
      </div>
    </div>
  )
}
