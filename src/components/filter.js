import AbstractComponent from './abstract-component.js';
import {swapActiveElements} from '../utils/common.js';
import {createMarkup} from '../utils/data-process.js';
import {FilterType} from '../utils/const.js';

const ACTIVE_FILTER_CLASS = `main-navigation__item--active`;

const createFilterItemMarkup = function (filters, isChecked = false) {
  const {name, id, count = 0} = filters;

  return (
    `<a href="#${id}"
      class="main-navigation__item${isChecked ? ` ${ACTIVE_FILTER_CLASS}` : ``}">
      ${name}
      ${count !== null ? ` <span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const activeFilters = filters.map((it, i) => it.checked ? i : -1);
  const filterItemsMarkup = createMarkup(filters, createFilterItemMarkup, ...activeFilters);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
        ${filterItemsMarkup}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

const getFilterType = (element) => Object.values(FilterType)
  .find((filterType) => element.textContent.indexOf(filterType) !== -1);

export default class FilterComponent extends AbstractComponent {
  constructor(filters) {
    super();

    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelector(`.main-navigation__items`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `A`) {
          return;
        }
        evt.preventDefault();

        const filterType = getFilterType(evt.target);
        swapActiveElements(this.getElement(), evt.target, ACTIVE_FILTER_CLASS);
        handler(filterType);
      });
  }
}
