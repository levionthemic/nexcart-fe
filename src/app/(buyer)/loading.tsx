export default function Loading() {
  return (
   <div className='flex items-center justify-center h-screen'>
      <div className='text-center'>
        <div className='w-10 h-10 border-4 border-mainColor1-800 border-t-transparent rounded-full animate-spin mx-auto' />
        <p className='mt-2 text-sm text-gray-500'>Đang tải dữ liệu...</p>
      </div>
    </div>
  )
}
