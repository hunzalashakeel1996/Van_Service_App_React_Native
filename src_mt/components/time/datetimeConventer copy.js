import timeConverter from './timeConverter';

Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + ((h) * 60 * 60 * 1000));
  return this;
}
//isFormat is true to show direct format like Jan 21, 2020 at 02:30 AM
const datetimeConventer = (datetime, isFormat = false) => {
  var mydatetime = new Date(datetime);
  var currDatetime = new Date(new Date().toUTCString());

  //get hours according to timezone and add it to UTC time
  var MydatetimeTimezoneOffset = (- (mydatetime.getTimezoneOffset() / 60));
  var currentTimeZoneOffset = (- (currDatetime.getTimezoneOffset() / 60));

  mydatetime = mydatetime.addHours(MydatetimeTimezoneOffset);
  currDatetime = currDatetime.addHours(currentTimeZoneOffset)

  var diff = ((currDatetime.getTime() - mydatetime.getTime()) / 1000),
    day_diff = Math.floor(diff / 86400),
    hours = mydatetime.getUTCHours(),
    mins = mydatetime.getUTCMinutes();

  let result;
  // console.warn(diff, day_diff)
  if (day_diff == 0 && isFormat == false) {

    result = (
      diff < 60 && "Just now" ||
      diff < 120 && "1 minute ago" ||
      diff < 3600 && Math.floor(diff / 60) + " minutes ago" ||
      diff < 7200 && "1 hour ago" ||
      diff < 86400 && Math.floor(diff / 3600) + " hours ago"
    )
  } else if (day_diff == 1 && isFormat == false) {
    result = `Yesterday at ${timeConverter(`${hours == 1 ? '0' + hours : hours}:${mins}:00`)}`;
  }
  //  else if (day_diff < 7) {
  //   result = day_diff + " days ago";
  // } else if (day_diff < 31) {
  //   result = Math.ceil(day_diff / 7) + " weeks ago";
  // }
  else {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var y = mydatetime.getUTCFullYear();
    var mon = mydatetime.getUTCMonth();
    var d = mydatetime.getUTCDate();

    result = day_diff < 0 ? "" : `${months[mon]} ${d}, ${y} at ${timeConverter(`${hours == 1 ? '0' + hours : hours}:${mins == 1 ? '0'+mins : mins}:00`)}`
  }

  return result;

}

export default datetimeConventer;