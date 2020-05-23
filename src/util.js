export const HOUR_IN_MINUTES = 60;
export const SPACE = ` `;

export const Key = {
  SPACE,
  ESC: `Escape`,
  ENTER: `Enter`,
};

export const Regular = {
  SPACE,
  COMMA: `,`,
  DASH: `-`,
  NUMBERS: /\d+/g,
  EXCEPT_NUMBERS: /(\D+)*[^.\d]/g,
  FIRST_NUMBER: /\d+/,
  EMPTY_SPACE: /\s+/g,
  EMPTY_SPACE_IN_EDGES: /^\s+|\s+(?!.)/g,
};

export const getRandomCount = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export const getUniqueRandomItem = (collection) => {
  const randomCount = getRandomCount(0, collection.length - 1);
  return collection.splice(randomCount, 1)[0];
};

export const setId = (name) => {
  return name.toLowerCase()
    .replace(Regular.EMPTY_SPACE_IN_EDGES, ``)
    .replace(Regular.EMPTY_SPACE, Regular.DASH);
};

export const setActiveButtons = (buttonsList) => buttonsList.map((it, i) => it ? i : -1);

export const generateRandomActiveItems = (array) => {
  const items = [];
  const cycleCount = Math.floor(Math.random() * (array.length + 1));
  for (let i = 0; i < cycleCount; i++) {
    items.push(Math.floor(Math.random() * array.length));
  }
  return items;
};

export const getDuration = (minutesAmount, spaceBetween = false) => {
  const hours = Math.floor(minutesAmount / HOUR_IN_MINUTES)
    ? `${Math.floor(minutesAmount / HOUR_IN_MINUTES)}${spaceBetween ? ` ` : ``}h`
    : ``;

  const restOfMinutes = minutesAmount % HOUR_IN_MINUTES
    ? ` ${minutesAmount % HOUR_IN_MINUTES}${spaceBetween ? ` ` : ``}m`
    : ``;

  const minutes = hours
    ? restOfMinutes
    : `${minutesAmount}${spaceBetween ? ` ` : ``}m`;

  return hours + minutes;
};

export const createMarkup = (array, render, ...activeItems) => array
  .map((it, i) => render(it, activeItems.some((item) => item === i)))
  .join(`\n`);

export const isEscEvent = (evt, action) => {
  if (evt.key === Key.ESC) {
    action();
  }
};
