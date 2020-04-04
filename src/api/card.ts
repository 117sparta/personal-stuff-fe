import requestObj from './config/request';
import generateTimeStamp from './lib/timestamp';

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
          updatedAt: generateTimeStamp()
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

export default {
  createCard,
  updateCard,
  queryCardInfo
};
