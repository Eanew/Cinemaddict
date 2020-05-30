import {FilterType} from '../utils/const.js';

export const getWatchlistCards = (cards) => cards.filter((it) => it[`user_details`][`watchlist`]);

export const getHistoryCards = (cards) => cards.filter((it) => it[`user_details`][`already_watched`])
  .sort((first, second) => {
    const a = Date.parse(first[`user_details`][`watching_date`]);
    const b = Date.parse(second[`user_details`][`watching_date`]);
    return b - a;
  });

export const getFavoritesCards = (cards) => cards.filter((it) => it[`user_details`][`favorite`]);

export const getCardsByFilter = (cards, filterType) => {
  switch (filterType) {
    case FilterType.WATCHLIST:
      return getWatchlistCards(cards);

    case FilterType.HISTORY:
      return getHistoryCards(cards);

    case FilterType.FAVORITES:
      return getFavoritesCards(cards);
  }
  return cards;
};
