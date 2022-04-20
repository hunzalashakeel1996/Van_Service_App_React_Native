const sanitize = require('mongo-sanitize');

const versionID = {
  '0.1': ['dkalfjdklaj',
    'dklajfkds',
    'dklaj'],
  '0.2': ['sandwich', 'burger', 'jelly'],
};
const invalidQueryResponse = function(message) {
  let responseMessage = message;
  if (typeof message != 'string') {
    if (typeof message == 'object' && message) {
      responseMessage = 'Error: ' + message.message;
    } else if (message && message.name) {
      responseMessage = 'Server Error: ' + message.name;
    } else {
      responseMessage = 'Server Error';
    }
  }

  return {
    status: {
      code: 1004,
      title: 'Invalid Operation',
      message: responseMessage,
    },
  };
};


const checkMemberType = function(permissionLevel) { // used for room data handler
  const memberType = memberPermissionLevel[permissionLevel];

  return memberType;
};


const calculateScore = function(friendId, documents) {
  let friendCallTotal = 0.0; // v
  let friendTimeTotal = 0.0; // w
  const friendsCallData = {}; // to help access documents data using friendId as key
  const friendsTimeData = {}; // to help access documents data using friendId as key

  let callTotal = 0.0; // x
  let timeTotal = 0.0; // y


  let callRatio = 0.0; // a
  var timeRatio = 0.0; // b

  let score = 0.0; // c

  //   a = v/x
  //   b = w/y

  //   c = ((a + b)/2)* 100

  // to get total calls
  for (var i = 0; i < documents.length; i++) {
    callTotal += documents[i].callLogs.length;
  }

  // to get total friends calls
  for (var i = 0; i < documents.length; i++) {
    friendsCallData[documents[i].friendId] = documents[i].callLogs.length;
    // console.log(documents[i].callLogs);
  }

  friendCallTotal = friendsCallData[friendId];
  // console.log(friendsCallData[friendId]);

  console.log('total number of calls between me and friend: ', friendCallTotal);

  console.log('this is the total # of calls: ', callTotal);

  callRatio = friendCallTotal/callTotal;
  console.log('call ratio: ', callRatio);


  const durationCollection = [];

  for (var i = 0; i < documents.length; i++) {
    durationCollection.push([]);
    for (var j = 0; j < documents[i].callLogs.length; j++) {
      durationCollection[i].push(documents[i].callLogs[j].callDuration);
      friendsTimeData[documents[i].friendId] = durationCollection[i];
    }
  }
  console.log('friends call time collection: ', friendsTimeData[friendId]);

  console.log('durationCollection array', durationCollection);

  for (var i = 0; i < friendsTimeData[friendId].length; i++) {
    if (!friendsTimeData[friendId][i]) {
      continue;
    }
    friendTimeTotal += friendsTimeData[friendId][i];
  }

  console.log('total time call for friend: ', friendTimeTotal);

  for (var i = 0; i < durationCollection.length; i++) {
    for (var j = 0; j < durationCollection[i].length; j++) {
      if (!durationCollection[i][j]) {
        continue;
      }
      // console.log('current value of duration: ', durationCollection[i][j]);
      timeTotal += durationCollection[i][j];
    }
  }

  console.log('total time: ', timeTotal);

  timeRatio = friendTimeTotal/timeTotal;

  var timeRatio = friendTimeTotal/timeTotal;

  score = (( timeRatio + callRatio ) /2 ) * 100;

  return score;
};


const validQueryResponse = function(message, user) {
  let responseMessage = message;
  if (typeof message == 'object' && message) {
    responseMessage = message.message;
  }
  if (typeof message != 'string' && typeof message != 'object' && message) {
    responseMessage = 'Unknown: ' + message.name;
  }

  return {
    status: {
      code: 200,
      title: 'success',
      message: responseMessage,
    },
    user: user,
  };
};


const validateUserInfo = function(inputDict) {
  if (!inputDict) {
    return [false, 'Missing input values'];
  }

  requestLength = Object.keys(inputDict).length;
  if (requestLength < 1 || inputDict.username == undefined) {
    return [false, 'Missing username'];
  }
  const username = sanitize(inputDict.username);
  const format = /[ !@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]/;
  const boolSymbol = format.test(username);

  if (boolSymbol == true) {
    return [false, 'Invalid character'];
  } else if (username.length < 4 || username.length > 15) {
    return [false, 'Invalid length. Username must be between 4 to 15 characters'];
  } else {
    return [true, 'Perfect'];
  }
};

const validateUserPassword = function(password) {
  if (/ \s/g.test(password) || password == undefined) {
    return [false, 'Invalid Password'];
  } else {
    return [true, 'Valid Password'];
  }
};


const validateUserName = function(requestBody) { // used for isAavailable
  if (!requestBody.username) {
    return [false, 'Missing username'];
  }

  const username = sanitize(requestBody.username);
  const format = /[ !@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]/;
  const boolSymbol = format.test(username);

  if (boolSymbol == true) {
    return [false, 'Invalid character'];
  } else if (username.length < 4 || username.length > 15) {
    return [false, 'Invalid length. Username must be between 4 to 15 characters'];
  } else {
    return [true, 'Valid input'];
  }
};

