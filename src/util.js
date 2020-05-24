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
  ELLIPSIS: `...`,
  DASH: `-`,
  NUMBERS: /\d+/g,
  EXCEPT_NUMBERS: /(\D+)*[^.\d]/g,
  FIRST_NUMBER: /\d+/,
  EMPTY_SPACE: /\s+/g,
  EMPTY_SPACE_IN_EDGES: /^\s+|\s+(?!.)/g,
};

export const RenderPosition = {
  BEFOREBEGIN: `beforebegin`,
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`,
};

export const render = (container, element, place = RenderPosition.BEFOREEND) => {
  switch (place) {
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;

    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;

    case RenderPosition.BEFOREEND:
      container.append(element);
      break;

    case RenderPosition.AFTEREND:
      container.after(element);
      break;
  }
};

export const removeElement = (selector) => {
  const element = document.querySelector(selector);
  if (element) {
    element.remove();
  }
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

export const createMarkup = (array, renderer, ...activeItems) => array
  .map((it, i) => renderer(it, activeItems.some((item) => item === i)))
  .join(`\n`);

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild || ``;
};

export const isEscEvent = (evt, action) => {
  if (evt.key === Key.ESC) {
    action();
  }
};
