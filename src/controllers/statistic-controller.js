import {render, replace, remove} from '../utils/render.js';
import {FilterType, StatisticInterval, StatisticField} from '../utils/const.js';
import {getCardsByFilter} from '../utils/filter.js';
import {getCardsByInterval} from '../utils/statistic.js';
import {getDuration} from '../utils/data-process.js';
import {Regular} from '../utils/common.js';

import UserLevelComponent from '../components/user-level.js';
import StatisticComponent from '../components/statistic.js';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const AVATAR = `images/bitmap@2x.png`;
const BAR_HEIGHT = 50;

const createChart = (ctx, genres) => {
  ctx.height = BAR_HEIGHT * genres.length;

  return new Chart(ctx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres.map((genre) => genre.name),
      datasets: [{
        data: genres.map((genre) => genre.count),
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

const Rank = {
  'Movie Buff': 21,
  'Fan': 11,
  'Novice': 1,
};

const getRank = (watchedMovies) => {
  for (const count in Rank) {
    if (Rank.hasOwnProperty(count) && Rank[count] <= watchedMovies) {
      return count;
    }
  }
  return ``;
};

const getGenresList = (films) => {
  const genres = [];
  films.forEach((film) => {
    film[`film_info`][`genre`].forEach((addingGenre) => {
      if (!genres.some((genre) => genre === addingGenre)) {
        genres.push(addingGenre);
      }
    });
  });
  return genres;
};

const getGenreCount = (films, genre) => {
  let count = 0;
  films.forEach((film) => {
    count += film[`film_info`][`genre`].some((it) => it === genre);
  });
  return count;
};

const getSortedGenres = (films) => getGenresList(films).map((genre) => ({
  name: genre,
  count: getGenreCount(films, genre),
})).sort((first, second) => second.count - first.count);

const generateStatisticFields = (textFieldValues) => Object.values(StatisticField).map((it, i) => ({
  name: (it === StatisticField.GENRES && textFieldValues[i].indexOf(Regular.COMMA) !== -1) ? `${it}s` : it,
  text: textFieldValues[i],
}));

const getStatisticFields = (cards, genres) => {
  const watchedMoviesString = `${cards.length} movies`;
  const durationInMinutes = cards.reduce(((accumulator, it) => accumulator + it[`film_info`][`runtime`]), 0);
  const durationString = getDuration(durationInMinutes, `space between`);
  const topGenresString = genres.filter((it) => it.count === genres[0].count).map((it) => it.name).join(`, `);

  return generateStatisticFields([watchedMoviesString, durationString, topGenresString]);
};

export default class StatisticController {
  constructor(userLevelContainer, statisticContainer, moviesModel) {
    this._userLevelContainer = userLevelContainer;
    this._statisticContainer = statisticContainer;
    this._moviesModel = moviesModel;

    this._oldUserLevelComponent = null;
    this._userLevelComponent = null;
    this._statisticComponent = null;

    this._interval = StatisticInterval.ALL_TIME;
    this._isShowed = false;
    this._isDataChanged = false;

    this._cards = null;
    this._user = {
      avatar: AVATAR,
      rank: null,
    };
    this._genres = null;

    this.hide = this.hide.bind(this);
    this._onIntervalChange = this._onIntervalChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
    this._moviesModel.setFilterChangeHandler(this.hide);
  }

  hide() {
    if (this._isShowed === true) {
      this._statisticComponent.hide();
      this._isShowed = false;
      if (this._interval !== StatisticInterval.ALL_TIME) {
        this._onIntervalChange(StatisticInterval.ALL_TIME);
      }
    }
  }

  show() {
    if (this._isDataChanged) {
      this.render();
      this._isDataChanged = false;
    }
    this._statisticComponent.show();
    this._isShowed = true;
  }

  getDisplayStatus() {
    return this._isShowed;
  }

  render(isIntervalChange) {
    if (!isIntervalChange) {
      this._cards = getCardsByFilter(this._moviesModel.getAllMovies(), FilterType.HISTORY);
      this._user.rank = getRank(this._cards.length);
    }
    this._genres = getSortedGenres(this._cards);
    const statistic = getStatisticFields(this._cards, this._genres);

    const oldStatisticComponent = this._statisticComponent;
    this._statisticComponent = new StatisticComponent(this._user, statistic, this._isShowed, this._interval);
    this._statisticComponent.onIntervalChange(this._onIntervalChange);
    this._statisticCtx = this._statisticComponent.getElement().querySelector(`.statistic__chart`);

    if (oldStatisticComponent) {
      replace(this._statisticComponent, oldStatisticComponent);
    } else {
      render(this._statisticContainer, this._statisticComponent);
    }
    createChart(this._statisticCtx, this._genres);
  }

  renderUserLevel() {
    const oldUserLevelComponent = this._userLevelComponent;
    const oldElement = oldUserLevelComponent ? oldUserLevelComponent.getElement() : null;
    const isShowed = oldElement ? this._userLevelContainer.contains(oldElement) : false;
    const isToReplace = isShowed && this._cards.length;
    const isToShow = !isShowed && this._cards.length;
    const isToRemove = isShowed && !this._cards.length;

    this._userLevelComponent = new UserLevelComponent(this._user);
    if (isToReplace) {
      replace(this._userLevelComponent, oldUserLevelComponent);
    } else if (isToShow) {
      render(this._userLevelContainer, this._userLevelComponent);
    } else if (isToRemove) {
      remove(oldUserLevelComponent);
    }
  }

  _onDataChange() {
    this._cards = getCardsByFilter(this._moviesModel.getAllMovies(), FilterType.HISTORY);
    this._isDataChanged = true;
    if (Object.values(Rank).some((count) => this._cards.length === count || this._cards.length === count - 1)) {
      this._user.rank = getRank(this._cards.length);
      this.renderUserLevel();
    }
  }

  _onIntervalChange(interval) {
    const isIntervalChange = true;
    this._interval = interval;
    this._cards = getCardsByInterval(this._moviesModel.getAllMovies(), this._interval);
    this.render(isIntervalChange);
  }
}
