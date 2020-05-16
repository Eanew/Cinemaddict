import {Regular} from '../util.js';

const renderStatisticFieldMarkup = (name) => {
  const lowerCaseName = name.toLowerCase();

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
      id="statistic-${lowerCaseName}" value="${lowerCaseName}">
    <label for="statistic-${lowerCaseName}" class="statistic__filters-label">${name}</label>`
  );
};

const renderStatisticStringMarkup = (string) => {
  return string
    .split(Regular.SPACE)
    .map((it) => {
      return it.length && it.replace(Regular.NUMBERS, ``).toLowerCase() === it ?
        `<span class="statistic__item-description">${it}</span>`
        : it;
    })
    .join(Regular.SPACE);
};

const renderStatisticTextItemMarkup = (name, value) => {
  const itemText = renderStatisticStringMarkup(value);

  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">${name}</h4>
      <p class="statistic__item-text">${itemText}</p>
    </li>`
  );
};

export const createStatisticTemplate = () => {
  const statisticField = renderStatisticFieldMarkup(`Today`);
  const statisticTextItem = renderStatisticTextItemMarkup(`Total duration`, `130 h 22 m`);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${statisticField}
        ${statisticField}
        ${statisticField}
        ${statisticField}
        ${statisticField}
      </form>

      <ul class="statistic__text-list">
        ${renderStatisticTextItemMarkup(`You watched`, `22 movies`)}
        ${statisticTextItem}
        ${renderStatisticTextItemMarkup(`Top genre`, `Sci-Fi`)}
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};
