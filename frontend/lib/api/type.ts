export interface ApiResponse<T> {
  statusCode:number;
  message?:string;
  data?:T;
  meta?:PageMeta;
};

export interface PageMeta {
  currentPage:number;
  totalItems:number;
  totalPages:number;
  pageSize:number;
};

export interface SpringPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
};
