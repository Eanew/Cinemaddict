import * as util from '../util.js';

const MAX_DESCRIPTION_LENGTH = 140;
const DEFAULT_FILM_CARDS_DISPLAY_COUNT = 5;

const getDescription = (string) => string.length > MAX_DESCRIPTION_LENGTH
  ? string.replace(string.slice(MAX_DESCRIPTION_LENGTH), `...`)
  : string;

const getYear = (iso) => new Date(Date.parse(iso)).getFullYear();

const infoFieldsList = [
  `year`,
  `duration`,
  `genre`];

const generateInfoFields = (infoFieldsData) => infoFieldsList.map((it, i) => ({
  name: it,
  value: infoFieldsData[i],
}));

const renderInfoFieldMarkup = ({name, value}) => {
  return (
    `<span class="film-card__${name}">${value}</span>`
  );
};

const controlButtonsList = [
  {name: `Add to watchlist`},
  {name: `Mark as watched`},
  {name: `Mark as favorite`, id: `favorite`}];

const renderControlButtonMarkup = ({name, id}, isActive = false) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${id || util.setId(name)}
      ${isActive ? ` film-card__controls-item--active` : ``}">
      ${name}
    </button>`
  );
};

const FilmCard = function (data) {
  const info = data[`film_info`];
  this.title = info[`title`];
  this.poster = info[`poster`];
  this.raiting = info[`total_raiting`];
  this.description = getDescription(info[`description`]);
  this.commentsCount = data[`comments`].length;

  const year = getYear(info[`release`][`date`]);
  const duration = util.getDuration(info[`runtime`]);
  const genre = info[`genre`][0];
  const infoFields = generateInfoFields([year, duration, genre]);
  this.infoFieldsMarkup = util.createMarkup(infoFields, renderInfoFieldMarkup);

  const watchlistButtonStatus = data[`user_details`][`watchlist`];
  const watchedButtonStatus = data[`user_details`][`already_watched`];
  const favoriteButtonStatus = data[`user_details`][`favorite`];
  const activeButtons = util.setActiveButtons([watchlistButtonStatus, watchedButtonStatus, favoriteButtonStatus]);
  this.buttonsMarkup = util.createMarkup(controlButtonsList, renderControlButtonMarkup, ...activeButtons);
};

const renderFilmCard = (data) => {

  const {
    title,
    poster,
    raiting,
    description,
    commentsCount,
    infoFieldsMarkup,
    buttonsMarkup
  } = new FilmCard(data);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${raiting}</p>
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

export const createFilmListTemplate = (cardsData) => {
  const filmCards = util.createMarkup(cardsData.slice(0, DEFAULT_FILM_CARDS_DISPLAY_COUNT), renderFilmCard);

  return (
    `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container">
        ${filmCards}
      </div>
      <button class="films-list__show-more">Show more</button>
    </section>`
  );
};
