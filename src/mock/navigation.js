import {setId} from '../util.js';
import {ALL_MOVIES_ID} from '../components/navigation.js';

const ALL_MOVIES_NAME = `All movies`;

const navItems = [
  `All movies`,
  `Watchlist`,
  `History`,
  `Favorites`];

export const generateNavItemsData = () => navItems.map((it) => ({
  name: it,
  id: (it === ALL_MOVIES_NAME ? ALL_MOVIES_ID : setId(it)),
  count: Math.floor(Math.random() * 15),
}));
