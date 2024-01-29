const moment = require('jalali-moment');
moment().locale('fa');
module.exports = (startTime, frequency, dueDate) => {
  let hours = moment.unix(startTime).hours();
  let minutes = moment.unix(startTime).minutes();
  let startDate = moment.unix(startTime).subtract(hours,'H').unix();
  startDate = moment.unix(startDate).subtract(minutes,'m').unix();
  
  const activityDates = [startDate];
  if (frequency != 0) {
    let tempDate = startDate;
    while (true) {
      let newDate = moment.unix(tempDate).add(frequency,'d').unix();
      if (newDate <= dueDate) {
        activityDates.push(newDate);
        tempDate = newDate;
      } else break;
    }
  }

  return activityDates;
};