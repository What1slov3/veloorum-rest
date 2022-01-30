const generateRandomString = (length: number) => {
  let dict = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += dict[(Math.random() * dict.length) >> 0];
  }

  return result
};

export default generateRandomString;
