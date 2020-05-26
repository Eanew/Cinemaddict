import AbstractComponent from './abstract-component.js';

const createNoMoviesTemplate = () => {
  return (
    `<h2 class="films-list__title">There are no movies in our database</h2>`
  );
};

export default class NoMoviesComponent extends AbstractComponent {
  getTemplate() {
    return createNoMoviesTemplate();
  }
}
