import AbstractComponent from './abstract-component.js';
import {Regular} from '../utils/common.js';
import {createMarkup, setId, setActiveItems, getDuration} from '../utils/data-process.js';

const MAX_DESCRIPTION_LENGTH = 140;

const INFO_FIELDS_LIST = [
  `year`,
  `duration`,
  `genre`];

const CONTROL_BUTTONS_LIST = [
  {name: `Add to watchlist`},
  {name: `Mark as watched`},
  {name: `Mark as favorite`, id: `favorite`}];

const generateInfoFields = (infoFieldsData) => INFO_FIELDS_LIST.map((it, i) => ({
  name: it,
  value: infoFieldsData[i],
}));

const renderInfoFieldMarkup = (infoField) => {
  const {name, value} = infoField;
  return !value ? `` : (
    `<span class="film-card__${name}">${value}</span>`
  );
};

const renderControlButtonMarkup = (button, isActive = false) => {
  const {name, id} = button;
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${id || setId(name)}
      ${isActive ? ` film-card__controls-item--active` : ``}">
      ${name}
    </button>`
  );
};

const getDescription = (string) => string.length > MAX_DESCRIPTION_LENGTH
  ? string.replace(string.slice(MAX_DESCRIPTION_LENGTH), Regular.ELLIPSIS)
  : string;

const getYear = (iso) => new Date(Date.parse(iso)).getFullYear();

const parseFilmCardData = (card) => {
  const info = card[`film_info`];
  const year = getYear(info[`release`][`date`]);
  const duration = getDuration(info[`runtime`]);
  const genre = info[`genre`][0];
  const watchlistButtonStatus = card[`user_details`][`watchlist`];
  const watchedButtonStatus = card[`user_details`][`already_watched`];
  const favoriteButtonStatus = card[`user_details`][`favorite`];
  const activeButtons = setActiveItems([watchlistButtonStatus, watchedButtonStatus, favoriteButtonStatus]);
  const infoFields = generateInfoFields([year, duration, genre]);

  return {
    title: info[`title`],
    poster: info[`poster`],
    rating: info[`total_rating`],
    description: getDescription(info[`description`]),
    commentsCount: card[`comments`].length,
    buttonsMarkup: createMarkup(CONTROL_BUTTONS_LIST, renderControlButtonMarkup, ...activeButtons),
    infoFieldsMarkup: createMarkup(infoFields, renderInfoFieldMarkup),
  };
};

const createCardTemplate = (card) => {

  const {
    title,
    poster,
    rating,
    description,
    commentsCount,
    infoFieldsMarkup,
    buttonsMarkup
  } = parseFilmCardData(card);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        ${infoFieldsMarkup}
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        ${buttonsMarkup}
      </form>
    </article>`
  );
};

export default class CardComponent extends AbstractComponent {
  constructor(card) {
    super();

    this._card = card;
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  onPopupOpenersClick(handler) {
    const cardListeningElements = [
      this.getElement().querySelector(`.film-card__title`),
      this.getElement().querySelector(`.film-card__poster`),
      this.getElement().querySelector(`.film-card__comments`)];

    cardListeningElements.forEach((element) => element.addEventListener(`click`, handler));
    this._popupOpenersClickHandler = handler;
  }

  onAddToWatchlistButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }

  onMarkAsWatchedButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }

  onMarkAsFavoriteButtonClick(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }
}
