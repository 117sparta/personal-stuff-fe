import requestObj from '@/api/config/request';
import generateTimeStamp from './lib/timestamp';

function createBoard (board) {
  return requestObj.post(
    '/board/createBoard',
    {
      ...board,
      updatedAt: generateTimeStamp(),
      createdAt: generateTimeStamp()
    }
  );
}

function queryBoardList (boardTitle?: string) {
  return requestObj.post(
    '/board/queryBoardList',
    {
      title: boardTitle
    }
  );
}

export default {
  createBoard,
  queryBoardList
};
