const textFieldNames = [
  `You watched`,
  `Total duration`,
  `Top genre`];

const textFieldValues = [
  `22 movies`,
  `130 h 22 m`,
  `Sci-Fi`];

export const generateTextData = () => textFieldNames.map((it, i) => ({
  name: it,
  value: textFieldValues[i],
}));
