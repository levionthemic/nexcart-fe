import { ApiResponse } from "@/lib/http"

export const asyncHandler = async <T>(promise: Promise<T>) => {
  try {
    const res = await promise as ApiResponse<T>
    if (res?.status >= 300) return [null, res.message]
    return [res, null]
  } catch (err) {
    return [null, err]
  }
}
