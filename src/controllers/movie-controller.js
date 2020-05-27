import {isEscEvent} from '../utils/common.js';
import {render, replace} from '../utils/render.js';

import CardComponent from '../components/film-card.js';
import DetailsComponent from '../components/details.js';

import {generateCommentsData} from '../mock/details.js';

const PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT = 200;

const pageBody = document.querySelector(`body`);

let lastDetailsComponent = null;
let isPopupAlredyClosed = false;

const disableCasualPopupOpening = () => {
  isPopupAlredyClosed = true;
  setTimeout((() => {
    isPopupAlredyClosed = false;
  }), PERMISSION_TO_OPEN_NEW_POPUP_TIMEOUT);
};

const closePopup = () => {
  disableCasualPopupOpening();
  document.removeEventListener(`keydown`, onPopupEscPress);
  document.removeEventListener(`click`, closePopup);
  pageBody.removeChild(lastDetailsComponent.getElement());
};

const onPopupEscPress = (evt) => isEscEvent(evt, closePopup);

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._card = null;
    this._cardComponent = null;
    this._detailsComponent = null;
  }

  render(card) {
    this._card = card;
    this._cardComponent = new CardComponent(card);
    this._detailsComponent = new DetailsComponent(card, generateCommentsData());

    // const appendNewPopup = () => {
    //   if (lastDetailsComponent && pageBody.contains(lastDetailsComponent.getElement())) {
    //     if (lastDetailsComponent !== this._detailsComponent) {
    //       replace(this._detailsComponent, lastDetailsComponent);
    //     }
    //   } else if (!isPopupAlredyClosed) {
    //     pageBody.appendChild(this._detailsComponent.getElement());
    //   }
    //   lastDetailsComponent = this._detailsComponent;
    // };

    // const openPopup = (evt) => {
    //   evt.preventDefault();
    //   evt.stopPropagation();
    //   document.addEventListener(`keydown`, onPopupEscPress);
    //   document.addEventListener(`click`, closePopup);
    //   this._detailsComponent.onPopupClick((clickEvt) => clickEvt.stopPropagation());
    //   this._detailsComponent.onCloseButtonClick(closePopup);
    //   appendNewPopup();
    // };

    this._cardComponent.onPopupOpenersClick((evt) => {
      this._onViewChange();
      openPopup(evt);
    });

    this._cardComponent.onAddToWatchlistButtonClick(() => {
      const cardWithUpdatedField = {
        'user_details': {
          'watchlist': !this._card[`user_details`][`watchlist`]
        }
      };
      this._onDataChange(this._card, Object.assign({}, this._card, cardWithUpdatedField));
    });
    this._cardComponent.onMarkAsWatchedButtonClick(this._onDataChange);
    this._cardComponent.onMarkAsFavoriteButtonClick(this._onDataChange);
    this._detailsComponent.onAddToWatchlistButtonClick(this._onDataChange);
    this._detailsComponent.onMarkAsWatchedButtonClick(this._onDataChange);
    this._detailsComponent.onMarkAsFavoriteButtonClick(this._onDataChange);

    render(this._container, this._cardComponent);
    console.log(this._card[`user_details`][`watchlist`]);
  }

  _appendNewPopup() {
    if (lastDetailsComponent && pageBody.contains(lastDetailsComponent.getElement())) {
      if (lastDetailsComponent !== this._detailsComponent) {
        replace(this._detailsComponent, lastDetailsComponent);
      }
    } else if (!isPopupAlredyClosed) {
      pageBody.appendChild(this._detailsComponent.getElement());
    }
    lastDetailsComponent = this._detailsComponent;
  }

  _openPopup(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    document.addEventListener(`keydown`, onPopupEscPress);
    document.addEventListener(`click`, closePopup);
    this._detailsComponent.onPopupClick((clickEvt) => clickEvt.stopPropagation());
    this._detailsComponent.onCloseButtonClick(closePopup);
    appendNewPopup();
  }

  setDefaultView() {

  }
}
