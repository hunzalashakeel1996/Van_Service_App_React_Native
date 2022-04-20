import timeConverter from './timeConverter';

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + ((h) * 60 * 60 * 1000));
  return this;
}

// convert date time from utc into local timezone
export const convertDatetime = (datetime) => {
  var mydatetime = new Date(datetime);
  var currDatetime = new Date(new Date().toUTCString());

  //get hours according to timezone and add it to UTC time
  var MydatetimeTimezoneOffset = (- (mydatetime.getTimezoneOffset() / 60));
  var currentTimeZoneOffset = (- (currDatetime.getTimezoneOffset() / 60));

  mydatetime = mydatetime.addHours(MydatetimeTimezoneOffset);
  currDatetime = currDatetime.addHours(currentTimeZoneOffset);

  var diff = ((currDatetime.getTime() - mydatetime.getTime()) / 1000),
    hour_diff = Math.floor(diff / 3600),
    day_diff = Math.floor(diff / 86400);

  return {
    datetime: mydatetime,
    currDatetime,
    diff,
    hour_diff,
    day_diff
  }
}

// convert date time from utc into local timezone
export const calcTimeDiffInMins = (datetime) => {
  var mydatetime = new Date(datetime);
  var currDatetime = new Date(new Date().toUTCString());

  //get hours according to timezone and add it to UTC time
  var MydatetimeTimezoneOffset = (- (mydatetime.getTimezoneOffset() / 60));
  var currentTimeZoneOffset = (- (currDatetime.getTimezoneOffset() / 60));

  mydatetime = mydatetime.addHours(MydatetimeTimezoneOffset);
  currDatetime = currDatetime.addHours(currentTimeZoneOffset);

  var diff = (-(currDatetime.getTime() - mydatetime.getTime()) / 1000),
    min_diff = Math.floor(diff / 60);
    // day_diff = Math.floor(diff / 86400);

  return min_diff
  
}

//calculate time in hours from two different time given
export const calcTimeDifference = (toDatetime, fromDatetime) => {
  var to_datetime = new Date(toDatetime);
  var from_datetime = new Date(fromDatetime);

  //get hours according to timezone and add it to UTC time
  var MydatetimeTimezoneOffset = (- (to_datetime.getTimezoneOffset() / 60));
  var currentTimeZoneOffset = (- (from_datetime.getTimezoneOffset() / 60));

  to_datetime = to_datetime.addHours(MydatetimeTimezoneOffset);
  from_datetime = from_datetime.addHours(currentTimeZoneOffset);

  var diff = ((from_datetime.getTime() - to_datetime.getTime()) / 1000),
    hour_diff = Math.floor(diff / 3600);
    
  // console.log(hour_diff)
  return hour_diff
}

// calculate time difference and return in fb like format(just now, 1 min ago, etc)
export const formatDatetimeAgo = (datetime) => {
  const convertedDatetime = convertDatetime(datetime);
  
  var hours = convertedDatetime.datetime.getUTCHours(),
    mins = convertedDatetime.datetime.getUTCMinutes();

  let diff = convertedDatetime.diff,
    day_diff = convertedDatetime.day_diff;
    
  let result;
  if (day_diff == 0) {

    result = (
      diff < 60 && "Just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor(diff / 3600) + " hours ago"
    )
  } else if (day_diff == 1) {
    result = `Yesterday at ${timeConverter(`${hours == 1 ? '0' + hours : hours}:${mins == 1 ? '0' + mins : mins}:00`)}`;
  }
  //  else if (day_diff < 7) {
  //   result = day_diff + " days ago";
  // } else if (day_diff < 31) {
  //   result = Math.ceil(day_diff / 7) + " weeks ago";
  // }
  else {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var y = convertedDatetime.datetime.getUTCFullYear();
    var mon = convertedDatetime.datetime.getUTCMonth();
    var d = convertedDatetime.datetime.getUTCDate();

    result = day_diff < 0 ? "" : `${months[mon]} ${d}, ${y} at ${timeConverter(`${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}:00`)}`
  }

  return result;

}

// return formated date, time and both
export const formatDatetime = (datetime) => {
  const convertedDatetime = convertDatetime(datetime);

  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var y = convertedDatetime.datetime.getUTCFullYear(),
    mon = convertedDatetime.datetime.getUTCMonth(),
    d = convertedDatetime.datetime.getUTCDate(),
    hours = convertedDatetime.datetime.getUTCHours(),
    mins = convertedDatetime.datetime.getUTCMinutes();

  return {
    date: `${months[mon]} ${d}, ${y}`,
    time: `${timeConverter(`${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}:00`)}`,
    datetime: `${months[mon]} ${d}, ${y} at ${timeConverter(`${hours < 10 ? '0' + hours : hours}:${mins < 10 ? '0' + mins : mins}:00`)}`,
  };
}

const datetimeConventer = {
  formatDatetime,
  formatDatetimeAgo,
  convertDatetime,

}

export default datetimeConventer;