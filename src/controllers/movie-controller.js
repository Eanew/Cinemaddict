import {isEscEvent} from '../utils/common.js';
import {render} from '../utils/render.js';

import CardComponent from '../components/film-card.js';
import DetailsComponent from '../components/details.js';

import {generateCommentsData} from '../mock/details.js';

const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;

const pageBody = document.querySelector(`body`);

let isPopupAlredyClosed = false;
let lastTimeout;

const disableCasualPopupOpening = () => {
  isPopupAlredyClosed = true;
  if (lastTimeout) {
    clearTimeout(lastTimeout);
  }
  lastTimeout = setTimeout((() => {
    isPopupAlredyClosed = false;
  }), PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT);
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._cardComponent = null;
    this._detailsComponent = null;
    this._lastDetailsComponent = null;

    this._closePopup = this._closePopup.bind(this);
    this._onPopupEscPress = this._onPopupEscPress.bind(this);
    this.setDefaultView = this.setDefaultView.bind(this);
  }

  render(card) {
    this._cardComponent = new CardComponent(card);
    this._detailsComponent = new DetailsComponent(card, generateCommentsData());

    this._cardComponent.onPopupOpenersClick((evt) => {
      this._openPopup(evt);
    });

    this._cardComponent.onAddToWatchlistButtonClick(() => this.
      _onDataChange(this._card, Object.assign({}, this._card, {
        'user_details': {
          'watchlist': !this._card[`user_details`][`watchlist`],
        },
      })));

    this._cardComponent.onMarkAsWatchedButtonClick(() => this.
      _onDataChange(this._card, Object.assign({}, this._card, {
        'user_details': {
          'already_watched': !this._card[`user_details`][`already_watched`],
          'watching_date': new Date().toISOString,
        },
      })));

    this._cardComponent.onMarkAsFavoriteButtonClick(() => this.
      _onDataChange(this._card, Object.assign({}, this._card, {
        'user_details': {
          'favorite': !this._card[`user_details`][`favorite`],
        },
      })));

    this._detailsComponent.onAddToWatchlistButtonClick(this._onDataChange);
    this._detailsComponent.onMarkAsWatchedButtonClick(this._onDataChange);
    this._detailsComponent.onMarkAsFavoriteButtonClick(this._onDataChange);

    render(this._container, this._cardComponent);
  }

  setDefaultView() {
    if (!this._detailsComponent || !pageBody.contains(this._detailsComponent.getElement())) {
      return;
    }
    document.removeEventListener(`keydown`, this._onPopupEscPress);
    document.removeEventListener(`click`, this._closePopup);
    pageBody.removeChild(this._detailsComponent.getElement());
    this._lastDetailsComponent = null;
  }

  _closePopup() {
    disableCasualPopupOpening();
    this.setDefaultView();
  }

  _onPopupEscPress(evt) {
    isEscEvent(evt, this._closePopup);
  }

  _openPopup(evt) {
    evt.preventDefault();
    evt.stopPropagation();

    if ((this._detailsComponent === this._lastDetailsComponent) || isPopupAlredyClosed) {
      return;
    }
    this._onViewChange();

    document.addEventListener(`keydown`, this._onPopupEscPress);
    document.addEventListener(`click`, this._closePopup);
    this._detailsComponent.onPopupClick((clickEvt) => clickEvt.stopPropagation());
    this._detailsComponent.onCloseButtonClick(this._closePopup);
    this._lastDetailsComponent = this._detailsComponent;
    pageBody.appendChild(this._detailsComponent.getElement());
  }
}
