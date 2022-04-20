// // method to check all validations on a particular field, value is value of that field and rules are all the rules on that field
// Validators.validate = (value, rules) => {
//   let isValid = true;
//   let result = {};
//   //loop through all rules to check if they are valid or not if any rule is not valid return false overall
//   for (let rule in rules) {
//     switch (rule) {
//       case 'isRequired':
//         isValid = isRequired(value);
//         break;
//       case 'isEmail':
//         isValid = emailValidator(value);
//         break;
//       case 'minLength':
//         isValid = minLengthValidator(value, rules[rule]);
//         break;
//       // case 'isNumber':
//       //   isValid = isValid && numberValidator(value)
//       //   break;
//       // case 'isNIC':
//       //   isValid = isValid && NICValidator(value);
//       //   break;
//       // case 'isNumberDifference':
//       //   isValid = isValid && emergencyNumber(value, number);
//       //   break;
//       default:
//         isValid = false
//     }
//     result.rule = rule;
//     result.isValid = isValid
//     if (!isValid) {
//       break;
//     }
//   }
//   return result;
// }

// Validators.emailValidator = (val) => {
//   return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
//     || /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(val);
// }

// Validators.minLengthValidator = (val, minLength) => {
//   return val.length >= minLength;
// }

// Validators.numberValidator = (val) => {
//   return /03[0-9]{2}([0-9])(?!\1{6})[0-9]{6}/.test(val)
// }

// Validators.NICValidator = (val) => {
//   return /[0-9]{5}-[0-9]{7}-[0-9]{1}/.test(val)
// }

// Validators.emergencyNumber = (emergencyNumber, number) => {
//   return number !== emergencyNumber
// }

// Validators.isRequired = (val) => {
//   return JSON.stringify(val.length) > 0
// }

// export default Validators;