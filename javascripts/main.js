/*!
 * DlManager 0.1
 * DlManager is a simple jQuery plugin for Data Layer Management
 *
 * Copyright Fujitsu Ltd.
 */
(function (global) {
  'use strict';

  var previousDlManager = global.DlManager;

  /** Constructor. */
  function DlManager(options) {
    this.options = options || {};
    this.url = options.url || '';
    this.DLMName = options.DLMName || '';
    this.layerName = options.layerName || '';
    this.headers = options.headers || [];
    this.dataKeys = options.dataKeys || [];
  }

  /** Set global.DlManager to previous and return this DlManager. */
  DlManager.noConflict = function noConflict() {
    global.DlManager = previousDlManager;
    return DlManager;
  };

  /** Get Table Data */
  DlManager.prototype.getTableData = function getTableData() {
    var tabledatas = [];
    $.ajax({
      async: true,
      type: 'GET',
      dataType: 'jsonp',
      jsonp: 'callback',
      timeout: 10000,
      url: this.url,
      data: {method: 'getObject', result: 'jsonp', DLMName: this.DLMName, layerName: this.layerName, idall: true, includeData: true},
      success: function (json) {
        var resultData = json.resultData;
        for (var i = 0; i < resultData.length; i++) {
          var tabledata = [];
          for (var j = 0; j < this.dataKeys.length; j++) {
            tabledata.push(resultData[i][this.dataKeys[j]]);
          }
          tabledatas.push(tabledata);
        }
        return tabledatas;
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert("XMLHttpRequest : " + XMLHttpRequest.status + ",textStatus : " + textStatus + ",errorThrown : " + errorThrown.message);
      },
      complete: function (data) {
        alert("complete");
      }
    });
    return tabledatas;
  };

  global.DlManager = DlManager;

})(this);
