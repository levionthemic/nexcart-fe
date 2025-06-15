import { toast } from 'sonner'

export const asyncHandler = async <T>(promise: Promise<T>, toastCaption = '') => {
  let toastId: string | number = ''
  if (toastCaption) toastId = toast.loading(toastCaption)

  try {
    const res = await promise as any
    if (res?.error) return [null, res.error]
    return [res, null]
  } catch (err) {
    return [null, err]
  } finally {
    if (toastCaption) toast.dismiss(toastId)
  }
}
