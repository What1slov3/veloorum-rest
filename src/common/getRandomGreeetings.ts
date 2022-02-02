const greetings = [
  ':username: с нами. Поприветствуем его!',
  'Хэй, :username:, устраивайся поудобнее!',
  'Добро пожаловать, :username:!',
  ':username:, почему так долго? Мы тебя заждались!',
  ':username: тебе здесь рады',
  'Кажется :username: зашел к нам без стука',
  'Все внимание :channel_name: сосредоточено на :username:',
  ':username: just spawned',
  ':username: решил посетить нас',
];

export const getRandomGreetings = () => {
  return greetings[(Math.random() * greetings.length) >> 0];
};
