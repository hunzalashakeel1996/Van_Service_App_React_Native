export const isNewChk = (date) => {
    return Math.abs(new Date(new Date().toUTCString()) - new Date(date)) / 36e5 <= 24 ? true : false;
}

export const isActiveChk = (date) => {
    return (new Date(date) - new Date(new Date().toUTCString())) / 36e5 > 0 ? true : false;
}
