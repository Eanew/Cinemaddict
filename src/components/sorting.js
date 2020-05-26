import AbstractComponent from './abstract-component.js';
import {swapActiveElements} from '../utils/common.js';
import {createMarkup, matchActiveItems} from '../utils/data-process.js';

const ACTIVE_BUTTON_CLASS = `sort__button--active`;

const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RAITING: `raiting`,
};

const sortTypesList = [
  SortType.DEFAULT,
  SortType.DATE,
  SortType.RAITING];

const createSortingItemMarkup = function (type, isActive = false) {
  return (
    `<li>
      <a href="#" data-sort-type="${type}" class="sort__button${isActive ? ` ${ACTIVE_BUTTON_CLASS}` : ``}">
        Sort by ${type}
      </a>
    </li>`
  );
};

const createSortingTemplate = (currentSortType) => {
  const activeElements = matchActiveItems(currentSortType, sortTypesList);
  const sortItemsMarkup = createMarkup(sortTypesList, createSortingItemMarkup, ...activeElements);

  return (
    `<ul class="sort">
      ${sortItemsMarkup}
    </ul>`
  );
};

export default class SortingComponent extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortingTemplate(this._currentSortType);
  }

  getSortType() {
    return this._currentSortType;
  }

  onSortTypeChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      swapActiveElements(this.getElement(), evt.target, ACTIVE_BUTTON_CLASS);
      handler(this._currentSortType);
    });
  }
}

export {SortType};
