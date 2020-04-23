import requestObj from './config/request';
import generateTimeStamp from './lib/timestamp';
import lib from '@/lib';

function createCard (message) {
  return requestObj.post(
    '/card/createCard',
    {
      ...message,
      createdAt: generateTimeStamp(),
      updatedAt: generateTimeStamp()
    }
  );
}

function updateCard (cardList, listId?) {
  return requestObj.post(
    '/card/updateCard',
    JSON.stringify({
      cardList: cardList.map((item: any) => {
        return {
          ...item,
          updatedAt: generateTimeStamp(),
          createdAt: lib.dateToString(item.createdAt),
          deadline: lib.dateToString(item.deadline)
        };
      }),
      listId
    })
  );
}

function queryCardInfo (cardId: number) {
  return requestObj.post(
    '/card/queryCardInfo',
    {
      cardId
    }
  );
}

function deleteCard (cardId: number) {
  return requestObj.post(
    '/card/deleteCard',
    {
      cardId
    }
  );
}

function attachLabel (cardId: number, labelId: number, isDelete: boolean) {
  return requestObj.post(
    '/card/attachLabel',
    {
      cardId,
      labelId,
      isDelete,
      createdAt: generateTimeStamp()
    }
  );
}

function searchCardGlobal (keyword: string) {
  return requestObj.post(
    '/card/searchCardGlobal',
    {
      keyword
    }
  );
}

function searchCardInBoard (keyword:string, boardId: number) {
  return requestObj.post(
    '/card/searchCardInBoard',
    {
      keyword,
      boardId
    }
  );
}

export default {
  createCard,
  updateCard,
  queryCardInfo,
  deleteCard,
  attachLabel,
  searchCardGlobal,
  searchCardInBoard
};
