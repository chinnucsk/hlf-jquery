// Generated by CoffeeScript 1.3.3
(function() {

  define(['jquery', 'underscore'], function($, _) {
    var NS, debug, makeLog;
    _.templateSettings = {
      interpolate: /\{\{(.+?)\}\}/g
    };
    $.fn.cssNum = function(prop) {
      var val;
      val = this.css(prop);
      if (prop % 1 > 0) {
        return parseInt(val, 10);
      } else {
        return parseFloat(val);
      }
    };
    debug = false;
    NS = {
      createPlugin: function(ns, apiClass, asSingleton) {
        var nsDat, nsEvt, nsLog;
        if (asSingleton == null) {
          asSingleton = false;
        }
        ns.apiClass = apiClass;
        nsEvt = ns.toString('event');
        nsDat = ns.toString('data');
        nsLog = ns.toString('log');
        return function(opt, $ctx) {
          var $el, api, boilerplate, deep;
          $el = null;
          boilerplate = function() {
            var $root, _base, _base1, _base2, _base3, _ref, _ref1, _ref2, _ref3;
            $root = asSingleton === false ? $el : $ctx;
            $root.addClass(ns.toString('class'));
            if ((_ref = (_base = apiClass.prototype)._evt) == null) {
              _base._evt = function(name) {
                return "" + name + nsEvt;
              };
            }
            if ((_ref1 = (_base1 = apiClass.prototype)._dat) == null) {
              _base1._dat = function(name) {
                return "" + nsDat + name;
              };
            }
            if (ns.debug === true) {
              if ((_ref2 = (_base2 = apiClass.prototype)._log) == null) {
                _base2._log = function() {
                  var vals;
                  vals = _.toArray(arguments);
                  vals.unshift(nsLog);
                  return $.hlf.log.apply(null, vals);
                };
              }
            } else {
              if ((_ref3 = (_base3 = apiClass.prototype)._log) == null) {
                _base3._log = $.noop;
              }
            }
            return $root.data(ns.toString(), new apiClass($el, opt, $ctx));
          };
          if ($ctx == null) {
            $ctx = $('body');
          }
          api = this.first().data(ns.toString());
          if ((api != null) && !(opt != null)) {
            return api;
          }
          opt = $.extend((deep = true), {}, ns.defaults, opt);
          if (asSingleton === false) {
            return this.each(function() {
              $el = $(this);
              return boilerplate();
            });
          } else {
            $el = this;
            return boilerplate();
          }
        };
      },
      debug: function(val) {
        if (val != null) {
          debug = !!val;
          $('body').trigger("debug" + (this.toString('event')));
        }
        return debug;
      },
      toString: function(context) {
        switch (context) {
          case 'event':
            return '.hlf';
          case 'data':
            return 'hlf';
          case 'log':
            return 'hlf:';
          default:
            return 'hlf';
        }
      }
    };
    makeLog = function() {
      if (console.log.bind) {
        return console.log.bind(console);
      } else {
        return console.log;
      }
    };
    NS.log = NS.debug() === false ? $.noop : makeLog();
    $('body').on("debug" + (NS.toString('event')), function() {
      if (debug === true) {
        window.$ = $;
        window._ = _;
        return NS.log = makeLog();
      }
    });
    $.hlf = NS;
    return NS;
  });

}).call(this);