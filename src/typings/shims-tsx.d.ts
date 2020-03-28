import Vue, { VNode } from 'vue';
import { AxiosResponse } from 'axios';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Board {
    id?: number;
    title: string;
    updatedAt: number | string;
    createdAt: number | string;
    boardId: string;
  }
  interface BoardResponse extends AxiosResponse {
    boardList: Board[];
  }
  interface List {
    id?: number;
    title: string;
    createdAt?: string | number;
    updatedAt?: string | number;
  }
  interface ListResponse extends AxiosResponse {
    lists: List[];
  }
}
