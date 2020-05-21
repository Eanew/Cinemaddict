import {getRandomCount} from '../util.js';

const genreTemplates = [`Drama`, `Cartoon`, `Comedy`, `Western`, `Horror`, `Sci-Fi`];

export const generateProfileData = () => ({
  'avatar': `images/bitmap@2x.png`,
  'movies': getRandomCount(0, 40),
  'total_duration': getRandomCount(40, 9000),
  'genre': genreTemplates[getRandomCount(0, genreTemplates.length - 1)],
});
