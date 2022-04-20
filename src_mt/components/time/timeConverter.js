const timeConverter = (time) => {
    //if time is given in date time formatg
    if (time.includes("T")) {
        let dt = time.split("T")
        time = dt[1].slice(0, -8);
    } else {
        time = time.slice(0, -3);
    }

    // Check correct time format and split into cogmponents
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice(1);  // Remove full string match value
        time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    
    return (time.join('')) // return adjusted time or original string  );
}

export default timeConverter;