const ANY_BUT_DIGITS = /[^\d]/g;
const ANY_BUT_DIGITS_T = /[^\dT]/g;

export const toAmz = (date: Date): string => {
  return `${date.toISOString().slice(0, 19).replace(ANY_BUT_DIGITS_T, "")}Z`;
};

export const toDateStamp = (date: Date): string => {
  return date.toISOString().slice(0, 10).replace(ANY_BUT_DIGITS, "");
};