const validateName = function(name) {
  if (!name) {
    return [false, 'Missing input values'];
  }

  const format = /[ !@#$%^&*()+\-=\[\]{};':"\\|,<>\/?]/;
  const boolSymbol = format.test(name);

  if (name == '' || name == null) {
    return [false, 'Missing username'];
  } else if (boolSymbol == true) {
    return [false, 'Invalid character'];
  } else if (name.length < 2) {
    return [false, 'Invalid length. Username must be between 4 to 15 characters'];
  } else {
    return [true, 'Valid input'];
  }
};

const isStringEmpty = function(givenString) {
  if (givenString == undefined) {
    return [false, 'Missing input values'];
  }

  const inValid = /\s/g;
  let filteredString = '';
  if (inValid.test(givenString)) {
    filteredString = givenString.replace(inValid, '');
  } else {
    filteredString = givenString;
  }

  return filteredString.length == 0;
};

const filterArray = function(givenArray) {
  const filteredArray = [];
  for (let i = 0; i < givenArray.length; i++) {
    if (givenArray[i] != null && givenArray[i] != '' && !isStringEmpty(givenArray[i])) {
      filteredArray.push(givenArray[i]);
    }
  }
  return filteredArray;
};

const validContentResponse = function(responseType, response) {
  let keyOfType;
  switch (responseType) {
    case 0:
      responseType = ResponseType.CONTENT;
      keyOfType = 'content';
      break;
    case 1:
      responseType = ResponseType.ADDED_CONTENT;
      keyOfType = 'addedContent';
      break;
    case 2:
      responseType = ResponseType.REMOVED_CONTENT;
      keyOfType = 'removedContent';
      break;
    case 3:
      responseType = ResponseType.CONTENTS;
      keyOfType = 'contents';
      break;
    case 4:
      responseType = ResponseType.STATUS;
      keyOfType = 'status';
      break;
  }
  return {'type': responseType, 'typeKey': keyOfType, [keyOfType]: response};
};

const loginMethod = function(requestBody) {
  requestLength = Object.keys(requestBody).length;
  if (requestLength <= 1 || requestBody.password == undefined) {
    return null;
  } else if (requestBody.username != undefined) {
    const username = sanitize(requestBody.username);
    return {'username': username};
  } else if (requestBody.email != undefined) {
    const email = sanitize(requestBody.email);
    return {'email.value': email};
  } else if (requestBody.phone.number != undefined && requestBody.phone.isoCountryCode != undefined ) {
    const phoneNumber = Number(sanitize(requestBody.phone.number));
    const isoCountryCode = sanitize(requestBody.phone.isoCountryCode);
    return {'phone.number': phoneNumber, 'phone.isoCountryCode': isoCountryCode};
  } else {
    return null;
  }
};
const requestMethod = function(request) {
  requestLength = Object.keys(request).length;
  if (requestLength < 2) {
    return null;
  } else if (request.username != undefined) {
    const username = sanitize(request.username);
    return username;
  } else if (request.email != undefined) {
    const email = sanitize(request.email);
    return email;
  } else if (request.number != undefined) {
    const phoneNumber = sanitize(request.number);
    return phoneNumber;
  } else {
    return null;
  }
};

const versionIdVerify = function(req) {
  const version = req.headers['x-hmu-api-version'];
  const id = req.headers['x-hmu-api-id'];
  const inavlidResponse = {
    'status': {
      'code': 1101,
      'title': 'Invalid Operation',
      'message': 'Invalid API Key',
    },
  };

  if (!versionID[version]) {
    return inavlidResponse;
  }

  if (versionID[version].includes(id)) {
    return null;
  } else {
    return inavlidResponse;
  }
};

// assumes start and end are assigned values Date.now()
const getDuration = function(start, end) {
  const duration = end - start / 60;
  return duration;
};

const friendStatus = {
  FRIEND: 0,
  PENDING_FRIEND: 1,
  PENDING_REQUEST: 2,
  NOT_FRIEND: 3,
  MY_PROFILE: 4,
};

const ResponseType = {
  CONTENT: 0,
  ADDED_CONTENT: 1,
  REMOVED_CONTENT: 2,
  CONTENTS: 3,
  STATUS: 4,
};

const memberPermissionLevel = {
  Owner: 0, // Owner can do all functions
  Moderator: 1, // Moderator can do everything BUT deleting the room
  tempModerator: 2, // tempModerator everything related to contenty
  Member: 3, // Memeber can just accept invite and leave room
};

module.exports = {
  versionID,
  validateUserInfo: validateUserInfo,
  validateUserPassword: validateUserPassword,
  validateUserName: validateUserName,
  validateName: validateName,
  versionIdVerify: versionIdVerify,
  isStringEmpty: isStringEmpty,
  filterArray: filterArray,
  loginMethod: loginMethod,
  requestMethod: requestMethod,
  invalidQueryResponse: invalidQueryResponse,
  validQueryResponse: validQueryResponse,
  validContentResponse: validContentResponse,
  getDuration: getDuration,
  calculateScore: calculateScore,
  checkMemberType: checkMemberType,
  friendStatus: friendStatus,
  ResponseType: ResponseType,
  memberPermissionLevel: memberPermissionLevel,
};
