import {Regular, HOUR_IN_MINUTES} from './common.js';

export const setId = (name) => {
  return name.toLowerCase()
    .replace(Regular.EMPTY_SPACE_IN_EDGES, ``)
    .replace(Regular.EMPTY_SPACE, Regular.DASH);
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

export const generateRandomActiveItems = (array) => {
  const items = [];
  const cycleCount = Math.floor(Math.random() * (array.length + 1));
  for (let i = 0; i < cycleCount; i++) {
    items.push(Math.floor(Math.random() * array.length));
  }
  return items;
};

export const setActiveItems = (itemsList) => itemsList.map((it, i) => it ? i : -1);

export const createMarkup = (array, renderer, ...activeItems) => array
  .map((it, i) => renderer(it, activeItems.some((item) => item === i)))
  .join(`\n`);
