import {nanoid} from 'nanoid';

const StoreKey = {
  FILMS: `films`,
  COMMENTS: `comments`,
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => Object.assign({}, acc, {[current.id]: current}), {});
};

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedCards = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.card);
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getCards() {
    if (isOnline()) {
      return this._api.getCards()
        .then((films) => {
          const items = createStoreStructure(films);
          this._store.setItems(items, StoreKey.FILMS);
          return films;
        });
    }
    const storeCards = Object.values(this._store.getItems()[StoreKey.FILMS]);
    return Promise.resolve(storeCards);
  }

  updateCard(id, data) {
    if (isOnline()) {
      return this._api.updateCard(id, data)
        .then((newCard) => {
          this._store.setItem(newCard.id, newCard, StoreKey.FILMS);
          return newCard;
        });
    }
    const localCard = Object.assign({}, data, {id});
    this._store.setItem(id, localCard, StoreKey.FILMS);
    return Promise.resolve(localCard);
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          const items = createStoreStructure(comments);
          this._store.setItems(items, StoreKey.COMMENTS);
          return comments;
        });
    }
    const storeComments = Object.values(this._store.getItems()[StoreKey.COMMENTS]);
    return Promise.resolve(storeComments);
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._store.removeItem(id, StoreKey.COMMENTS));
    }
    this._store.removeItem(id, StoreKey.COMMENTS);
    return Promise.resolve();
  }

  createComment(id, comment) {
    if (isOnline()) {
      return this._api.createComment(id, comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, newComment, StoreKey.COMMENTS);
          return newComment;
        });
    }
    const localNewComment = Object.assign({}, comment, {
      id: nanoid(),
      name: `You`,
    });

    this._store.setItem(localNewComment.id, localNewComment, StoreKey.COMMENTS);
    return Promise.resolve(localNewComment);
  }

  sync() {
    // TODO: Добавить логику синхронизации по ключу комментариев в localStorage
    if (isOnline()) {
      return this._api.sync(Object.values(this._store.getItems()))
        .then((response) => {
          const createdCards = getSyncedCards(response.created);
          const updatedCards = getSyncedCards(response.updated);
          const items = createStoreStructure([...createdCards, ...updatedCards]);
          this._store.setItems(items, StoreKey.FILMS);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
