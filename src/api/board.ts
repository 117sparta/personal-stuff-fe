import requestObj from '@/api/config/request.config';

function createBoard (board) {
  return requestObj.post(
    '/board/createBoard',
    board
  );
}

export default {
  createBoard
};
