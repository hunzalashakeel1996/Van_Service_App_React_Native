import moment from "moment";

const momentDate = (date) => {
    var ends = moment(new Date()),
        starts = moment(date);

    var years = ends.diff(starts, "year");
    starts.add(years, "years");

    var months = ends.diff(starts, "months");
    starts.add(months, "months");

    var days = ends.diff(starts, "days");

    return (years > 0 ? `${years}y ` : "") + (months > 0 ? `${months}m ` : "") + (days > 0 ? `${days}d ` : "today");
}

export default momentDate;