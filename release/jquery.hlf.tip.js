// Generated by CoffeeScript 1.3.3
(function() {
  var $, SnapTip, Tip, ns,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = jQuery;

  ns = $.hlf;

  ns.tip = {
    debug: true,
    toString: function(context) {
      switch (context) {
        case 'event':
          return '.hlf.tip';
        case 'data':
          return 'hlfTip';
        case 'class':
          return 'js-tips';
        case 'log':
          return 'hlf-tip:';
        default:
          return 'hlf.tip';
      }
    },
    defaults: (function(pre) {
      return {
        ms: {
          duration: {
            "in": 200,
            out: 200
          },
          delay: {
            "in": 300,
            out: 300
          }
        },
        cursorHeight: 6,
        defaultDirection: ['south', 'east'],
        safeToggle: true,
        autoDirection: true,
        cls: (function() {
          var cls;
          cls = {};
          _.each(['inner', 'content', 'stem', 'north', 'east', 'south', 'west', 'follow', 'trigger'], function(key) {
            return cls[key] = "" + pre + key;
          });
          cls.tip = 'js-tip';
          return cls;
        })()
      };
    })('js-tip-')
  };

  ns.snapTip = {
    debug: false,
    toString: function(context) {
      switch (context) {
        case 'event':
          return '.hlf.snapTip';
        case 'data':
          return 'hlfSnapTip';
        case 'class':
          return 'js-snap-tips';
        case 'log':
          return 'hlf-snap-tip:';
        default:
          return 'hlf.snapTip';
      }
    },
    defaults: (function(pre) {
      return $.extend(true, {}, ns.tip.defaults, {
        snap: {
          toTrigger: true,
          toXAxis: false,
          toYAxis: false
        },
        cls: (function() {
          var cls;
          cls = {
            snap: {}
          };
          _.each({
            toXAxis: 'x-side',
            toYAxis: 'y-side',
            toTrigger: 'trigger'
          }, function(val, key) {
            return cls.snap[key] = "" + pre + val;
          });
          cls.tip = 'js-tip js-snap-tip';
          return cls;
        })()
      });
    })('js-snap-tip-')
  };

  Tip = (function() {

    function Tip($ts, o, $ctx) {
      var _this = this;
      this.$ts = $ts;
      this.o = o;
      this.$ctx = $ctx;
      _.bindAll(this, '_onTriggerMouseMove', '_setBounds');
      this.$tip = $('<div>');
      this.doStem = this.o.cls.stem !== '';
      this.doFollow = this.o.cls.follow !== '';
      this._state = 'asleep';
      this._$tCurrent = null;
      this._render();
      this._bind();
      this.$ts.each(function(idx, el) {
        var $t;
        $t = $(el);
        $t.addClass(_this.o.cls.trigger);
        _this._saveTriggerContent($t);
        _this._bindTrigger($t);
        return _this._updateDirectionByTrigger($t);
      });
    }

    Tip.prototype._defaultHtml = function() {
      var _this = this;
      return (function(c) {
        var cDir, containerClass, html, stemHtml;
        cDir = $.trim(_.reduce(_this.o.defaultDirection, (function(cls, dir) {
          return "" + cls + " " + c[dir];
        }), ''));
        containerClass = $.trim([c.tip, c.follow, cDir].join(' '));
        if (_this.doStem === true) {
          stemHtml = "<div class='" + c.stem + "'></div>";
        }
        return html = ("<div class=\"" + containerClass + "\"><div class=\"" + c.inner + "\">" + stemHtml + "<div class='" + c.content + "'>") + "</div></div></div>";
      })(this.o.cls);
    };

    Tip.prototype._saveTriggerContent = function($t) {
      var title;
      title = $t.attr('title');
      if (title) {
        return $t.data(this._dat('Content'), title).removeAttr('title');
      }
    };

    Tip.prototype._bindTrigger = function($t) {
      var _this = this;
      $t.on(this._evt('truemouseenter'), function(evt) {
        _this._log(_this._nsLog, evt);
        return _this._onTriggerMouseMove(evt);
      });
      $t.on(this._evt('truemouseleave'), function(evt) {
        return _this.sleepByTrigger($t);
      });
      if (this.doFollow === true) {
        return $t.on('mousemove', this._onTriggerMouseMove);
      }
    };

    Tip.prototype._bind = function() {
      var _this = this;
      this.$tip.on('mouseenter', function(evt) {
        _this._log(_this._nsLog, 'enter tip');
        if (_this._$tCurrent != null) {
          _this._$tCurrent.data('hlfIsActive', true);
          return _this.wakeByTrigger(_this._$tCurrent);
        }
      }).on('mouseleave', function(evt) {
        _this._log(_this._nsLog, 'leave tip');
        if (_this._$tCurrent != null) {
          _this._$tCurrent.data('hlfIsActive', false);
          return _this.sleepByTrigger(_this._$tCurrent);
        }
      });
      if (this.o.autoDirection === true) {
        return $(window).resize(_.debounce(this._setBounds, 300));
      }
    };

    Tip.prototype._render = function() {
      var html;
      if (this.$tip.html().length) {
        return false;
      }
      html = this.htmlOnRender();
      if (!((html != null) && html.length)) {
        html = this._defaultHtml();
      }
      this.$tip = $(html).addClass(this.o.cls.follow);
      return this.$tip.prependTo(this.$ctx);
    };

    Tip.prototype._inflateByTrigger = function($t) {
      var _this = this;
      return (function(c) {
        var dir;
        dir = $t.data(_this._dat('Direction')) ? $t.data(_this._dat('Direction')).split(' ') : _this.o.defaultDirection;
        _this._log(_this._nsLog, 'update direction class', dir);
        return _this.$tip.find("." + c.content).text($t.data(_this._dat('Content'))).end().removeClass([c.north, c.south, c.east, c.west].join(' ')).addClass($.trim(_.reduce(dir, (function(cls, dir) {
          return "" + cls + " " + c[dir];
        }), '')));
      })(this.o.cls);
    };

    Tip.prototype._onTriggerMouseMove = function(evt) {
      var $t,
        _this = this;
      if (!(evt.pageX != null)) {
        return false;
      }
      $t = ($t = $(evt.currentTarget)) && $t.hasClass(this.o.cls.trigger) ? $t : $t.closest(this.o.cls.trigger);
      if (!$t.length) {
        return false;
      }
      return this.wakeByTrigger($t, evt, function() {
        var offset;
        offset = {
          top: evt.pageY,
          left: evt.pageX
        };
        offset = _this.offsetOnTriggerMouseMove(evt, offset, $t) || offset;
        if (_this.isDirection('north', $t)) {
          offset.top -= _this.$tip.outerHeight() + _this.o.cursorHeight;
        }
        if (_this.isDirection('west', $t)) {
          offset.left -= _this.$tip.outerWidth();
        }
        if (_this.isDirection('south', $t)) {
          offset.top += _this.o.cursorHeight;
        }
        offset.top += _this.o.cursorHeight;
        _this.$tip.css(offset);
        return _this._log(_this._nsLog, '_onTriggerMouseMove', _this._state, offset);
      });
    };

    Tip.prototype._updateDirectionByTrigger = function($t) {
      var checkDir, dir, newDir, size, tHeight, tPosition, tWidth, _i, _len, _ref, _results,
        _this = this;
      if (this.o.autoDirection === false) {
        return false;
      }
      checkDir = function(dir) {
        var edge, ok;
        if (!(_this._bounds != null)) {
          _this._setBounds();
        }
        ok = true;
        switch (dir) {
          case 'south':
            ok = (edge = tPosition.top + tHeight + size.height) && _this._bounds.bottom > edge;
            break;
          case 'east':
            ok = (edge = tPosition.left + size.width) && _this._bounds.right > edge;
            break;
          case 'north':
            ok = (edge = tPosition.top - size.height) && _this._bounds.top < edge;
            break;
          case 'west':
            ok = (edge = tPosition.left - size.width) && _this._bounds.left < edge;
        }
        _this._log(_this._nsLog, 'checkDir', "'" + ($t.html()) + "'", dir, edge, size);
        if (!ok) {
          switch (dir) {
            case 'south':
              newDir[0] = 'north';
              break;
            case 'east':
              newDir[1] = 'west';
              break;
            case 'north':
              newDir[0] = 'south';
              break;
            case 'west':
              newDir[1] = 'east';
          }
          return $t.data(_this._dat('Direction'), newDir.join(' '));
        }
      };
      tPosition = $t.position();
      tWidth = $t.outerWidth();
      tHeight = $t.outerHeight();
      size = this.sizeForTrigger($t);
      newDir = _.clone(this.o.defaultDirection);
      _ref = this.o.defaultDirection;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dir = _ref[_i];
        _results.push(checkDir(dir));
      }
      return _results;
    };

    Tip.prototype._setBounds = function() {
      var $ctx;
      $ctx = this.$ctx.is('body') ? $(window) : this.$ctx;
      return this._bounds = {
        top: parseInt(this.$ctx.css('padding-top'), 10),
        left: parseInt(this.$ctx.css('padding-left'), 10),
        bottom: $ctx.innerHeight(),
        right: this.$ctx.innerWidth()
      };
    };

    Tip.prototype.options = function() {
      return this.o;
    };

    Tip.prototype.tip = function() {
      return this.$tip;
    };

    Tip.prototype.sizeForTrigger = function($t, force) {
      var size;
      if (force == null) {
        force = false;
      }
      size = {
        width: $t.data(this._dat('Width')),
        height: $t.data(this._dat('Height'))
      };
      if (size.width && size.height) {
        return size;
      }
      this.$tip.find("." + this.o.cls.content).text($t.data(this._dat('Content'))).end().css({
        display: 'block',
        visibility: 'hidden'
      });
      $t.data(this._dat('Width'), (size.width = this.$tip.outerWidth()));
      $t.data(this._dat('Height'), (size.height = this.$tip.outerHeight()));
      this.$tip.css({
        display: 'none',
        visibility: 'visible'
      });
      return size;
    };

    Tip.prototype.isDirection = function(dir, $t) {
      return (this.$tip.hasClass(this.o.cls[dir])) || ((!($t != null) || !$t.data(this._dat('Direction'))) && _.include(this.o.defaultDirection, dir));
    };

    Tip.prototype.wakeByTrigger = function($t, evt, cb) {
      var delay, duration, triggerChanged, wake, _ref,
        _this = this;
      triggerChanged = !$t.is(this._$tCurrent);
      if (triggerChanged) {
        this._inflateByTrigger($t);
        this._$tCurrent = $t;
      }
      if (this._state === 'awake' && (cb != null)) {
        cb();
        this._log(this._nsLog, 'quick update');
        return true;
      }
      if (evt != null) {
        this._log(this._nsLog, evt.type);
      }
      if ((_ref = this._state) === 'awake' || _ref === 'waking') {
        return false;
      }
      delay = this.o.ms.delay["in"];
      duration = this.o.ms.duration["in"];
      wake = function() {
        _this.onShow(triggerChanged, evt);
        return _this.$tip.fadeIn(duration, function() {
          if (triggerChanged) {
            if (cb != null) {
              cb();
            }
          }
          if (_this.o.safeToggle === true) {
            _this.$tip.siblings(_this.o.cls.tip).fadeOut();
          }
          _this.afterShow(triggerChanged, evt);
          return _this._state = 'awake';
        });
      };
      if (this._state === 'sleeping') {
        this._log(this._nsLog, 'clear sleep');
        clearTimeout(this._sleepCountdown);
        duration = 0;
        wake();
      } else if ((evt != null) && evt.type === 'truemouseenter') {
        triggerChanged = true;
        this._state = 'waking';
        this._wakeCountdown = setTimeout(wake, delay);
      }
      return true;
    };

    Tip.prototype.sleepByTrigger = function($t) {
      var _this = this;
      if (this._state !== 'awake') {
        return false;
      }
      this._state = 'sleeping';
      clearTimeout(this._wakeCountdown);
      this._sleepCountdown = setTimeout(function() {
        _this.onHide();
        return _this.$tip.fadeOut(_this.o.ms.duration.out, function() {
          _this._state = 'asleep';
          return _this.afterHide();
        });
      }, this.o.ms.delay.out);
      return true;
    };

    Tip.prototype.onShow = function(triggerChanged, evt) {};

    Tip.prototype.onHide = $.noop;

    Tip.prototype.afterShow = function(triggerChanged, evt) {};

    Tip.prototype.afterHide = $.noop;

    Tip.prototype.htmlOnRender = $.noop;

    Tip.prototype.offsetOnTriggerMouseMove = function(evt, offset, $t) {
      return false;
    };

    return Tip;

  })();

  SnapTip = (function(_super) {

    __extends(SnapTip, _super);

    function SnapTip($ts, o, $ctx) {
      var _this = this;
      SnapTip.__super__.constructor.call(this, $ts, o, $ctx);
      if (this.o.snap.toTrigger === false) {
        this.o.snap.toTrigger = this.o.snap.toXAxis === true || this.o.snap.toYAxis === true;
      }
      if (this.o.snap.toXAxis === true) {
        this.o.cursorHeight = 0;
      }
      if (this.o.snap.toYAxis === true) {
        this.o.cursorHeight = 2;
      }
      this._offsetStart = null;
      _.each(this.o.snap, function(active, prop) {
        if (active) {
          return _this.$tip.addClass(_this.o.cls.snap[prop]);
        }
      });
    }

    SnapTip.prototype._moveToTrigger = function($t, baseOffset) {
      var offset;
      offset = $t.offset();
      if (this.o.snap.toXAxis === true) {
        if (this.isDirection('south')) {
          offset.top += $t.outerHeight();
        }
        if (this.o.snap.toYAxis === false) {
          offset.left = baseOffset.left - (this.$tip.outerWidth() - 12) / 2;
        }
      }
      if (this.o.snap.toYAxis === true) {
        if (this.isDirection('east')) {
          offset.left += $t.outerWidth();
        }
        if (this.o.snap.toXAxis === false) {
          offset.top = baseOffset.top - $t.outerHeight() / 2;
        }
      }
      return offset;
    };

    SnapTip.prototype._bindTrigger = function($t) {
      var _this = this;
      SnapTip.__super__._bindTrigger.call(this, $t);
      return $t.on(this._evt('truemouseleave'), function(evt) {
        return _this._offsetStart = null;
      });
    };

    SnapTip.prototype.onShow = function(triggerChanged, evt) {
      if (triggerChanged === true) {
        return this.$tip.css('visibility', 'hidden');
      }
    };

    SnapTip.prototype.afterShow = function(triggerChanged, evt) {
      if (triggerChanged === true) {
        this.$tip.css('visibility', 'visible');
        return this._offsetStart = {
          top: evt.pageY,
          left: evt.pageX
        };
      }
    };

    SnapTip.prototype.offsetOnTriggerMouseMove = function(evt, offset, $t) {
      var newOffset;
      newOffset = _.clone(offset);
      if (this.o.snap.toTrigger === true) {
        newOffset = this._moveToTrigger($t, newOffset);
      } else {
        if (this.o.snap.toXAxis === true) {
          newOffset.top = this._offsetStart.top;
          this._log(this._nsLog, 'xSnap');
        }
        if (this.o.snap.toYAxis === true) {
          newOffset.left = this._offsetStart.left;
          this._log(this._nsLog, 'ySnap');
        }
      }
      return newOffset;
    };

    return SnapTip;

  })(Tip);

  $.fn.tip = ns.createPlugin(ns.tip, Tip, true);

  $.fn.snapTip = ns.createPlugin(ns.snapTip, SnapTip, true);

}).call(this);
