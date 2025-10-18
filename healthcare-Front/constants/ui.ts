export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
} as const

export const ROLE_COLORS = {
  Owner: "bg-purple-100 text-purple-800 border-purple-200",
  Doctor: "bg-blue-100 text-blue-800 border-blue-200",
  Patient: "bg-green-100 text-green-800 border-green-200",
  Unknown: "bg-gray-100 text-gray-800 border-gray-200",
} as const

export const ROUTES = {
  DASHBOARD: "dashboard",
  MANAGE_DOCTORS: "manage-doctors",
  MEDICAL_RECORDS: "medical-records",
  ANALYTICS: "analytics",
} as const
