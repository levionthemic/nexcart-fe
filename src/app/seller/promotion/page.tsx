// import PromotionTable from './promotion-table'
import { RiDiscountPercentLine } from 'react-icons/ri'
import { PiSpinnerBallFill } from 'react-icons/pi'
import { LuAlarmClock } from 'react-icons/lu'
import { FaHourglassEnd, FaMoneyBillWave } from 'react-icons/fa'
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

      <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 mb-4'>
        <div className='col-span-1 bg-white rounded-lg p-4 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Tổng số chương trình khuyến mãi
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <span className='leading-none'>173</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='bg-[#F0FAFF] text-blue-500 p-2 rounded-full'>
            <RiDiscountPercentLine className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 bg-white rounded-lg p-4 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Số chương trình đang hoạt động
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <span className='leading-none'>14</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='bg-[#FFFAEF] text-yellow-500 p-2 rounded-full'>
            <PiSpinnerBallFill className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 bg-white rounded-lg p-4 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Số chương trình sắp bắt đầu
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <span className='leading-none'>150</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='bg-[#F1FCF6] text-green-600 p-2 rounded-full'>
            <LuAlarmClock className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 bg-white rounded-lg p-4 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Số chương trình sắp kết thúc
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <span className='leading-none'>9</span>
              <span className='text-xs text-gray-600'>chương trình</span>
            </span>
          </div>
          <div className='bg-red-100 text-red-500 p-2 rounded-full'>
            <FaHourglassEnd className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 bg-white rounded-lg p-4 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Tỉ lệ sử dụng mã giảm giá
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <span className='leading-none'>84</span>
              <span className='text-xs text-gray-600'>%</span>
            </span>
          </div>
          <div className='bg-[#E8E8E8] text-gray-500 p-2 rounded-full'>
            <TbPercentage20 className='text-2xl' />
          </div>
        </div>
        <div className='col-span-1 bg-white rounded-lg p-4 flex items-center justify-between'>
          <div className=''>
            <span className='font-medium text-sm text-gray-500 mb-2 inline-block'>
              Doanh thu từ khuyến mãi
            </span>
            <span className='text-2xl font-bold flex items-end gap-1'>
              <span className='leading-none'>9.598.545</span>
              <span className='text-xs text-gray-600'>VNĐ</span>
            </span>
          </div>
          <div className='bg-slate-300 text-slate-800 p-2 rounded-full'>
            <FaMoneyBillWave className='text-2xl' />
          </div>
        </div>
      </div>

      {/* <PromotionTable /> */}
    </div>
  )
}
