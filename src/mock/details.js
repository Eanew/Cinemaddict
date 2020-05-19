import {Emoji} from '../components/details.js';

const tableFields = [
  `Director`,
  `Writers`,
  `Actors`,
  `Release Date`,
  `Runtime`,
  `Country`,
  `Genres`];

const tableValues = [
  [`Anthony Mann`],
  [`Anne Wigton`, `Heinz Herald`, `Richard Weil`],
  [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`],
  [`30 March 1945`],
  [`1h 18m`],
  [`USA`],
  [`Drama`, `Film-Noir`, `Mystery`]];

export const generateTableData = () => tableFields.map((it, i) => ({
  name: it,
  values: tableValues[i],
}));

export const generateCommentsData = () => {
  return [
    {
      author: `Tim Macoveev`,
      time: `2019/12/31 23:59`,
      text: `Interesting setting and a good cast`,
      emoji: Emoji.smile,
    },
    {
      author: `Vitaliy Komolaev`,
      time: `Just now`,
      text: `Where is my homework, Lebovski??`,
      emoji: Emoji.angry,
    },
    {
      author: `John Doe`,
      time: `2 days ago`,
      text: `Booooooooooring`,
      emoji: Emoji.sleeping,
    },
    {
      author: `John Doe`,
      time: `2 days ago`,
      text: `Very very old. Meh`,
      emoji: Emoji.puke,
    },
    {
      author: `John Doe`,
      time: `Today`,
      text: `Almost two hours? Seriously?`,
      emoji: Emoji.angry,
    }];
};
