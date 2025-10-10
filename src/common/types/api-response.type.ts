export type ApiResponseType<T> = {
  data: T;
  pagination?: {
    skip: number;
    limit: number;
  };
  total?: number;
};
