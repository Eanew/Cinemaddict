import {RenderPosition, render, replace} from '../utils/render.js';
import {FilterType, StatisticInterval, StatisticField} from '../utils/const.js';
import {getCardsByFilter} from '../utils/filter.js';
import {getDuration} from '../utils/data-process.js';
import {Regular} from '../utils/common.js';

import UserLevelComponent from '../components/user-level.js';
import StatisticComponent from '../components/statistic.js';

const AVATAR = `images/bitmap@2x.png`;

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

    this._userLevelComponent = null;
    this._statisticComponent = null;

    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const cards = getCardsByFilter(this._moviesModel.getAllMovies(), FilterType.HISTORY);
    const genres = getSortedGenres(cards);
    const statisticFields = getStatisticFields(cards, genres);
    const userInfo = {
      avatar: AVATAR,
      rank: getRank(cards.length),
    };

    const oldUserLevelComponent = this._userLevelComponent;
    const oldStatisticComponent = this._statisticComponent;
    this._userLevelComponent = new UserLevelComponent(userInfo);
    this._statisticComponent = new StatisticComponent(userInfo, statisticFields, genres);

    // this._statisticComponent.setIntervalChangeHandler();

    if (oldUserLevelComponent && oldUserLevelComponent.getElement()) {
      replace(this._userLevelComponent, oldUserLevelComponent);
    } else {
      render(this._userLevelContainer, this._userLevelComponent);
    }

    if (oldStatisticComponent) {
      replace(this._statisticComponent, oldStatisticComponent);
    } else {
      render(this._statisticContainer, this._statisticComponent);
    }
  }

  _onDataChange() {
    this.render();
  }
}
