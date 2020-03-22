import { AxiosResponse } from 'axios';

export interface Board {
  id?: number;
  title: string;
  updatedAt: number | string;
  createdAt: number | string;
  boardId: string;
}

export interface BoardResponse extends AxiosResponse {
  boardList: Board[];
}
