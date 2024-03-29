import requestObj from '@/api/config/request';
import generateTimeStamp from './lib/timestamp';
import lib from '@/lib';

function createStuffList (stuffList, cardId) {
  return requestObj.post(
    '/stuffList/createStuffList',
    {
      ...stuffList,
      cardId,
      updatedAt: generateTimeStamp(),
      createdAt: generateTimeStamp()
    }
  );
}

function updateStuffList (stuffLists) {
  stuffLists.forEach(item => {
    item.updatedAt = generateTimeStamp();
    item.createdAt = lib.dateToString(item.createdAt);
  });
  const data = JSON.stringify(stuffLists);
  return requestObj.post(
    '/stuffList/updateStuffList',
    data
  );
}

function deleteStuffList (stuffListId) {
  return requestObj.post(
    '/stuffList/deleteStuffList',
    {
      id: stuffListId
    }
  );
}

function createStuffListItem (stuffListItem, stuffListId) {
  return requestObj.post(
    '/stuffList/createStuffListItem',
    {
      ...stuffListItem,
      createdAt: generateTimeStamp(),
      updatedAt: generateTimeStamp(),
      stuffListId
    }
  );
}

// update 函数的逻辑（基本上所有类别的update逻辑都是），如果stuffListItems的长度为1，那么为更新列表信息，否则就是更换顺序。
function updateStuffListItems (stuffListItems) {
  stuffListItems.forEach(item => {
    item.updatedAt = generateTimeStamp();
    item.createdAt = lib.dateToString(item.createdAt);
  });
  const data = JSON.stringify(stuffListItems);
  return requestObj.post(
    '/stuffList/updateStuffListItem',
    data
  );
}

function deleteStuffListItem (id) {
  return requestObj.post(
    '/stuffList/deleteStuffListItem',
    {
      id
    }
  );
}

export default {
  createStuffList,
  updateStuffListItems,
  updateStuffList,
  createStuffListItem,
  deleteStuffListItem,
  deleteStuffList
};
