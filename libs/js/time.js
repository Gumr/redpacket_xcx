
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 当天开始时间
function startDate(currentDate) {
  return formatTime(currentDate) + ' ' + '00:00:00';
}

// 当天结束时间
function endDate(currentDate) {
  return formatTime(currentDate) + ' ' + '23:59:59';
}

// 一周前开始时间
function calculateDate(currentDate, count) {
  var date = currentDate;
  date.setDate(date.getDate() - (count-1));
  var year = date.getFullYear();
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);
  var hours = '00';
  var minute = '00';
  var second = '00';
  var endDate = year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
  return endDate;
}

module.exports = {
  startDate: startDate,
  endDate: endDate,
  calculateDate: calculateDate
}