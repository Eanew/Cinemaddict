import AbstractComponent from './abstract-component.js';
import {Regular} from '../utils/common.js';
import {createMarkup, setId, getDuration} from '../utils/data-process.js';

const GENRES_FILED_NAME = `Top genre`;

const timeFieldNames = [
  `All time`,
  `Today`,
  `Week`,
  `Month`,
  `Year`];

const textFieldNames = [
  `You watched`,
  `Total duration`,
  GENRES_FILED_NAME];

const renderTimeFieldMarkup = (name, isChecked = false) => {
  const id = setId(name);

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
      id="statistic-${id}" value="${id}"${isChecked ? ` checked` : ``}>
    <label for="statistic-${id}" class="statistic__filters-label">${name}</label>`
  );
};

const generateTextFields = (textFieldValues) => textFieldNames.map((it, i) => ({
  text: textFieldValues[i],
  name: (it === GENRES_FILED_NAME && textFieldValues[i].indexOf(Regular.COMMA) !== -1)
    ? `${it}s`
    : it,
}));

const formatStatisticString = (text) => {
  return text
    .split(Regular.SPACE)
    .map((it) => {
      return (it.length && (it.replace(Regular.NUMBERS, ``).toLowerCase() === it))
        ? `<span class="statistic__item-description">${it}</span>`
        : it;
    })
    .join(Regular.SPACE);
};

const renderStatisticTextItemMarkup = (textField) => {
  const {name, text} = textField;
  const fieldItemText = formatStatisticString(text);

  return fieldItemText ? (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">${name}</h4>
      <p class="statistic__item-text">${fieldItemText}</p>
    </li>`
  ) : ``;
};

const getTopGenres = (films) => {
  const getGenresList = () => {
    const genres = [];
    films.forEach((film) => {
      film[`film_info`][`genre`].forEach((it) => {
        if (!genres.some((genre) => genre === it)) {
          genres.push(it);
        }
      });
    });
    return genres;
  };

  const getCount = (genre) => {
    let count = 0;
    films.forEach((film) => {
      count += film[`film_info`][`genre`].some((it) => it === genre);
    });
    return count;
  };

  const watchedGenres = getGenresList().map((genre) => ({
    genre,
    count: getCount(genre),
  }));

  const getTopCount = (genres) => {
    let topCount = 0;
    genres.forEach((genre) => {
      if (genre.count > topCount) {
        topCount = genre.count;
      }
    });
    return topCount;
  };

  const topCount = getTopCount(watchedGenres);

  return watchedGenres
    .filter((it) => it.count === topCount)
    .map((it) => it.genre)
    .join(`, `);
};

const createStatisticRankMarkup = () => {
  const profileRaitingElement = document.querySelector(`.profile__rating`);
  const profileAvatarElement = document.querySelector(`.profile__avatar`);
  return profileRaitingElement ? (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="${profileAvatarElement.src}" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${profileRaitingElement.textContent}</span>
    </p>`
  ) : ``;
};

const Statistic = function (films) {
  const moviesCount = `${films.length} movies`;
  const durationInMinutes = films.reduce(((accumulator, it) => accumulator + it[`film_info`][`runtime`]), 0);
  const durationString = getDuration(durationInMinutes, `space between`);
  const topGenres = getTopGenres(films);
  const textFields = generateTextFields([moviesCount, durationString, topGenres]);

  this.rankMarkup = createStatisticRankMarkup();
  this.fieldsMarkup = createMarkup(timeFieldNames, renderTimeFieldMarkup, 0);
  this.textMarkup = createMarkup(textFields, renderStatisticTextItemMarkup);
};

const createStatisticTemplate = (films) => {
  const {
    rankMarkup,
    fieldsMarkup,
    textMarkup,
  } = new Statistic(films);

  return (
    `<section class="statistic">
      ${rankMarkup}

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${fieldsMarkup}
      </form>

      <ul class="statistic__text-list">
        ${textMarkup}
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class UserStatisticComponent extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createStatisticTemplate(this._films);
  }
}
