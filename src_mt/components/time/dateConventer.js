const dateConverter = (date) => {
  //if time is given in date time format
  // console.warn(date)
  if (date.includes("T")) {
      let dt = date.split("T")
      date = dt[0];
      date = date.split('-')
      return (`${date[2]}-${date[1]}-${date[0]}`) // return adjusted time or original string  );
  }
  else
    return date 
}

export default dateConverter;