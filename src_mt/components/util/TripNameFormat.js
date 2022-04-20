// takes destination name and format to first 20 characters then omit last uncompleted word

const TripNameFormat = (value) => {
    return value.replace(/.{10}\S*\s+/g, "$&@").split(/\s+@/)[0] + " Trip"
};


export default TripNameFormat;