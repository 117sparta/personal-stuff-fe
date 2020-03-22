import requestObj from './config/request';
import generateTimestamp from './lib/timestamp';

// 创建或者更新列表，listTitle是列表标题，status表示是创建还是更新，值有两个： CREATE， UPDATE
function createList (listTitle: string, boardId: number, status: string) {
  const url = status === 'CREATE' ? '/list/createList' : '/list/updateList';
  return requestObj.post(
    url,
    {
      title: listTitle,
      boardId,
      createdAt: generateTimestamp(),
      updatedAt: generateTimestamp()
    }
  );
}

function deleteList (listId: number) {
  return requestObj.post(
    '/list/deleteList',
    {
      id: listId
    }
  );
}

function queryList (boardId) {
  return requestObj.post(
    '/list/queryList',
    {
      boardId
    }
  );
}

export default {
  createList,
  queryList,
  deleteList
};
