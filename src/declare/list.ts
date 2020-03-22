import { AxiosResponse } from 'axios';

export interface List {
  id?: number;
  title: string;
  createdAt?: string | number;
  updatedAt?: string | number;
}

export interface ListResponse extends AxiosResponse {
  lists: List[];
}
