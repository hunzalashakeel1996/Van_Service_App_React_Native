import haversine  from 'haversine';


export default calculateTime = (start, end) => {
  start = {latitude: start.split(',')[0], longitude: start.split(',')[1]}
  end = {latitude: end.split(',')[0], longitude: end.split(',')[1]}

  return haversine(start, end).toFixed(2);
}