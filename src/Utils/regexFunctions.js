export const ValidateEmail = (value) => {
  var mailformat = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (mailformat.test(value)) {
    return "Valid Email";
  } else {
    return "Invalid Email";
  }
};

export const validatePhoneNumber = (phoneNumber) => {
  // Regular expressions for phone number formats
  const usRegex = /^[2-9]{1}[0-9]{9}$/;
  const ukRegex = /^(\+44|0)7\d{9}$/;
  // const pakistanRegex = /^92[0-9]{9}$/;
  const pakistanRegex = /^92\d{0,10}$/;

  // const pakistanRegex = /^92\d{0,10}$/;
  const uaeRegex = /^(?:\+971|00971|0)?(?:50|51|52|55|56|58)\d{7}$/;

  // Validate phone number based on country
  // if (usRegex.test(phoneNumber)) {
  //   return true;
  // } else if (ukRegex.test(phoneNumber)) {
  //   return true;
  // } else if (pakistanRegex.test(phoneNumber)) {
  //   return true;
  // } else if (uaeRegex.test(phoneNumber)) {
  //   return true;
  // } else {
  //   return false;
  // }
  if (phoneNumber.length < 12) {
    return false;
  } else if (pakistanRegex.test(phoneNumber)) {
    // setIsValid(true);
    return true;
  } else {
    return false;
    // setIsValid(false);
  }
};
