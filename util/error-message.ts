import { AxiosError } from 'axios'

export function getErrorMessage(error: any) {
  const axiosError = error as AxiosError<{ error: string }>
  if (axiosError.isAxiosError) {
    return axiosError.response?.data.error || axiosError.message
  }

  return 'Unknown error'
}
