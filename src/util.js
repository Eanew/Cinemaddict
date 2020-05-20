export const SPACE = ` `;

export const Key = {
  SPACE,
  ESC: `Escape`,
  ENTER: `Enter`,
};

export const Regular = {
  SPACE,
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

export const generateRandomActiveItems = (array) => {
  const items = [];
  const cycleCount = Math.floor(Math.random() * (array.length + 1));
  for (let i = 0; i < cycleCount; i++) {
    items.push(Math.floor(Math.random() * array.length));
  }
  return items;
};

export const mergeData = (staticData, variableData) => staticData.map((it, i) => Object.assign(it, variableData[i]));

export const createMarkup = (array, render, ...activeItems) => array
  .map((it, i) => render(it, activeItems.some((item) => item === i)))
  .join(`\n`);

export const isEscEvent = (evt, action) => {
  if (evt.key === Key.ESC) {
    action();
  }
};
