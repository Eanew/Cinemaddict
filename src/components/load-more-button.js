import AbstractComponent from './abstract-component.js';

const createLoadMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more">Show more</button>`
  );
};

export default class LoadMoreButtonComponent extends AbstractComponent {
  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  onClick(handler) {
    this.getElement().addEventListener(`click`, (evt) => handler(evt));
  }
}
