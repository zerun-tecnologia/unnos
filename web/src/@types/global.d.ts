export type FormField<T> = {
  value: T
  errors: string[]
}

export type Query<T = any> = {
  search?: string
  page?: number
  perPage?: number
  filters?: T
}

export type PaginatedQueryResponse<T> = {
  total: number
  items: T[]
  page: number
  perPage: number
}