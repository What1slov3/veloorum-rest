const bye = [
  ':username: покинул :channel_name:',
  ':username: выпал из мира',
  ':username: решил, что ему не место здесь',
  ':username: press F',
  ':username: больше не участник нашего сообщества',
  ':username: незаметно испарился',
  'Кто нибудь видел где :username:?',
];

export const getRandomBye = () => {
  return bye[(Math.random() * bye.length) >> 0];
};
