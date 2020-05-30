import {FilterType} from '../utils/const.js';
import {getCardsByFilter} from '../utils/filter.js';

export default class MoviesModel {
  constructor() {
    this._cards = [];
    this._activeFilterType = FilterType.ALL_MOVIES;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getMovies() {
    return getCardsByFilter(this._cards, this._activeFilterType);
  }

  getAllMovies() {
    return this._cards;
  }

  setMovies(cards) {
    this._cards = Array.from(cards);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateMovie(id, card) {
    const index = this._cards.findIndex((it) => it[`id`] === id);
    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));
    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
