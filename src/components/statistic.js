import {Regular, createMarkup, setId, getDuration} from '../util.js';

const timeFieldNames = [
  `All time`,
  `Today`,
  `Week`,
  `Month`,
  `Year`];

const textFieldNames = [
  `You watched`,
  `Total duration`,
  `Top genre`];

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
  name: it,
  text: textFieldValues[i],
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

const getRankLabel = () => {
  return `Sci-Fighter`; // WIP
};

const Statistic = function (data) {
  this.avatar = data[`avatar`];

  const movies = `${data[`movies`]} movies`;
  const duration = getDuration(data[`total_duration`], true);
  const genre = data[`genre`];
  const textFields = generateTextFields([movies, duration, genre]);

  this.rankLabel = getRankLabel(genre);
  this.statisticFieldMarkup = createMarkup(timeFieldNames, renderTimeFieldMarkup, 0);
  this.statisticTextMarkup = createMarkup(textFields, renderStatisticTextItemMarkup);
};

export const createStatisticTemplate = (textData) => {
  const {
    avatar,
    rankLabel,
    statisticFieldMarkup,
    statisticTextMarkup,
  } = new Statistic(textData);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="${avatar}" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rankLabel}</span>
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
