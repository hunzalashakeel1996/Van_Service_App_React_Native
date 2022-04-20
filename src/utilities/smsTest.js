let data = {
    msg: `Your OPT code for VanWala is 1234`,
    number: 923412419605,
  }
 
 sendSmsMessage = (data) => {
    return new Promise((resolve, reject) => {
        let userName = "923418201201",
            password = "4085",
            getSessionIdUrl = `https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=${userName}&password=${password}&response_type=2`,
            mask = "FARJAZZ PK",
            toNumbersCsv = data.number,
            messageText = data.msg;

        fetch(getSessionIdUrl)
            .then(res => {
                return res.json()
            })
            .then(resJson => {
                if (resJson.Corpsms.response === "OK") {
                    console.log(resJson.Corpsms.data);
                    let sessionKey = resJson.Corpsms.data,
                        ApiSendSmsUrl = `https://telenorcsms.com.pk:27677/corporate_sms2/api/sendsms.jsp?session_id=${sessionKey}&to=${toNumbersCsv}&text=${messageText}&mask=${mask}&response_type=2`;
                    fetch(ApiSendSmsUrl)
                        .then(res => {
                            return res.json()
                        })
                        .then(responseJson => {
                            if (responseJson.Corpsms.response === "OK") {
                                resolve(responseJson.Corpsms)
                            } else {
                                Alert.alert("Error1", `Something went wrong \n ${responseJson.Corpsms.data}`);
                            }

                        })
                } else {
                    Alert.alert("Error2", `Something went wrong \n ${resJson.Corpsms.data}`);
                }

            })
            .catch(err => {
                Alert.alert("Error3", `Something went wrong \n ${err}`);

            })
    })

}


// colors 
//    red = "#ee3d3c"
//    blue = "#143459"
//    yellow = "#fedd00"
// green = "#26b24a"