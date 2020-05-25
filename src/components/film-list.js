import AbstractComponent from './abstract-component.js';

const createFilmListTemplate = () => {
  return (
    `<section class="films-list"></section>`
  );
};

export default class FilmListComponent extends AbstractComponent {
  getTemplate() {
    return createFilmListTemplate();
  }
}
