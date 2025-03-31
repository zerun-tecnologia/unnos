declare type FormField<T> = {
  value: T
  errors: string[]
}

declare type Query<T = any> = {
  search?: string
  page?: number
  perPage?: number
  filters?: T
}

declare type PaginatedQueryResponse<T> = {
  total: number
  items: T[]
  page: number
  perPage: number
}
