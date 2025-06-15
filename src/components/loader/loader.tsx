function Loader({ caption }: { caption: string }) {
  return (
    <div className='w-[98vw] h-[calc(90vh)] flex items-center justify-center'>
      <div className='w-2 h-2 mr-2 rounded-full bg-mainColor1-600 animate-bounce'></div>
      <div className='w-2 h-2 bg-mainColor1-600 mr-2 rounded-full animate-bounce [animation-delay:-0.2s]'></div>
      <div className='w-2 h-2 bg-mainColor1-600 mr-2 rounded-full animate-bounce [animation-delay:-0.4s]'></div>
      <span>{caption}</span>
    </div>
  )
}

export default Loader
