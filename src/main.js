import {
  Statistic,
  createUserLevelTemplate,
  createStatisticTemplate
} from './components/user-statistic.js';

import {createNavigationTemplate} from './components/navigation.js';
import {createSortingTemplate} from './components/sorting.js';

import {
  createFilmListTemplate,
  addShowMoreButtonListener
} from './components/film-list.js';

import {createDetailsTemplate} from './components/details.js';

import {generateFilmCardsData} from './mock/film-list.js';
import {generateCommentsData} from './mock/details.js';

const FILM_CARDS_COUNT = 12;

const renderHtml = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const pageFooter = document.querySelector(`.footer`);

const filmCards = generateFilmCardsData(FILM_CARDS_COUNT);
const comments = generateCommentsData();
const userData = new Statistic(filmCards);

renderHtml(pageHeader, createUserLevelTemplate(userData.rank));
renderHtml(pageMain, createNavigationTemplate(filmCards));
renderHtml(pageMain, createStatisticTemplate(userData));
renderHtml(pageMain, createSortingTemplate());
renderHtml(pageMain, createFilmListTemplate(filmCards));
// renderHtml(pageFooter, createDetailsTemplate(filmCards[0], comments), `afterend`);

addShowMoreButtonListener();

export {renderHtml};
