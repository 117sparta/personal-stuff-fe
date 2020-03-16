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

export default {
  createBoard
};
