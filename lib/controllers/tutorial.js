// Generated by CoffeeScript 1.3.3
(function() {
  var $, Dialog, Tutorial,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty;

  $ = require('jqueryify');

  Dialog = require('../dialog');

  Tutorial = (function() {

    Tutorial.prototype.steps = null;

    Tutorial.prototype.hashMatch = null;

    Tutorial.prototype.dialog = null;

    Tutorial.prototype.current = -1;

    function Tutorial(_arg) {
      var _ref, _ref1;
      this.hashMatch = _arg.hashMatch, this.steps = _arg.steps;
      this.onHashChange = __bind(this.onHashChange, this);

      this.end = __bind(this.end, this);

      this.next = __bind(this.next, this);

      this.start = __bind(this.start, this);

      if ((_ref = this.steps) == null) {
        this.steps = [];
      }
      if ((_ref1 = this.dialog) == null) {
        this.dialog = new Dialog({
          content: '',
          buttons: [
            {
              'Continue': null
            }
          ]
        });
      }
      this.dialog.buttons[0].el.off('click');
      this.dialog.buttons[0].el.on('click', this.next);
      this.dialog.el.css({
        height: 0,
        position: 'static',
        width: 0
      });
      this.dialog.el.addClass('tutorial');
      this.dialog.el.addClass('popup');
      if (this.hashMatch) {
        $(window).on('hashchange', this.onHashChange);
      }
    }

    Tutorial.prototype.start = function() {
      var _ref;
      if ((_ref = this.steps[this.current]) != null) {
        _ref.leave(this);
      }
      this.current = -1;
      this.next();
      this.dialog.open();
      return this.onHashChange();
    };

    Tutorial.prototype.next = function() {
      var _ref;
      if ((_ref = this.steps[this.current]) != null) {
        _ref.leave(this);
      }
      this.current += 1;
      if (this.steps[this.current]) {
        return this.steps[this.current].enter(this);
      } else {
        return this.end();
      }
    };

    Tutorial.prototype.end = function() {
      var _ref;
      if ((_ref = this.steps[this.current]) != null) {
        _ref.leave(this);
      }
      this.current = -1;
      return this.dialog.close();
    };

    Tutorial.prototype.onHashChange = function() {
      var _this = this;
      return setTimeout(function() {
        var _ref;
        if (!_this.dialog.el.hasClass('open')) {
          return;
        }
        if (location.hash.match(_this.hashMatch)) {
          console.log('Showing tutorial after hash change');
          _this.dialog.el.css({
            display: ''
          });
          if ((_ref = _this.steps[_this.current]) != null ? _ref.attachment : void 0) {
            return _this.dialog.attach(_this.steps[_this.current].attachment);
          }
        } else {
          console.log('Hiding tutorial after hash change');
          return _this.dialog.el.css({
            display: 'none'
          });
        }
      });
    };

    return Tutorial;

  })();

  Tutorial.Step = (function() {

    Step.prototype.title = '';

    Step.prototype.content = '';

    Step.prototype.attachment = null;

    Step.prototype.block = '';

    Step.prototype.nextOn = null;

    Step.prototype.className = '';

    Step.prototype.style = null;

    Step.prototype.arrowDirection = '';

    Step.prototype.onEnter = null;

    Step.prototype.onLeave = null;

    Step.prototype.blockers = null;

    function Step(params) {
      var property, value;
      if (params == null) {
        params = {};
      }
      this.leave = __bind(this.leave, this);

      this.createBlockers = __bind(this.createBlockers, this);

      this.enter = __bind(this.enter, this);

      for (property in params) {
        if (!__hasProp.call(params, property)) continue;
        value = params[property];
        this[property] = value;
      }
    }

    Step.prototype.enter = function(tutorial) {
      var _ref,
        _this = this;
      if ((_ref = this.onEnter) != null) {
        _ref.call(this);
      }
      tutorial.dialog.el.find('header').html(this.title);
      tutorial.dialog.contentContainer.html(this.content);
      if (this.nextOn != null) {
        tutorial.dialog.el.addClass('next-on-action');
        setTimeout(function() {
          var eventName, selector, _ref1, _results;
          _ref1 = _this.nextOn;
          _results = [];
          for (eventName in _ref1) {
            selector = _ref1[eventName];
            _results.push($(document).one(eventName, "" + selector + ":not(:has('" + selector + "'))", tutorial.next));
          }
          return _results;
        });
      }
      if (this.className) {
        tutorial.dialog.el.addClass(this.className);
      }
      if (this.style) {
        tutorial.dialog.el.css(this.style);
      }
      return setTimeout((function() {
        if (_this.attachment) {
          tutorial.dialog.attach(_this.attachment);
        }
        return _this.createBlockers();
      }), this.delay);
    };

    Step.prototype.createBlockers = function() {
      var blocker, element, _i, _len, _ref, _results;
      this.blockers = $();
      _ref = $(this.block);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        element = $(element);
        blocker = $('<div class="tutorial-blocker"></div>');
        blocker.appendTo('body');
        this.blockers = this.blockers.add(blocker);
        blocker.css({
          position: 'absolute',
          zIndex: 999
        });
        blocker.width(element.outerWidth());
        blocker.height(element.outerHeight());
        _results.push(blocker.offset(element.offset()));
      }
      return _results;
    };

    Step.prototype.leave = function(tutorial) {
      var _ref;
      if ((_ref = this.onLeave) != null) {
        _ref.call(this);
      }
      if (this.nextOn) {
        tutorial.dialog.el.removeClass('next-on-action');
      }
      if (this.className) {
        tutorial.dialog.el.removeClass(this.className);
      }
      return this.blockers.remove();
    };

    return Step;

  })();

  module.exports = Tutorial;

}).call(this);
