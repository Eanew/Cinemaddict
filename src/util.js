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

export const setId = (name) => {
  return name.toLowerCase()
    .replace(Regular.EMPTY_SPACE_IN_EDGES, ``)
    .replace(Regular.EMPTY_SPACE, Regular.DASH);
};

export const getKeys = (object) => {
  const keys = [];
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      keys.push(object[key]);
    }
  }
  return keys;
};

export const createMarkup = (array, render) => array.map((it) => render(...getKeys(it))).join(`\n`);

export const isEscEvent = (evt, action) => {
  if (evt.key === Key.ESC) {
    action();
  }
};
