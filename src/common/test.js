export function createUserTag() {
  let result = '';

  for (let i = 0; i < 4; i++) {
    result += Math.round(Math.random() * 9);
  }

  return result;
}

for (let i = 0; i < 100; i++) {
  console.log(createUserTag());
}