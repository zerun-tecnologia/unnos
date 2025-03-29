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
