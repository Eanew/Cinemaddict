import AbstractComponent from './abstract-component.js';
import {createMarkup, setTwoDigit, setActiveItems, getDuration} from '../utils/data-process.js';

const GENRES_FIELD_NAME = `Genres`;

const tableFieldsList = [
  `Director`,
  `Writers`,
  `Actors`,
  `Release Date`,
  `Runtime`,
  `Country`,
  GENRES_FIELD_NAME];

const controlButtonsList = [
  {
    name: `Add to watchlist`,
    id: `watchlist`,
  },
  {
    name: `Already watched`,
    id: `watched`,
  },
  {
    name: `Add to favorites`,
    id: `favorite`,
  }];

const generateTableFields = (tableValues) => tableFieldsList.map((it, i) => ({
  name: it,
  values: tableValues[i],
}));

const renderFilmDetailsRowMarkup = ({name, values}) => {
  const term = (name === GENRES_FIELD_NAME && values.length < 2)
    ? name.replace(`s`, ``)
    : name;

  const cell = (name === GENRES_FIELD_NAME)
    ? values.map((it) => `<span class="film-details__genre">${it}</span>`).join(`\n`)
    : values.join(`, `);

  return (
    `<tr class="film-details__row">
      <td class="film-details__term">${term}</td>
      <td class="film-details__cell">${cell}</td>
    </tr>`
  );
};

const renderControlFieldMarkup = ({name, id}, isChecked = false) => {
  return (
    `<input type="checkbox" class="film-details__control-input visually-hidden" id="${id}" name="${id}"
      ${isChecked ? ` checked` : ``}>
    <label for="${id}" class="film-details__control-label film-details__control-label--${id}">${name}</label>`
  );
};

const getReleaseDate = (iso) => {
  const date = new Date(Date.parse(iso));
  const month = date.toLocaleString(`en-US`, {month: `long`});
  const day = setTwoDigit(date, Date.prototype.getDate);
  return `${day} ${month} ${date.getFullYear()}`;
};

const FilmCard = function (data) {
  const info = data[`film_info`];
  this.title = info[`title`];
  this.alternativeTitle = info[`alternative_title`] || this.title;
  this.poster = info[`poster`];
  this.rating = info[`total_rating`];
  this.ageRating = info[`age_rating`];
  this.description = info[`description`];

  const tableData = [
    [info[`director`]],
    info[`writers`],
    info[`actors`],
    [getReleaseDate(info[`release`][`date`])],
    [getDuration(info[`runtime`])],
    [info[`release`][`release_country`]],
    info[`genre`]];

  const tableFields = generateTableFields(tableData);
  this.detailsTableMarkup = createMarkup(tableFields, renderFilmDetailsRowMarkup);

  const watchlistButtonStatus = data[`user_details`][`watchlist`];
  const watchedButtonStatus = data[`user_details`][`already_watched`];
  const favoriteButtonStatus = data[`user_details`][`favorite`];
  const activeButtons = setActiveItems([watchlistButtonStatus, watchedButtonStatus, favoriteButtonStatus]);
  this.detailsControlsMarkup = createMarkup(controlButtonsList, renderControlFieldMarkup, ...activeButtons);
};

export const createDetailsTemplate = (film) => {
  const {
    title,
    alternativeTitle,
    poster,
    rating,
    ageRating,
    description,
    detailsTableMarkup,
    detailsControlsMarkup,
  } = new FilmCard(film);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${ageRating}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                ${detailsTableMarkup}
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
          <section class="film-details__controls">
            ${detailsControlsMarkup}
          </section>
        </div>
        <div class="form-details__bottom-container"></div>
      </form>
    </section>`
  );
};

export default class DetailsComponent extends AbstractComponent {
  constructor(card) {
    super();

    this._card = card;
  }

  getTemplate() {
    return createDetailsTemplate(this._card);
  }

  onPopupClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => handler(evt));
  }

  onCloseButtonClick(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);
  }

  onAddToWatchlistButtonClick(handler) {
    this.getElement().querySelector(`#watchlist`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }

  onMarkAsWatchedButtonClick(handler) {
    this.getElement().querySelector(`#watched`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }

  onMarkAsFavoriteButtonClick(handler) {
    this.getElement().querySelector(`#favorite`).addEventListener(`click`, (evt) => {
      evt.preventDefault();
      handler();
    });
  }
}
