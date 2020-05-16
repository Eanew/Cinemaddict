import {createUserLevelTemplate} from './components/user-level.js';
import {createNavigationTemplate} from './components/navigation.js';
import {createStatisticTemplate} from './components/statistic.js';
import {createSortingTemplate} from './components/sorting.js';
import {createFilmCardTemplate} from './components/film-card.js';
import * as filmList from './components/film-list.js';
import * as details from './components/details.js';

const FILM_CARDS_COUNT = 5;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const pageFooter = document.querySelector(`.footer`);

const renderHtml = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

renderHtml(pageHeader, createUserLevelTemplate(30, `images/bitmap@2x.png`));

renderHtml(pageMain, createNavigationTemplate());
renderHtml(pageMain, createStatisticTemplate());
renderHtml(pageMain, createSortingTemplate());
renderHtml(pageMain, filmList.createSectionTemplate());

const filmListContainer = pageMain.querySelector(`.films-list__container`);

for (let i = 0; i < FILM_CARDS_COUNT; i++) {
  renderHtml(filmListContainer, createFilmCardTemplate());
}

renderHtml(filmListContainer, filmList.createShowMoreButtonTemplate(), `afterend`);
renderHtml(pageFooter, details.createSectionTemplate(), `afterend`);

const filmDetails = document.querySelector(`.film-details__inner`);

renderHtml(filmDetails, details.createTopContainerTemplate());

const detailsTopContainer = filmDetails.querySelector(`.form-details__top-container`);

renderHtml(detailsTopContainer, details.createDescriptionTemplate());
renderHtml(detailsTopContainer, details.createControlsTemplate());
renderHtml(filmDetails, details.createBottomContainerTemplate());

const detailsBottomContainer = filmDetails.querySelector(`.film-details__comments-wrap`);

renderHtml(detailsBottomContainer, details.createCommentsTemplate());
renderHtml(detailsBottomContainer, details.createNewCommentTemplate());
