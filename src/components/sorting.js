import {createMarkup, createElement} from '../util.js';

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

const createSortingTemplate = () => {
  const sortItemsMarkup = createMarkup(sortFieldsList, createSortingItemMarkup, 0);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};

export default class Sorting {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortingTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
