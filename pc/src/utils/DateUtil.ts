/*eslint no-extend-native: 0*/
Date.prototype.toString = function() {
  const t = this;
  const fullYear = t.getFullYear();
  if (isNaN(fullYear)) return "";
  const dateStr = `${ fullYear }-${ t.getMonth().toString().padStart(2, "0") }-${ t.getDate().toString().padStart(2, "0") } ${ t.getHours().toString().padStart(2, "0") }:${ t.getMinutes().toString().padStart(2, "0") }:${ t.getSeconds().toString().padStart(2, "0") }`;
  return dateStr;
};
Date.prototype.toJSON = Date.prototype.toString;

export { };
