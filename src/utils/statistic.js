import {FilterType, StatisticInterval} from '../utils/const.js';
import {getCardsByFilter} from '../utils/filter.js';

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

const getWatchingDate = (card) => Date.parse(card[`user_details`][`watching_date`]);

const getWatchedFilms = (cards, now, interval) => cards.filter((card) => (now - interval) < getWatchingDate(card));

export const getCardsByInterval = (allCards, interval) => {
  const cards = getCardsByFilter(allCards, FilterType.HISTORY);
  const now = new Date();

  switch (interval) {
    case StatisticInterval.TODAY:
      return getWatchedFilms(cards, now, DAY);

    case StatisticInterval.WEEK:
      return getWatchedFilms(cards, now, WEEK);

    case StatisticInterval.MONTH:
      return getWatchedFilms(cards, now, MONTH);

    case StatisticInterval.YEAR:
      return getWatchedFilms(cards, now, YEAR);
  }
  return cards;
};
