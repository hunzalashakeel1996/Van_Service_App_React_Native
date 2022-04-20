
export default Validators = {
  //functions of validators
  required: (errorMessage) => {
    return { name: "required", error: errorMessage }
  },
  email: (errorMessage) => {
    return { name: "email", error: errorMessage }
  },
  minLength: (errorMessage, minLength) => {
    return { name: "minLength", error: errorMessage, minLength }
  },
  compareValues: (errorMessage, value2) => {
    return { name: "compareValues", error: errorMessage, value2 }
  },

  //validations of controls
  validation: (keys, controls) => {

    return new Promise((resolve, reject) => {
      let tempControls = { ...controls };
      let tempKeys = [...keys];

      // console.warn("key", keys)
      keys.map((key, index) => {
        let validateResult;
        // console.warn("key", key)
        // console.warn("tempControls[key]", tempControls[key])
        // tempControls[key].error = !tempControls[key].valid ? errReqText[key] : null;
        validateResult = validate(tempControls[key].value, tempControls[key].validationRules);
        tempControls[key].valid = validateResult.isValid;
        tempControls[key].error = validateResult.error;
        tempKeys[index] = validateResult.isValid;

      })

      let formValid = !tempKeys.includes(false) ? true : false
      resolve({ formValid, controls: tempControls });
    })
  }
}

// method to check all validations on a particular field, value is value of that field and rules are all the rules on that field
const validate = (value, rules) => {
  let isValid = true;
  let result = {};
  //loop through all rules to check if they are valid or not if any rule is not valid return false overall
  for (let rule of rules) {
    switch (rule.name) {
      case 'required':
        isValid = isRequired(value);
        break;
      case 'email':
        isValid = emailValidator(value);
        break;
      case 'minLength':
        isValid = minLengthValidator(value, rule.minLength);
        break;
      case 'compareValues':
        isValid = compareValues(value, rule.value2);
        break;
      // case 'isNumber':
      //   isValid = isValid && numberValidator(value)
      //   break;
      // case 'isNIC':
      //   isValid = isValid && NICValidator(value);
      //   break;
      // case 'isNumberDifference':
      //   isValid = isValid && emergencyNumber(value, number);
      //   break;
      default:
        isValid = false
    }

    result.error = isValid ? null : rule.error;
    result.isValid = isValid
    if (!isValid) {
      break;
    }
  }
  return result;
}

const emailValidator = (val) => {
  return (val === "") ? true : /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val)
    || /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/.test(val);
}

const minLengthValidator = (val, minLength) => {
  return val.length >= minLength;
}

const numberValidator = (val) => {
  return /03[0-9]{2}([0-9])(?!\1{6})[0-9]{6}/.test(val)
}

const NICValidator = (val) => {
  return /[0-9]{5}-[0-9]{7}-[0-9]{1}/.test(val)
}

const emergencyNumber = (emergencyNumber, number) => {
  return number !== emergencyNumber
}

const compareValues = (val1, val2) => {
  // console.log(val1+ "+++++++++====" + val2)
  return val1 != val2;
}

const isRequired = (val) => {
  return typeof val == 'string' ? (val !== "") : true;
}