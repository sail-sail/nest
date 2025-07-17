/*eslint no-extend-native: 0*/
const oldDateToString = Date.prototype.toString;
Date.prototype.toString = function() {
  const fullYear = this.getFullYear();
  if (isNaN(fullYear)) return oldDateToString.apply(this);
  const dateStr = `${ fullYear }-${ (this.getMonth() + 1).toString().padStart(2, "0") }-${ this.getDate().toString().padStart(2, "0") } ${ this.getHours().toString().padStart(2, "0") }:${ this.getMinutes().toString().padStart(2, "0") }:${ this.getSeconds().toString().padStart(2, "0") }`;
  return dateStr;
};
Date.prototype.toJSON = Date.prototype.toString;
