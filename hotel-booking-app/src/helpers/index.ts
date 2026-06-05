import dayjs from 'dayjs'

export const getDateFormat = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).format('MMM DD, YYYY')
}

export const getDateTimeFormat = (date: string | Date | dayjs.Dayjs): string => {
  return dayjs(date).format('MMM DD, YYYY h:mm A')
}

export const getHotelStatusColor = (status: string): string => {
  switch (status?.toUpperCase()) {
    case "APPROVED":
      return "bg-green-100 text-green-800"
    case "PENDING":
      return "bg-yellow-100 text-yellow-800"
    case "REJECTED":
      return "bg-red-100 text-red-800"
    case "ACTIVE":
      return "bg-green-100 text-green-800"
    case "INACTIVE":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getUserRoleColor = (role: string): string => {
  switch (role?.toLowerCase()) {
    case "admin":
      return "bg-purple-100 text-purple-800"
    case "owner":
      return "bg-blue-100 text-blue-800"
    case "customer":
      return "bg-green-100 text-green-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}