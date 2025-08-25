export const asyncHandler = async <T>(promise: Promise<T>) => {
  try {
    return await promise
  } catch (err) {
    return Promise.reject(err)
  }
}
