import {createMarkup} from '../util.js';

const sortFieldsList = [
  `default`,
  `date`,
  `raiting`];

const createSortingItemMarkup = function (name, isActive = false) {
  return (
    `<li>
      <a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a>
    </li>`
  );
};

export const createSortingTemplate = () => {
  const sortItemsMarkup = createMarkup(sortFieldsList, createSortingItemMarkup, 0);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};
