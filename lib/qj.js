!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),(f.qj||(f.qj={})).js=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var QJ, rreturn, rtrim;

QJ = function(selector) {
  if (QJ.isDOMElement(selector)) {
    return selector;
  }
  return document.querySelectorAll(selector);
};

QJ.isDOMElement = function(el) {
  return el && (el.nodeName != null);
};

rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

QJ.trim = function(text) {
  if (text === null) {
    return "";
  } else {
    return (text + "").replace(rtrim, "");
  }
};

rreturn = /\r/g;

QJ.val = function(el, val) {
  var ret;
  if (arguments.length > 1) {
    return el.value = val;
  } else {
    ret = el.value;
    if (typeof ret === "string") {
      return ret.replace(rreturn, "");
    } else {
      if (ret === null) {
        return "";
      } else {
        return ret;
      }
    }
  }
};

QJ.preventDefault = function(eventObject) {
  if (typeof eventObject.preventDefault === "function") {
    eventObject.preventDefault();
    return;
  }
  eventObject.returnValue = false;
  return false;
};

QJ.normalizeEvent = function(e) {
  var original;
  original = e;
  e = {
    which: original.which != null ? original.which : void 0,
    target: original.target || original.srcElement,
    preventDefault: function() {
      return QJ.preventDefault(original);
    },
    originalEvent: original,
    data: original.data || original.detail
  };
  if (e.which == null) {
    e.which = original.charCode != null ? original.charCode : original.keyCode;
  }
  return e;
};

QJ.on = function(element, eventName, callback) {
  var el, multEventName, originalCallback, _i, _j, _len, _len1, _ref;
  if (element.length) {
    for (_i = 0, _len = element.length; _i < _len; _i++) {
      el = element[_i];
      QJ.on(el, eventName, callback);
    }
    return;
  }
  if (eventName.match(" ")) {
    _ref = eventName.split(" ");
    for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
      multEventName = _ref[_j];
      QJ.on(element, multEventName, callback);
    }
    return;
  }
  originalCallback = callback;
  callback = function(e) {
    e = QJ.normalizeEvent(e);
    return originalCallback(e);
  };
  if (element.addEventListener) {
    return element.addEventListener(eventName, callback, false);
  }
  if (element.attachEvent) {
    eventName = "on" + eventName;
    return element.attachEvent(eventName, callback);
  }
  element['on' + eventName] = callback;
};

QJ.addClass = function(el, className) {
  var e;
  if (el.length) {
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = el.length; _i < _len; _i++) {
        e = el[_i];
        _results.push(QJ.addClass(e, className));
      }
      return _results;
    })();
  }
  if (el.classList) {
    return el.classList.add(className);
  } else {
    return el.className += ' ' + className;
  }
};

QJ.hasClass = function(el, className) {
  var e, hasClass, _i, _len;
  if (el.length) {
    hasClass = true;
    for (_i = 0, _len = el.length; _i < _len; _i++) {
      e = el[_i];
      hasClass = hasClass && QJ.hasClass(e, className);
    }
    return hasClass;
  }
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
};

QJ.removeClass = function(el, className) {
  var cls, e, _i, _len, _ref, _results;
  if (el.length) {
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = el.length; _i < _len; _i++) {
        e = el[_i];
        _results.push(QJ.removeClass(e, className));
      }
      return _results;
    })();
  }
  if (el.classList) {
    _ref = className.split(' ');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cls = _ref[_i];
      _results.push(el.classList.remove(cls));
    }
    return _results;
  } else {
    return el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
};

QJ.toggleClass = function(el, className, bool) {
  var e;
  if (el.length) {
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = el.length; _i < _len; _i++) {
        e = el[_i];
        _results.push(QJ.toggleClass(e, className, bool));
      }
      return _results;
    })();
  }
  if (bool) {
    if (!QJ.hasClass(el, className)) {
      return QJ.addClass(el, className);
    }
  } else {
    return QJ.removeClass(el, className);
  }
};

QJ.append = function(el, toAppend) {
  var e;
  if (el.length) {
    return (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = el.length; _i < _len; _i++) {
        e = el[_i];
        _results.push(QJ.append(e, toAppend));
      }
      return _results;
    })();
  }
  return el.insertAdjacentHTML('beforeend', toAppend);
};

QJ.find = function(el, selector) {
  if (el instanceof NodeList || el instanceof Array) {
    el = el[0];
  }
  return el.querySelectorAll(selector);
};

QJ.trigger = function(el, name, data) {
  var e, ev;
  try {
    ev = new CustomEvent(name, {
      detail: data
    });
  } catch (_error) {
    e = _error;
    ev = document.createEvent('CustomEvent');
    if (ev.initCustomEvent) {
      ev.initCustomEvent(name, true, true, data);
    } else {
      ev.initEvent(name, true, true, data);
    }
  }
  return el.dispatchEvent(ev);
};

module.exports = QJ;


},{}]},{},[1])
(1)
});