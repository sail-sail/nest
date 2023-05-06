/*eslint no-extend-native: 0*/
Date.prototype.toString = function() {
  const fullYear = this.getFullYear();
  if (isNaN(fullYear)) return "";
  const dateStr = `${ fullYear }-${ (this.getMonth() + 1).toString().padStart(2, "0") }-${ this.getDate().toString().padStart(2, "0") }T${ this.getHours().toString().padStart(2, "0") }:${ this.getMinutes().toString().padStart(2, "0") }:${ this.getSeconds().toString().padStart(2, "0") }`;
  return dateStr;
};
Date.prototype.toJSON = Date.prototype.toString;

export { };
