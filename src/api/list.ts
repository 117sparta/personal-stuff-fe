import requestObj from './config/request';
import generateTimestamp from './lib/timestamp';
import lib from '@/lib';

// 创建或者更新列表，listTitle是列表标题，status表示是创建还是更新，值有两个： CREATE， UPDATE
function createList (listTitle: string, boardId: number, status: string, listId?: number) {
  const url = status === 'CREATE' ? '/list/createList' : '/list/updateList';
  return requestObj.post(
    url,
    {
      title: listTitle,
      boardId,
      createdAt: generateTimestamp(),
      updatedAt: generateTimestamp(),
      listId
    }
  );
}

function updateListOrder (lists) {
  const url = '/list/updateList';
  lists.forEach(item => {
    item.updatedAt = generateTimestamp();
    item.createdAt = lib.dateToString(item.createdAt);
  });
  return requestObj.post(
    url,
    JSON.stringify(lists)
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

function queryAllList (boardId) {
  return requestObj.post(
    '/list/queryAllList',
    {
      boardId
    }
  );
}

function queryList (boardId, listId) {
  return requestObj.post(
    '/list/queryList',
    {
      boardId,
      listId
    }
  );
}

export default {
  createList,
  queryAllList,
  deleteList,
  queryList,
  updateListOrder
};
