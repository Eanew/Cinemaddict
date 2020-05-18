import {createMarkup, setId} from '../util.js';

const renderInfoFieldMarkup = (name, value) => {
  return (
    `<span class="film-card__${name}">${value}</span>`
  );
};

const renderControlButtonMarkup = (name, id, isActive = false) => {
  return (
    `<button class="film-card__controls-item button film-card__controls-item--${id || setId(name)}
      ${isActive ? ` film-card__controls-item--active` : ``}">
      ${name}
    </button>`
  );
};

export const createFilmCardTemplate = (infoFieldsData, controlButtonsData) => {
  const infoFieldsMarkup = createMarkup(infoFieldsData, renderInfoFieldMarkup);
  const controlButtonsMarkup = createMarkup(controlButtonsData, renderControlButtonMarkup);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">The Dance of Life</h3>
      <p class="film-card__rating">8.3</p>
      <p class="film-card__info">
        ${infoFieldsMarkup}
      </p>
      <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
      <p class="film-card__description">Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…</p>
      <a class="film-card__comments">5 comments</a>
      <form class="film-card__controls">
        ${controlButtonsMarkup}
      </form>
    </article>`
  );
};
