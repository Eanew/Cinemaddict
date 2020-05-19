import {Regular, mergeData, createMarkup, setId} from '../util.js';

const renderStatisticFieldMarkup = (name, isChecked = false) => {
  const id = setId(name);

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
      id="statistic-${id}" value="${id}"${isChecked ? ` checked` : ``}>
    <label for="statistic-${id}" class="statistic__filters-label">${name}</label>`
  );
};

const renderStatisticStringMarkup = (string) => {
  return string
    .split(Regular.SPACE)
    .map((it) => {
      return (it.length && (it.replace(Regular.NUMBERS, ``).toLowerCase() === it))
        ? `<span class="statistic__item-description">${it}</span>`
        : it;
    })
    .join(Regular.SPACE);
};

const renderStatisticTextItemMarkup = ({name, value}) => {
  const itemText = renderStatisticStringMarkup(value);

  return (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">${name}</h4>
      <p class="statistic__item-text">${itemText}</p>
    </li>`
  );
};

export const createStatisticTemplate = (textFieldsValues) => {
  const fieldNames = [`All time`, `Today`, `Week`, `Month`, `Year`];
  const textFieldNames = [
    {name: `You watched`},
    {name: `Total duration`},
    {name: `Top genre`}];

  const textData = mergeData(textFieldNames, textFieldsValues);
  const statisticFieldMarkup = createMarkup(fieldNames, renderStatisticFieldMarkup, 0);
  const statisticTextMarkup = createMarkup(textData, renderStatisticTextItemMarkup);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${statisticFieldMarkup}
      </form>

      <ul class="statistic__text-list">
        ${statisticTextMarkup}
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};
