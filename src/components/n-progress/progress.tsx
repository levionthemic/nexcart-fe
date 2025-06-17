import { useNProgress } from '@tanem/react-nprogress'
import NContainer from './container'
import Bar from './bar'


function NProgress({ isAnimating }: { isAnimating: boolean }) {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating
  })

  return (
    <NContainer animationDuration={animationDuration} isFinished={isFinished}>
      <Bar animationDuration={animationDuration} progress={progress} />
    </NContainer>
  )
}

export default NProgress
