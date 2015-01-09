!function (global) {
  'use strict';

  var previousIfiUtil = global.IfiUtil;

  function IfiUtil(options) {
    this.options = options || {};
  }

  IfiUtil.noConflict = function noConflict() {
    global.IfiUtil = previousIfiUtil;
    return IfiUtil;
  };

  IfiUtil.ceil = function ceil(val, digit) {
    if (!val || isNaN(val)) {
      return val;
    }
    if (!digit) {
      return Math.ceil(val);
    }
    if (isNaN(digit) || digit < 0) {
      return val;
    }
    var tmp = Math.pow(10, digit);
    return Math.ceil(val * tmp) / tmp;
  };

  IfiUtil.zeroPadding = function zeroPadding(val, digit) {
    if (!val || !digit || isNaN(digit)) {
      return val;
    }
    while (String(val).length < digit) {
      val = "0" + val;
    }
    return val;
  };

  IfiUtil.getDateString = function getDateString(date) {
    if (!date || !(date instanceof Date)) {
      return "";
    }
    return date.getFullYear() + "-" + this.zeroPadding((date.getMonth() + 1), 2) + "-" + this.zeroPadding(date.getDate(), 2);
  };

  global.IfiUtil = IfiUtil;
}(this);
