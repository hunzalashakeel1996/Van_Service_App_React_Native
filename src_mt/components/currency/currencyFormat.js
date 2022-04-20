// takes only numbers (omit decimal etc) and format currency

const currencyFormat = (value) => {
    return value ? JSON.stringify(value).replace(/[^0-9]/g, "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : 0;
};


export default currencyFormat;