
// return object from array if exists
export const isObjectExist = (array, element, value) => {
    return array.find(item => item[element] == value);
}
