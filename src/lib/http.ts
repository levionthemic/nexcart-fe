import { refreshTokenAPI } from '@/apis/auth.api'
import envConfig from '@/config'

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined
}

class HttpError extends Error {
  status: number
  message: string
  constructor(apiResponse: ApiResponse) {
    super('Http Error')
    this.status = apiResponse.statusCode
    this.message = apiResponse.message
  }
}

export interface ApiResponse<T = unknown> {
  statusCode: number
  message: string
  data?: T
}

let apiPendingRequests: ((
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions
) => unknown)[] = []
let isRefreshing = false

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions
) => {
  const body = options?.body ? JSON.stringify(options?.body) : undefined
  const baseHeaders = {
    'Content-Type': 'application/json'
  }
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const res = await fetch(fullUrl, {
    ...options,
    headers: { ...baseHeaders, ...options?.headers },
    body,
    method
  })

  const apiResponse: ApiResponse<T> = await res.json()

  // Refresh token
  if (apiResponse.statusCode === 410) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshTokenAPI()
        .then(() => {
          // Call the holding requests respectively.
          apiPendingRequests.forEach((cb) => cb(method, url, options))
          apiPendingRequests = []
        })
        .catch((error) => {
          apiPendingRequests = []
          throw error
        })
        .finally(() => (isRefreshing = false))
    }

    // If is refreshing, the incoming request will be held and pushed to queue. Return Promise for that waiting purpose.
    return new Promise<ApiResponse<T>>((resolve, reject) => {
      apiPendingRequests.push(async (method, url, options) => {
        try {
          const retryResponse = await request<T>(method, url, options)
          resolve(retryResponse)
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  if (!res.ok) throw new HttpError(apiResponse)

  return apiResponse
}

const http = {
  get<T>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<T>('GET', url, options)
  },
  post<T>(
    url: string,
    body: BodyInit,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<T>('POST', url, { ...options, body })
  },
  put<T>(
    url: string,
    body: BodyInit,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<T>('PUT', url, { ...options, body })
  },
  delete<T>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<T>('DELETE', url, options)
  }
}

export default http
