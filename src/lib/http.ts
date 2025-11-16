import { refreshTokenApi } from '@/apis/auth.api'
import envConfig from '@/config'

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined
}

type RequestBodyType = Record<string, unknown> | FormData

export class HttpError extends Error {
  status: number
  message: string
  constructor(apiResponse: ApiResponse) {
    super('Http Error')
    this.status = apiResponse.status
    this.message = apiResponse.message
  }
}

export interface ApiResponse<T = unknown> {
  status: number
  message: string
  data: T
  timestamp: string
  path: string
}

let apiPendingRequests: (() => Promise<unknown>)[] = []
let isRefreshing = false

const request = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  options?: CustomOptions,
  requestBody?: RequestBodyType
) => {
  let body: string | FormData | undefined = undefined
  const baseHeaders: Record<string, string> = {}

  if (requestBody instanceof FormData) {
    body = requestBody
    // Don't set Content-Type for FormData, let browser set it with boundary
  } else if (requestBody) {
    body = JSON.stringify(requestBody)
    baseHeaders['Content-Type'] = 'application/json'
  }

  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl

  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : `${baseUrl}/${url}`

  const fetchOptions: RequestInit = {
    ...options,
    method,
    headers: { ...baseHeaders, ...options?.headers },
    credentials: options?.credentials || 'include'
  }

  if (body && method !== 'GET' && method !== 'DELETE') {
    fetchOptions.body = body
  }

  const res = await fetch(fullUrl, fetchOptions)

  const apiResponse: ApiResponse<T> = await res.json()

  // Refresh token
  if (apiResponse.status === 410) {
    if (!isRefreshing) {
      isRefreshing = true
      refreshTokenApi()
        .then(() => {
          // Call the holding requests respectively.
          apiPendingRequests.forEach((cb) => cb())
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
      apiPendingRequests.push(async () => {
        try {
          const retryResponse = await request<T>(
            method,
            url,
            options,
            requestBody
          )
          resolve(retryResponse)
        } catch (error) {
          console.log(error)
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
    body: RequestBodyType,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<T>('POST', url, options, body)
  },
  put<T>(
    url: string,
    body: RequestBodyType,
    options?: Omit<CustomOptions, 'body'> | undefined
  ) {
    return request<T>('PUT', url, options, body)
  },
  delete<T>(url: string, options?: Omit<CustomOptions, 'body'> | undefined) {
    return request<T>('DELETE', url, options)
  }
}

export default http
