import AbstractComponent from './abstract-component.js';

const createFilmListTitleTemplate = () => {
  return (
    `<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>`
  );
};

export default class FilmListTitleComponent extends AbstractComponent {
  getTemplate() {
    return createFilmListTitleTemplate();
  }
}
