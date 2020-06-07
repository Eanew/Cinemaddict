const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getCards() {
    if (isOnline()) {
      return this._api.getCards()
        .then((cards) => {
          cards.forEach((card) => this._store.setItem(card.id));
          return cards;
        });
    }
    const storeCards = Object.values(this._store.getItems());
    return Promise.resolve(storeCards);
  }

  updateCard(id, data) {
    if (isOnline()) {
      return this._api.updateCard(id, data);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }

  createComment(id, comment) {
    if (isOnline()) {
      return this._api.createComment(id, comment);
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
  }
}
