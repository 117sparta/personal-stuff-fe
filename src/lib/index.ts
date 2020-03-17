function dateToString (timestamp: number) {
  const dateObj = new Date(timestamp);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const date = dateObj.getDate();
  const hour = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const seconds = dateObj.getSeconds();
  return `${year}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date} ${hour > 9 ? hour : '0' + hour}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
}

function dateStrToTimestamp (dateStr: string) {
  return Date.parse(dateStr);
}

export default {
  dateToString,
  dateStrToTimestamp
};
