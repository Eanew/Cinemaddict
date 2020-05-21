import * as util from '../util.js';
import {getDuration, setActiveButtons} from './film-list.js';

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

const emojiList = [`smile`, `sleeping`, `puke`, `angry`];

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

const setTwoDigit = (date, callback) => {
  const getter = callback.bind(date);
  const amends = callback[`name`] === `getMonth` ? 1 : 0;
  return getter().toString().length === 1 ? `0${getter() + amends}` : getter() + amends;
};

const getTimeString = (iso) => {
  const date = new Date(Date.parse(iso));
  const month = setTwoDigit(date, Date.prototype.getMonth);
  const day = setTwoDigit(date, Date.prototype.getDate);
  const hours = setTwoDigit(date, Date.prototype.getHours);
  const minutes = setTwoDigit(date, Date.prototype.getMinutes);
  return `${date.getFullYear()}/${month}/${day} ${hours}:${minutes}`;
};

const renderCommentsItemMarkup = ({author, comment, date, emotion}) => {
  const time = getTimeString(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${time}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const renderEmojiItemMarkup = (emoji) => {
  return (
    `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
    </label>`
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
  this.raiting = info[`total_raiting`];
  this.ageRaiting = info[`age_raiting`];
  this.description = info[`description`];
  this.commentsCount = data[`comments`].length;

  const tableData = [
    [info[`director`]],
    info[`writers`],
    info[`actors`],
    [getReleaseDate(info[`release`][`date`])],
    [getDuration(info[`runtime`])],
    [info[`release`][`release_country`]],
    info[`genre`]];

  const tableFields = generateTableFields(tableData);
  this.detailsTableMarkup = util.createMarkup(tableFields, renderFilmDetailsRowMarkup);

  const watchlistButtonStatus = data[`user_details`][`watchlist`];
  const watchedButtonStatus = data[`user_details`][`already_watched`];
  const favoriteButtonStatus = data[`user_details`][`favorite`];
  const activeButtons = setActiveButtons([watchlistButtonStatus, watchedButtonStatus, favoriteButtonStatus]);
  this.detailsControlsMarkup = util.createMarkup(controlButtonsList, renderControlFieldMarkup, ...activeButtons);
  this.emojiListMarkup = util.createMarkup(emojiList, renderEmojiItemMarkup);
};

export const createDetailsTemplate = (film, comments) => {
  const {
    title,
    alternativeTitle,
    poster,
    raiting,
    ageRaiting,
    description,
    commentsCount,
    detailsTableMarkup,
    detailsControlsMarkup,
    emojiListMarkup,
  } = new FilmCard(film);

  const detailsCommentsMarkup = util.createMarkup(comments.slice(0, commentsCount), renderCommentsItemMarkup);

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

              <p class="film-details__age">${ageRaiting}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${raiting}</p>
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
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">
              ${commentsCount || `0`}</span>
            </h3>

            <ul class="film-details__comments-list">
              ${detailsCommentsMarkup}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${emojiListMarkup}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};
