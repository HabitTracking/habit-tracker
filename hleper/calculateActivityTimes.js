const moment = require('jalali-moment');
moment().locale('fa');
module.exports = (startTime, frequency, dueDate) => {
  startTime = Number(startTime);
  const activityTimes = [startTime];
  if (frequency != 0) {
    let tempTime = startTime;
    while (true) {
      let newTime = moment.unix(tempTime).add(frequency,'d').unix();
      if (newTime <= dueDate) {
        activityTimes.push(newTime);
        tempTime = newTime;
      } else break;
    }
  }

  return activityTimes;
};