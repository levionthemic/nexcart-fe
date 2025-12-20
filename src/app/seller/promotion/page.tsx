// import PromotionTable from './promotion-table'
import { FaHourglassEnd, FaMoneyBillWave } from 'react-icons/fa'
import { LuAlarmClock } from 'react-icons/lu'
import { PiSpinnerBallFill } from 'react-icons/pi'
import { RiDiscountPercentLine } from 'react-icons/ri'
import { TbPercentage20 } from 'react-icons/tb'

import PageHeader from '../_components/page-header'

export default function Promotion() {
  return (
    <div className='px-6 py-4'>
      <PageHeader
        links={[
          {
            link: '/seller',
            label: 'Dashboard'
          }
        ]}
        title='Quản lý khuyến mãi'
      />

      <div className='mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3'>
        <div className='col-span-1 flex items-center justify-between rounded-lg bg-white p-4'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Tổng số chương trình khuyến mãi
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <span className='leading-none'>173</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='rounded-full bg-[#F0FAFF] p-2 text-blue-500'>
            <RiDiscountPercentLine className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-between rounded-lg bg-white p-4'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Số chương trình đang hoạt động
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <span className='leading-none'>14</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='rounded-full bg-[#FFFAEF] p-2 text-yellow-500'>
            <PiSpinnerBallFill className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-between rounded-lg bg-white p-4'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Số chương trình sắp bắt đầu
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <span className='leading-none'>150</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='rounded-full bg-[#F1FCF6] p-2 text-green-600'>
            <LuAlarmClock className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-between rounded-lg bg-white p-4'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Số chương trình sắp kết thúc
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <span className='leading-none'>9</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='rounded-full bg-red-100 p-2 text-red-500'>
            <FaHourglassEnd className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-between rounded-lg bg-white p-4'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Tỉ lệ sử dụng mã giảm giá
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <span className='leading-none'>84</span>
              <span className='text-xs text-gray-600'>%</span>
            </span>
          </div>
          <div className='rounded-full bg-[#E8E8E8] p-2 text-gray-500'>
            <TbPercentage20 className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 flex items-center justify-between rounded-lg bg-white p-4'>
          <div className=''>
            <span className='mb-2 inline-block text-sm font-medium text-gray-500'>
              Doanh thu từ khuyến mãi
            </span>
            <span className='flex items-end gap-1 text-2xl font-bold'>
              <span className='leading-none'>9.598.545</span>
              <span className='text-xs text-gray-600'>VNĐ</span>
            </span>
          </div>
          <div className='rounded-full bg-slate-300 p-2 text-slate-800'>
            <FaMoneyBillWave className='text-2xl' />
          </div>
        </div>
      </div>

      {/* <PromotionTable /> */}
    </div>
  )
}
