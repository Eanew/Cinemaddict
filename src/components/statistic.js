import AbstractComponent from './abstract-component.js';
import {StatisticInterval, HIDDEN_CLASS} from '../utils/const.js';
import {createMarkup, setId, matchActiveItems} from '../utils/data-process.js';
import {Regular} from '../utils/common.js';

const createStatisticRankMarkup = (avatar, rank) => {
  return rank ? (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="${avatar}" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>`
  ) : ``;
};

const renderIntervalFieldMarkup = (name, isChecked = false) => {
  const id = setId(name);

  return (
    `<input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter"
      id="statistic-${id}" value="${id}"${isChecked ? ` checked` : ``}>
    <label for="statistic-${id}" class="statistic__filters-label">${name}</label>`
  );
};

const formatStatisticString = (text) => {
  return text.split(Regular.SPACE)

    .map((it) => (it.length && it.toLowerCase().replace(Regular.NUMBERS, ``) === it)
      ? `<span class="statistic__item-description">${it}</span>`
      : it)

    .join(Regular.SPACE);
};

const renderStatisticFieldMarkup = (textField) => {
  const {name, text} = textField;
  const fieldItemText = formatStatisticString(text);

  return fieldItemText ? (
    `<li class="statistic__text-item">
      <h4 class="statistic__item-title">${name}</h4>
      <p class="statistic__item-text">${fieldItemText}</p>
    </li>`
  ) : ``;
};

const createStatisticTemplate = (userInfo, statisticFields, isShowed, currentInterval) => {
  const {avatar, rank} = userInfo;

  const intervals = Object.values(StatisticInterval);
  const activeItems = matchActiveItems(currentInterval, intervals);

  const rankMarkup = createStatisticRankMarkup(avatar, rank);
  const intervalFieldsMarkup = createMarkup(intervals, renderIntervalFieldMarkup, ...activeItems);
  const statisticFieldsMarkup = createMarkup(statisticFields, renderStatisticFieldMarkup);

  return (
    `<section class="statistic${!isShowed ? ` ${HIDDEN_CLASS}` : ``}">
      ${rankMarkup}

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>
        ${intervalFieldsMarkup}
      </form>

      <ul class="statistic__text-list">
        ${statisticFieldsMarkup}
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class StatisticComponent extends AbstractComponent {
  constructor(userInfo, statisticFields, isShowed, currentInterval) {
    super();

    this._userInfo = userInfo;
    this._statisticFields = statisticFields;
    this._isShowed = isShowed;
    this._currentInterval = currentInterval;
  }

  getTemplate() {
    return createStatisticTemplate(this._userInfo, this._statisticFields, this._isShowed, this._currentInterval);
  }

  onIntervalChange(handler) {
    this.getElement().querySelector(`.statistic__filters`)
      .addEventListener(`change`, (evt) => {
        if (evt.target.tagName !== `INPUT`) {
          return;
        }

        const interval = Object.values(StatisticInterval).find((it) => setId(it) === evt.target.value);
        handler(interval);
      });
  }
}
