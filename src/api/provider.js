const isOnline = () => {
  return window.navigator.onLine;
};

export default class Provider {
  constructor(api) {
    this._api = api;
  }

  getCards() {
    if (isOnline()) {
      return this._api.getCards();
    }

    // TODO: Реализовать логику при отсутствии интернета
    return Promise.reject(`offline logic is not implemented`);
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
