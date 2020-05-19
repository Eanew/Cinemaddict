import {createMarkup} from '../util.js';

const createSortingItemMarkup = function (name, isActive = false) {
  return (
    `<li>
      <a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a>
    </li>`
  );
};

export const createSortingTemplate = () => {
  const sortNames = [
    `default`,
    `date`,
    `raiting`];

  const sortItemsMarkup = createMarkup(sortNames, createSortingItemMarkup, 0);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};
