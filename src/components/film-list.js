import AbstractComponent from './abstract-component.js';

const renderFilmListContentsMarkup = (movies) => {
  return movies
    ? (`<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>
      <div class="films-list__container"></div>`)
    : (`<h2 class="films-list__title">There are no movies in our database</h2>`);
};

const createFilmListTemplate = (films) => {
  const filmListContentsMarkup = renderFilmListContentsMarkup(films && films.length);

  return (
    `<section class="films-list">
      ${filmListContentsMarkup}
    </section>`
  );
};

export default class FilmListComponent extends AbstractComponent {
  constructor(films) {
    super();

    this._films = films;
  }

  getTemplate() {
    return createFilmListTemplate(this._films);
  }
}
