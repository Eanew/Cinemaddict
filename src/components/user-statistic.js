import {Regular, createMarkup, setId, getDuration} from '../util.js';

const AVATAR = `images/bitmap@2x.png`;
const GENRES_FILED_NAME = `Top genre`;

const Rank = {
  'Movie Buff': 21,
  'Fan': 11,
  'Novice': 1,
};

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

const setRank = (movies) => {
  for (const count in Rank) {
    if (Rank.hasOwnProperty(count) && Rank[count] <= movies) {
      return count;
    }
  }
  return null;
};

const renderTimeFieldMarkup = (name, isChecked = false) => {
  const id = setId(name);

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
      id="statistic-${id}" value="${id}"${isChecked ? ` checked` : ``}>
    <label for="statistic-${id}" class="statistic__filters-label">${name}</label>`
  );
};

const getStatisticString = (text) => {
  return text
    .split(Regular.SPACE)
    .map((it) => {
      return (it.length && (it.replace(Regular.NUMBERS, ``).toLowerCase() === it))
        ? `<span class="statistic__item-description">${it}</span>`
        : it;
    })
    .join(Regular.SPACE);
};

const generateTextFields = (textFieldValues) => textFieldNames.map((it, i) => ({
  text: textFieldValues[i],
  name: (it === GENRES_FILED_NAME && textFieldValues[i].indexOf(Regular.COMMA) !== -1)
    ? `${it}s`
    : it,
}));

const renderStatisticTextItemMarkup = ({name, text}) => {
  const fieldItemText = getStatisticString(text);

  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">${name}</h4>
      <p class="statistic__item-text">${fieldItemText}</p>
    </li>`
  );
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

const Statistic = function (films) {
  const watchedMovies = films.filter((it) => it[`user_details`][`already_watched`]);
  const moviesCount = `${watchedMovies.length} movies`;
  const durationInMinutes = watchedMovies.reduce(((accumulator, it) => accumulator + it[`film_info`][`runtime`]), 0);
  const durationString = getDuration(durationInMinutes, true);
  const topGenres = getTopGenres(films);
  const textFields = generateTextFields([moviesCount, durationString, topGenres]);

  this.rank = setRank(watchedMovies.length);
  this.fieldMarkup = createMarkup(timeFieldNames, renderTimeFieldMarkup, 0);
  this.textMarkup = createMarkup(textFields, renderStatisticTextItemMarkup);
};

const createUserLevelTemplate = (rank) => {
  return (
    `<section class="header__profile profile">
      ${rank ? `<p class="profile__rating">${rank}</p>` : ``}
      <img class="profile__avatar" src="${AVATAR}" alt="Avatar" width="35" height="35">
    </section>`
  );
};

const createStatisticTemplate = (statistic) => {
  const {
    rank,
    fieldMarkup,
    textMarkup,
  } = statistic;

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="${AVATAR}" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${fieldMarkup}
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

export {Statistic, createUserLevelTemplate, createStatisticTemplate};
