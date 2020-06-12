export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey)) || {};
    } catch (err) {
      return {};
    }
  }

  setItems(items, folder) {
    const store = this.getItems();
    const updatedStore = Object.assign({}, store, {[folder]: items});

    this._storage.setItem(this._storeKey, JSON.stringify(updatedStore));
  }

  setItem(key, value, folder) {
    const store = this.getItems();
    const updatedItems = Object.assign({}, store[folder], {[key]: value});
    const updatedStore = Object.assign({}, store, {[folder]: updatedItems});

    this._storage.setItem(this._storeKey, JSON.stringify(updatedStore));
  }

  removeItem(key, folder) {
    const store = this.getItems();
    delete store[folder][key];
    this._storage.setItem(this._storeKey, JSON.stringify(store));
  }
}
