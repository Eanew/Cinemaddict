import {render} from './utils/render.js';

import UserLevelComponent from './components/user-level.js';
import NavigationComponent from './components/navigation.js';
import UserStatisticComponent from './components/user-statistic.js';
import FilmListComponent from './components/film-list.js';

import MoviesModel from './models/movies.js';

import PageController from './controllers/page-controller.js';

import {generateFilmCardsData} from './mock/film-list.js';

const FILM_CARDS_COUNT = 12;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);

const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const watchedMovies = filmCards.filter((it) => it[`user_details`][`already_watched`]);

const userLevelComponent = new UserLevelComponent(watchedMovies);
const navigationComponent = new NavigationComponent(filmCards);
const statisticComponent = new UserStatisticComponent(watchedMovies);
const filmListComponent = new FilmListComponent();

const moviesModel = new MoviesModel();
moviesModel.setMovies(filmCards);

const pageController = new PageController(filmListComponent, moviesModel);

render(pageHeader, userLevelComponent);
render(pageMain, navigationComponent);
render(pageMain, statisticComponent);
render(pageMain, filmListComponent);

pageController.render();
