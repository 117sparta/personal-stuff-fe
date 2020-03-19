import requestObj from '@/api/config/request';
import generateTimeStamp from './lib/timestamp';
import lib from '@/lib';

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

function deleteBoard (boardId: number) {
  return requestObj.post(
    '/board/deleteBoard',
    {
      id: boardId
    }
  );
}

function updateBoard (board) {
  return requestObj.post(
    '/board/updateBoard',
    {
      ...board,
      createdAt: lib.dateToString(board.createdAt),
      updatedAt: generateTimeStamp()
    }
  );
}

export default {
  createBoard,
  queryBoardList,
  deleteBoard,
  updateBoard
};
