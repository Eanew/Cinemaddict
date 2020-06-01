import {RenderPosition, render, replace, remove} from '../utils/render.js';
import {FilterType, StatisticInterval, StatisticField} from '../utils/const.js';
import {getCardsByFilter} from '../utils/filter.js';
import {getCardsByInterval} from '../utils/statistic.js';
import {getDuration, setId} from '../utils/data-process.js';
import {Regular} from '../utils/common.js';

import UserLevelComponent from '../components/user-level.js';
import StatisticComponent from '../components/statistic.js';

const AVATAR = `images/bitmap@2x.png`;
const INTERVAL_ID_PREFIX = `statistic-`;

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
    this._displayStatus = false;

    this._isDataChanged = null;
    this._cards = null;
    this._userInfo = {
      avatar: AVATAR,
      rank: null,
    };

    this.hide = this.hide.bind(this);
    this._onIntervalChange = this._onIntervalChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
    this._moviesModel.setFilterChangeHandler(this.hide);
  }

  hide() {
    if (this._displayStatus === true) {
      this._statisticComponent.hide();
      this._displayStatus = false;
      this._onIntervalChange(StatisticInterval.ALL_TIME, (INTERVAL_ID_PREFIX + setId(StatisticInterval.ALL_TIME)));
    }
  }

  show() {
    if (this._isDataChanged) {
      this.render();
      this._isDataChanged = false;
    }
    this._statisticComponent.show();
    this._displayStatus = true;
  }

  getDisplayStatus() {
    return this._displayStatus;
  }

  render(isIntervalChange) {
    if (!isIntervalChange) {
      this._cards = getCardsByFilter(this._moviesModel.getAllMovies(), FilterType.HISTORY);
      this._userInfo.rank = getRank(this._cards.length);
      this._renderUserLevel();
    }
    const genres = getSortedGenres(this._cards);
    const statisticFields = getStatisticFields(this._cards, genres);

    const oldStatisticComponent = this._statisticComponent;
    this._statisticComponent = new StatisticComponent(this._userInfo, statisticFields, genres, this._displayStatus);
    this._statisticComponent.onIntervalChange(this._onIntervalChange);

    if (oldStatisticComponent) {
      replace(this._statisticComponent, oldStatisticComponent);
    } else {
      render(this._statisticContainer, this._statisticComponent);
    }
  }

  _renderUserLevel() {
    const oldUserLevelComponent = this._userLevelComponent;
    const oldElement = oldUserLevelComponent ? oldUserLevelComponent.getElement() : null;
    const isShowed = oldElement ? this._userLevelContainer.contains(oldElement) : false;
    const isToReplace = isShowed && this._cards.length;
    const isToShow = !isShowed && this._cards.length;
    const isToRemove = isShowed && !this._cards.length;

    this._userLevelComponent = new UserLevelComponent(this._userInfo);
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
    if (Object.values(Rank).some((count) => this._cards.length === count || count - 1)) {
      this._userInfo.rank = getRank(this._cards.length);
      this._renderUserLevel();
    }
  }

  _onIntervalChange(interval, id) {
    const isIntervalChange = true;
    this._cards = getCardsByInterval(this._moviesModel.getAllMovies(), interval);
    this.render(isIntervalChange);
    this._statisticComponent.getElement().querySelector(`#${id}`).checked = true;
  }
}
