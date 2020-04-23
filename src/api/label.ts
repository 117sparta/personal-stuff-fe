import requestObj from './config/request';
import generateTimestamp from './lib/timestamp';
import lib from '@/lib';

function createLabel (label, boardId) {
  return requestObj.post(
    '/label/createLabel',
    {
      label: {
        ...label,
        createdAt: generateTimestamp(),
        updatedAt: generateTimestamp()
      },
      boardId
    }
  );
}

function updateLabel (label) {
  return requestObj.post(
    '/label/updateLabel',
    {
      label: {
        ...label,
        updatedAt: generateTimestamp(),
        createdAt: lib.dateToString(label.createdAt)
      }
    }
  );
}

function deleteLabel (id: number) {
  return requestObj.post(
    '/label/deleteLabel',
    {
      id
    }
  );
}

function queryLabel (boardId: number) {
  return requestObj.post(
    '/label/queryLabel',
    {
      boardId
    }
  );
}

export default {
  updateLabel,
  createLabel,
  queryLabel,
  deleteLabel
};
