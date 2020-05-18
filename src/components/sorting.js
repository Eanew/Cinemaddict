import {createMarkup} from '../util.js';

const createSortingItemMarkup = function (isActive = false, name) {
  return (
    `<li>
      <a href="#" class="sort__button${isActive ? ` sort__button--active` : ``}">Sort by ${name}</a>
    </li>`
  );
};

export const createSortingTemplate = (itemsData) => {
  const sortItemsMarkup = createMarkup(itemsData, createSortingItemMarkup, 0);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};
