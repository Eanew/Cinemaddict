import {Emoji} from '../components/details.js';

export const generateTableData = () => {
  return [
    {values: [`Anthony Mann`]},
    {values: [`Anne Wigton`, `Heinz Herald`, `Richard Weil`]},
    {values: [`Erich von Stroheim`, `Mary Beth Hughes`, `Dan Duryea`]},
    {values: [`30 March 1945`]},
    {values: [`1h 18m`]},
    {values: [`USA`]},
    {values: [`Drama`, `Film-Noir`, `Mystery`]}];
};

export const generateCommentsData = () => {
  return [
    {
      author: `Tim Macoveev`,
      time: `2019/12/31 23:59`,
      text: `Interesting setting and a good cast`,
      emoji: Emoji.smile,
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
