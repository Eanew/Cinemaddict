import {Regular} from '../util.js';

const renderInfoFieldMarkup = (name, value) => {
  return (
    `<span class="film-card__${name}">${value}</span>`
  );
};

const renderControlButtonMarkup = (name, id) => {
  const modClass = id || name.toLowerCase().replace(Regular.EMPTY_SPACE, Regular.DASH);

  return (
    `<button class="film-card__controls-item button film-card__controls-item--${modClass}">
      ${name}
    </button>`
  );
};

export const createFilmCardTemplate = () => {
  const infoField = renderInfoFieldMarkup(`year`, `1929`);
  const controlButton = renderControlButtonMarkup(`Mark as favorite`, `favorite`);

  return (
    `<article class="film-card">
      <h3 class="film-card__title">The Dance of Life</h3>
      <p class="film-card__rating">8.3</p>
      <p class="film-card__info">
        ${infoField}
        ${infoField}
        ${infoField}
      </p>
      <img src="./images/posters/the-dance-of-life.jpg" alt="" class="film-card__poster">
      <p class="film-card__description">Burlesque comic Ralph "Skid" Johnson (Skelly), and specialty dancer Bonny Lee King (Carroll), end up together on a cold, rainy night at a tr…</p>
      <a class="film-card__comments">5 comments</a>
      <form class="film-card__controls">
        ${controlButton}
        ${controlButton}
        ${controlButton}
      </form>
    </article>`
  );
};
