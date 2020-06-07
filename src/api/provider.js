import {nanoid} from 'nanoid';

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedCards = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.card);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => Object.assign({}, acc, {[current.id]: current}), {});
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
          const items = createStoreStructure(cards);
          this._store.setItems(items);
          return cards;
        });
    }
    const storeCards = Object.values(this._store.getItems());
    return Promise.resolve(storeCards);
  }

  updateCard(id, data) {
    if (isOnline()) {
      return this._api.updateCard(id, data)
        .then((newCard) => {
          this._store.setItem(newCard.id, newCard);
          return newCard;
        });
    }
    const localCard = Object.assign({}, data, {id});
    this._store.setItem(id, localCard);
    return Promise.resolve(localCard);
  }

  getComments(id) {
    // TODO: Перенастроить работу с комментариями на отдельный ключ в localStorage
    if (isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          const items = createStoreStructure(comments);
          this._store.setItems(items);
          return comments;
        });
    }
    const storeComments = Object.values(this._store.getItems());
    return Promise.resolve(storeComments);
  }

  deleteComment(id) {
    // TODO: Перенастроить работу с комментариями на отдельный ключ в localStorage
    if (isOnline()) {
      return this._api.deleteComment(id)
        .then(() => this._store.removeItem(id));
    }
    this._store.removeItem(id);
    return Promise.resolve();
  }

  createComment(id, comment) {
    // TODO: Перенастроить работу с комментариями на отдельный ключ в localStorage
    if (isOnline()) {
      return this._api.createComment(id, comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, newComment);
          return newComment;
        });
    }
    const localNewComment = Object.assign({}, comment, {
      id: nanoid(),
      name: `You`,
    });

    this._store.setItem(localNewComment.id, localNewComment);
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
          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
