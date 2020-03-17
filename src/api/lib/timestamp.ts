export default function generateTimeStamp () {
  const now = new Date(Date.now());
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return `${year}-${month > 9 ? month : '0' + month}-${date > 9 ? date : '0' + date} ${hour > 9 ? hour : '0' + hour}:${minutes > 9 ? minutes : '0' + minutes}:${seconds > 9 ? seconds : '0' + seconds}`;
}
