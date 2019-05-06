import Popper$1 from 'popper.js';
import { ResizeObserver } from 'vue-resize';
import Vue from 'vue';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function assign(to, from) {
  debugger;

  for (var key in from) {
    if (Object.prototype.hasOwnProperty.call(from, key)) {
      if (_typeof(from[key]) === 'object' && to[key]) {
        assign(to[key], from[key]);
      } else {
        to[key] = from[key];
      }
    }
  }
}

var config = {
  // Disable popper components
  disabled: false,
  // Default position offset (px)
  offset: 0,
  // Default container where the tooltip will be appended
  container: 'body',
  // Element used to compute position and size boundaries
  boundariesElement: undefined,
  // Auto destroy tooltip DOM nodes (ms)
  disposeTimeout: 5000,
  // Close tooltip on click on popper target?
  hideOnTargetClick: false,
  // Options passed to Popper constructor
  popperOptions: {},
  // Themes
  themes: {
    tooltip: {
      // Default tooltip placement relative to target element
      placement: 'top',
      // Delay (ms)
      delay: {
        show: 200,
        hide: 0
      },
      // Default events that trigger the tooltip
      trigger: 'hover focus',
      // Update popper on content resize
      handleResize: false,
      // Close tooltip on click on tooltip target?
      hideOnTargetClick: true,
      // Enable HTML content in directive
      contentHtml: true,
      // Displayed when tooltip content is loading
      loadingContent: '...'
    },
    dropdown: {
      // Default dropdown placement relative to target element
      placement: 'bottom',
      // Delay (ms)
      delay: 0,
      // Default events that trigger the dropdown
      trigger: 'click',
      // Update popper on content resize
      handleResize: true,
      // Hide on clock outside
      autoHide: true
    }
  }
  /**
   * Get default config value depending on theme
   */

};
function getDefaultConfig(theme, key) {
  var themeConfig = config.themes[theme] || {};
  var value;

  do {
    value = themeConfig[key];

    if (typeof value === 'undefined') {
      // Support theme extend
      if (themeConfig.$extend) {
        themeConfig = config.themes[themeConfig.$extend] || {};
      } else {
        // Base config
        themeConfig = null;
        value = config[key];
      }
    } else {
      themeConfig = null;
    }
  } while (themeConfig);

  return value;
}
/**
 * Theme CSS inheritance
 */

function getThemeClasses(theme) {
  var result = [theme];
  var themeConfig = config.themes[theme] || {};

  do {
    // Support theme extend
    if (themeConfig.$extend && !themeConfig.$resetCss) {
      result.push(themeConfig.$extend);
      themeConfig = config.themes[themeConfig.$extend] || {};
    } else {
      themeConfig = null;
    }
  } while (themeConfig);

  return result.map(function (c) {
    return "v-popper--theme-".concat(c);
  });
}

var supportsPassive = false;

if (typeof window !== 'undefined') {
  supportsPassive = false;

  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
      }
    });
    window.addEventListener('test', null, opts);
  } catch (e) {}
}

// Possible Popper.js positions
var placement = ['auto', 'auto-start', 'auto-end', 'top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'];

var isIOS = false;

if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
  isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

var openPoppers = [];

var Element = function Element() {};

if (typeof window !== 'undefined') {
  Element = window.Element;
}

var script = {
  name: 'VPopper',
  props: {
    theme: {
      type: String,
      required: true
    },
    targetNode: {
      type: Function,
      required: true
    },
    popperNode: {
      type: Function,
      required: true
    },
    arrowNode: {
      type: Function,
      default: null
    },
    open: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: function _default() {
        return getDefaultConfig(this.theme, 'disabled');
      }
    },
    placement: {
      type: String,
      default: function _default() {
        return getDefaultConfig(this.theme, 'placement');
      },
      validator: function validator(value) {
        return placement.includes(value);
      }
    },
    delay: {
      type: [String, Number, Object],
      default: function _default() {
        return getDefaultConfig(this.theme, 'delay');
      }
    },
    offset: {
      type: [String, Number],
      default: function _default() {
        return getDefaultConfig(this.theme, 'offset');
      }
    },
    trigger: {
      type: String,
      default: function _default() {
        return getDefaultConfig(this.theme, 'trigger');
      }
    },
    container: {
      type: [String, Object, Element, Boolean],
      default: function _default() {
        return getDefaultConfig(this.theme, 'container');
      }
    },
    boundariesElement: {
      type: [String, Element],
      default: function _default() {
        return getDefaultConfig(this.theme, 'boundariesElement');
      }
    },
    popperOptions: {
      type: Object,
      default: function _default() {
        return getDefaultConfig(this.theme, 'popperOptions');
      }
    },
    autoHide: {
      type: Boolean,
      default: function _default() {
        return getDefaultConfig(this.theme, 'autoHide');
      }
    },
    handleResize: {
      type: Boolean,
      default: function _default() {
        return getDefaultConfig(this.theme, 'handleResize');
      }
    },
    hideOnTargetClick: {
      type: Boolean,
      default: function _default() {
        return getDefaultConfig(this.theme, 'hideOnTargetClick');
      }
    },
    openGroup: {
      type: String,
      default: null
    }
  },
  data: function data() {
    return {
      isOpen: false
    };
  },
  watch: {
    open: '$_autoShowHide',
    disabled: '$_autoShowHide',
    container: function container(val) {
      if (this.isOpen && this.popperInstance) {
        var container = this.$_findContainer(this.container, this.$_targetNode);

        if (!container) {
          console.warn('No container for popover', this);
          return;
        }

        container.appendChild(this.$_popperNode);
        this.popperInstance.scheduleUpdate();
      }
    },
    trigger: function trigger(val) {
      this.$_removeEventListeners();
      this.$_addEventListeners();
    },
    placement: function placement(val) {
      var _this = this;

      this.$_updatePopper(function () {
        _this.popperInstance.options.placement = val;
      });
    },
    offset: '$_restartPopper',
    boundariesElement: '$_restartPopper',
    popperOptions: {
      handler: '$_restartPopper',
      deep: true
    }
  },
  created: function created() {
    this.popperId = "popper_".concat(Math.random().toString(36).substr(2, 10));
    this.$_isDisposed = false;
    this.$_mounted = false;
    this.$_events = [];
    this.$_preventOpen = false;
  },
  mounted: function mounted() {
    // Nodes
    this.$_targetNode = this.targetNode();
    this.$_popperNode = this.popperNode();
    swapAttrs(this.$_targetNode, 'title', 'data-original-title');
    this.$_detachPopperNode();
    this.$_init();

    if (this.open) {
      this.show();
    }
  },
  activated: function activated() {
    this.$_autoShowHide();
  },
  deactivated: function deactivated() {
    this.hide();
  },
  beforeDestroy: function beforeDestroy() {
    this.dispose();
  },
  methods: {
    show: function show() {
      var _this2 = this;

      var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          event = _ref.event,
          _ref$skipDelay = _ref.skipDelay,
          _ref$force = _ref.force,
          force = _ref$force === void 0 ? false : _ref$force;

      if (force || !this.disabled) {
        this.$_scheduleShow(event);
        this.$emit('show');
      }

      this.$emit('update:open', true);
      this.$_beingShowed = true;
      requestAnimationFrame(function () {
        _this2.$_beingShowed = false;
      });
    },
    hide: function hide() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          event = _ref2.event,
          _ref2$skipDelay = _ref2.skipDelay;

      this.$_scheduleHide(event);
      this.$emit('hide');
      this.$emit('update:open', false);
    },
    dispose: function dispose() {
      this.$_removeFromOpenPoppers();
      this.$_isDisposed = true;
      this.$_removeEventListeners();
      this.hide({
        skipDelay: true
      });

      if (this.popperInstance) {
        this.popperInstance.destroy(); // destroy tooltipNode if removeOnDestroy is not set, as popperInstance.destroy() already removes the element

        if (!this.popperInstance.options.removeOnDestroy) {
          this.$_detachPopperNode();
        }
      }

      this.$_mounted = false;
      this.popperInstance = null;
      this.isOpen = false;
      swapAttrs(this.$_targetNode, 'data-original-title', 'title');
      this.$emit('dispose');
    },
    onResize: function onResize() {
      if (this.isOpen && this.popperInstance) {
        this.popperInstance.scheduleUpdate();
        this.$emit('resize');
      }
    },
    $_init: function $_init() {
      if (this.trigger.indexOf('manual') === -1) {
        this.$_addEventListeners();
      }
    },
    $_autoShowHide: function $_autoShowHide() {
      if (this.open) {
        this.show();
      } else {
        this.hide();
      }
    },
    $_show: function $_show() {
      var _this3 = this;

      clearTimeout(this.$_disposeTimer); // Already open

      if (this.isOpen) {
        return;
      } // Popper is already initialized


      if (this.popperInstance) {
        this.isOpen = true;
        this.popperInstance.enableEventListeners();
        this.popperInstance.scheduleUpdate();
      }

      if (!this.$_mounted) {
        var container = this.$_findContainer(this.container, this.$_targetNode);

        if (!container) {
          console.warn('No container for popover', this);
          return;
        }

        container.appendChild(this.$_popperNode);
        this.$_mounted = true;
      }

      if (!this.popperInstance) {
        var popperOptions = _objectSpread({}, this.popperOptions, {
          placement: this.placement
        });

        popperOptions.modifiers = _objectSpread({}, popperOptions.modifiers, {
          arrow: _objectSpread({}, popperOptions.modifiers && popperOptions.modifiers.arrow, {
            element: this.arrowNode && this.arrowNode() || '[x-arrow]'
          })
        });

        if (this.offset) {
          var offset = this.$_getOffset();
          popperOptions.modifiers.offset = _objectSpread({}, popperOptions.modifiers && popperOptions.modifiers.offset, {
            offset: offset
          });
        }

        if (this.boundariesElement) {
          popperOptions.modifiers.preventOverflow = _objectSpread({}, popperOptions.modifiers && popperOptions.modifiers.preventOverflow, {
            boundariesElement: this.boundariesElement
          });
        }

        this.popperInstance = new Popper$1(this.$_targetNode, this.$_popperNode, popperOptions); // Fix position

        requestAnimationFrame(function () {
          if (_this3.hidden) {
            _this3.hidden = false;

            _this3.$_hide();

            return;
          }

          if (!_this3.$_isDisposed && _this3.popperInstance) {
            _this3.popperInstance.scheduleUpdate(); // Show the tooltip


            requestAnimationFrame(function () {
              if (_this3.hidden) {
                _this3.hidden = false;

                _this3.$_hide();

                return;
              }

              if (!_this3.$_isDisposed) {
                _this3.isOpen = true;
              } else {
                _this3.dispose();
              }
            });
          } else {
            _this3.dispose();
          }
        });
      }

      var openGroup = this.openGroup;

      if (openGroup) {
        var popover;

        for (var i = 0; i < openPoppers.length; i++) {
          popover = openPoppers[i];

          if (popover.openGroup !== openGroup) {
            popover.hide();
            popover.$emit('close-group');
          }
        }
      }

      openPoppers.push(this);
      this.$emit('apply-show');
    },
    $_hide: function $_hide() {
      var _this4 = this;

      // Already hidden
      if (!this.isOpen) {
        return;
      }

      this.$_removeFromOpenPoppers();
      this.isOpen = false;

      if (this.popperInstance) {
        this.popperInstance.disableEventListeners();
      }

      clearTimeout(this.$_disposeTimer);
      var disposeTime = getDefaultConfig(this.theme, 'disposeTimeout');

      if (disposeTime !== null) {
        this.$_disposeTimer = setTimeout(function () {
          if (_this4.$_popperNode) {
            // Don't remove popper instance, just the HTML element
            _this4.$_detachPopperNode();

            _this4.$_mounted = false;
          }
        }, disposeTime);
      }

      this.$emit('apply-hide');
    },
    $_findContainer: function $_findContainer(container, reference) {
      // if container is a query, get the relative element
      if (typeof container === 'string') {
        container = window.document.querySelector(container);
      } else if (container === false) {
        // if container is `false`, set it to reference parent
        container = reference.parentNode;
      }

      return container;
    },
    $_getOffset: function $_getOffset() {
      var typeofOffset = _typeof(this.offset);

      var offset = this.offset; // One value -> switch

      if (typeofOffset === 'number' || typeofOffset === 'string' && offset.indexOf(',') === -1) {
        offset = "0, ".concat(offset);
      }

      return offset;
    },
    $_addEventListeners: function $_addEventListeners() {
      var _this5 = this;

      var events = typeof this.trigger === 'string' ? this.trigger.split(' ').filter(function (trigger) {
        return ['click', 'hover', 'focus'].indexOf(trigger) !== -1;
      }) : [];

      var addEvent = function addEvent(event, handler) {
        _this5.$_events.push({
          event: event,
          handler: handler
        });

        _this5.$_targetNode.addEventListener(event, handler);
      };

      var handleShow = function handleShow(event) {
        if (_this5.isOpen) {
          return;
        }

        event.usedByTooltip = true;
        !_this5.$_preventOpen && _this5.show({
          event: event
        });
        _this5.hidden = false;
      };

      var handleHide = function handleHide(event) {
        if (event.usedByTooltip) {
          return;
        }

        _this5.hide({
          event: event
        });

        _this5.hidden = true;
      };

      events.forEach(function (event) {
        switch (event) {
          case 'hover':
            addEvent('mouseenter', handleShow);
            addEvent('mouseleave', handleHide);
            break;

          case 'focus':
            addEvent('focus', handleShow);
            addEvent('blur', handleHide);
            break;

          case 'click':
            addEvent('click', handleShow);
            addEvent('click', handleHide);
            break;
        }
      });
    },
    $_removeEventListeners: function $_removeEventListeners() {
      var _this6 = this;

      this.$_events.forEach(function (_ref3) {
        var event = _ref3.event,
            handler = _ref3.handler;

        _this6.$_targetNode.removeEventListener(event, handler);
      });
      this.$_events = [];
    },
    $_scheduleShow: function $_scheduleShow() {
      var skipDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      clearTimeout(this.$_scheduleTimer);

      if (skipDelay) {
        this.$_show();
      } else {
        // defaults to 0
        var computedDelay = parseInt(this.delay && this.delay.show || this.delay || 0);
        this.$_scheduleTimer = setTimeout(this.$_show.bind(this), computedDelay);
      }
    },
    $_scheduleHide: function $_scheduleHide() {
      var _this7 = this;

      var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var skipDelay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      clearTimeout(this.$_scheduleTimer);

      if (skipDelay) {
        this.$_hide();
      } else {
        // defaults to 0
        var computedDelay = parseInt(this.delay && this.delay.hide || this.delay || 0);
        this.$_scheduleTimer = setTimeout(function () {
          if (!_this7.isOpen) {
            return;
          } // if we are hiding because of a mouseleave, we must check that the new
          // reference isn't the tooltip, because in this case we don't want to hide it


          if (event && event.type === 'mouseleave') {
            var isSet = _this7.$_setTooltipNodeEvent(event); // if we set the new event, don't hide the tooltip yet
            // the new event will take care to hide it if necessary


            if (isSet) {
              return;
            }
          }

          _this7.$_hide();
        }, computedDelay);
      }
    },
    $_setTooltipNodeEvent: function $_setTooltipNodeEvent(event) {
      var _this8 = this;

      var relatedreference = event.relatedreference || event.toElement || event.relatedTarget;

      var callback = function callback(event2) {
        var relatedreference2 = event2.relatedreference || event2.toElement || event2.relatedTarget; // Remove event listener after call

        _this8.$_popperNode.removeEventListener(event.type, callback); // If the new reference is not the reference element


        if (!_this8.$_targetNode.contains(relatedreference2)) {
          // Schedule to hide tooltip
          _this8.hide({
            event: event2
          });
        }
      };

      if (this.$_popperNode.contains(relatedreference)) {
        // listen to mouseleave on the tooltip element to be able to hide the tooltip
        this.$_popperNode.addEventListener(event.type, callback);
        return true;
      }

      return false;
    },
    $_updatePopper: function $_updatePopper(cb) {
      if (this.popperInstance) {
        cb();
        if (this.isOpen) this.popperInstance.scheduleUpdate();
      }
    },
    $_restartPopper: function $_restartPopper() {
      if (this.popperInstance) {
        var isOpen = this.isOpen;
        this.dispose();
        this.$_isDisposed = false;
        this.$_init();

        if (isOpen) {
          this.show({
            skipDelay: true,
            force: true
          });
        }
      }
    },
    $_handleGlobalClose: function $_handleGlobalClose(event) {
      var _this9 = this;

      var touch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      if (this.$_beingShowed) return;
      this.hide({
        event: event
      });

      if (event.closePopover) {
        this.$emit('close-directive');
      } else {
        this.$emit('auto-hide');
      }

      if (touch) {
        this.$_preventOpen = true;
        setTimeout(function () {
          _this9.$_preventOpen = false;
        }, 300);
      }
    },
    $_detachPopperNode: function $_detachPopperNode() {
      this.$_popperNode.parentNode && this.$_popperNode.parentNode.removeChild(this.$_popperNode);
    },
    $_removeFromOpenPoppers: function $_removeFromOpenPoppers() {
      var index = openPoppers.indexOf(this);

      if (index !== -1) {
        openPoppers.splice(index, 1);
      }
    }
  },
  render: function render(h) {
    return this.$scopedSlots.default(this)[0];
  }
};

if (typeof document !== 'undefined' && typeof window !== 'undefined') {
  if (isIOS) {
    document.addEventListener('touchend', handleGlobalTouchend, supportsPassive ? {
      passive: true,
      capture: true
    } : true);
  } else {
    window.addEventListener('click', handleGlobalClick, true);
  }
}

function handleGlobalClick(event) {
  handleGlobalClose(event);
}

function handleGlobalTouchend(event) {
  handleGlobalClose(event, true);
}

function handleGlobalClose(event) {
  var touch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var _loop = function _loop(i) {
    var popper = openPoppers[i];
    var popperContent = popper.popperNode();
    var contains = popperContent.contains(event.target);
    requestAnimationFrame(function () {
      if (event.closeAllPopover || event.closePopover && contains || popper.autoHide && !contains) {
        popper.$_handleGlobalClose(event, touch);
      }
    });
  };

  // Delay so that close directive has time to set values
  for (var i = 0; i < openPoppers.length; i++) {
    _loop(i);
  }
}

function swapAttrs(node, attrFrom, attrTo) {
  var value = node.getAttribute(attrFrom);

  if (typeof value !== 'undefined') {
    node.removeAttribute(attrFrom);
    node.setAttribute(attrTo, value);
  }
}

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

/* script */
const __vue_script__ = script;

/* template */

  /* style */
  const __vue_inject_styles__ = undefined;
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PrivatePopper = normalizeComponent_1(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    undefined,
    undefined
  );

var PrivateThemeClass = {
  computed: {
    themeClass: function themeClass() {
      return getThemeClasses(this.theme);
    }
  }
};

//
var script$1 = {
  name: 'VPopperContent',
  components: {
    ResizeObserver: ResizeObserver
  },
  mixins: [PrivateThemeClass],
  props: {
    popperId: String,
    theme: String,
    isOpen: Boolean,
    autoHide: Boolean,
    handleResize: Boolean
  }
};

/* script */
const __vue_script__$1 = script$1;
/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    {
      ref: "popover",
      staticClass: "v-popper__popper",
      class: [
        _vm.themeClass,
        {
          "v-popper__popper--open": _vm.isOpen
        }
      ],
      attrs: {
        id: _vm.popperId,
        "aria-hidden": _vm.isOpen ? "false" : "true",
        tabindex: _vm.autoHide ? 0 : undefined
      },
      on: {
        keyup: function($event) {
          if (
            !$event.type.indexOf("key") &&
            _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])
          ) {
            return null
          }
          _vm.autoHide && _vm.$emit("hide");
        }
      }
    },
    [
      _c("div", { staticClass: "v-popper__wrapper" }, [
        _c(
          "div",
          {
            ref: "inner",
            staticClass: "v-popper__inner",
            staticStyle: { position: "relative" }
          },
          [
            _c("div", [_vm._t("default")], 2),
            _vm._v(" "),
            _vm.handleResize
              ? _c("ResizeObserver", {
                  on: {
                    notify: function($event) {
                      return _vm.$emit("resize", $event)
                    }
                  }
                })
              : _vm._e()
          ],
          1
        ),
        _vm._v(" "),
        _c("div", { ref: "arrow", staticClass: "v-popper__arrow" })
      ])
    ]
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PrivatePopperContent = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

// @vue/component
var PrivatePopperMethods = {
  methods: {
    show: function show() {
      var _this$$refs$popper;

      return (_this$$refs$popper = this.$refs.popper).show.apply(_this$$refs$popper, arguments);
    },
    hide: function hide() {
      var _this$$refs$popper2;

      return (_this$$refs$popper2 = this.$refs.popper).hide.apply(_this$$refs$popper2, arguments);
    },
    dispose: function dispose() {
      var _this$$refs$popper3;

      return (_this$$refs$popper3 = this.$refs.popper).dispose.apply(_this$$refs$popper3, arguments);
    },
    onResize: function onResize() {
      var _this$$refs$popper4;

      return (_this$$refs$popper4 = this.$refs.popper).onResize.apply(_this$$refs$popper4, arguments);
    }
  }
};

//
var script$2 = {
  name: 'VPopperWrapper',
  components: {
    Popper: PrivatePopper,
    PopperContent: PrivatePopperContent
  },
  mixins: [PrivatePopperMethods, PrivateThemeClass],
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default: function _default() {
        return this.$options.vPopperTheme;
      }
    }
  }
};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "Popper",
    _vm._g(
      _vm._b(
        {
          ref: "popper",
          attrs: {
            theme: _vm.theme,
            "target-node": function() {
              return _vm.$refs.trigger
            },
            "popper-node": function() {
              return _vm.$refs.popperContent.$el
            },
            "arrow-node": function() {
              return _vm.$refs.popperContent.$refs.arrow
            }
          },
          scopedSlots: _vm._u(
            [
              {
                key: "default",
                fn: function(ref) {
                  var popperId = ref.popperId;
                  var isOpen = ref.isOpen;
                  var trigger = ref.trigger;
                  var autoHide = ref.autoHide;
                  var hide = ref.hide;
                  var handleResize = ref.handleResize;
                  var onResize = ref.onResize;
                  return [
                    _c(
                      "div",
                      {
                        staticClass: "v-popper",
                        class: [
                          _vm.themeClass,
                          {
                            "v-popper--open": isOpen
                          }
                        ]
                      },
                      [
                        _c(
                          "div",
                          {
                            ref: "trigger",
                            staticClass: "v-popper__trigger",
                            staticStyle: { display: "inline-block" },
                            attrs: {
                              "aria-describedby": popperId,
                              tabindex:
                                trigger.indexOf("focus") !== -1 ? 0 : undefined
                            }
                          },
                          [_vm._t("default")],
                          2
                        ),
                        _vm._v(" "),
                        _c(
                          "PopperContent",
                          {
                            ref: "popperContent",
                            attrs: {
                              "popper-id": popperId,
                              theme: _vm.theme,
                              "is-open": isOpen,
                              "auto-hide": autoHide,
                              "handle-resize": handleResize
                            },
                            on: { hide: hide, resize: onResize }
                          },
                          [_vm._t("popper")],
                          2
                        )
                      ],
                      1
                    )
                  ]
                }
              }
            ],
            null,
            true
          )
        },
        "Popper",
        _vm.$attrs,
        false
      ),
      _vm.$listeners
    )
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PrivatePopperWrapper = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

var script$3 = _objectSpread({}, PrivatePopperWrapper, {
  name: 'VDropdown',
  vPopperTheme: 'dropdown'
});

/* script */
const __vue_script__$3 = script$3;
/* template */

  /* style */
  const __vue_inject_styles__$3 = undefined;
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PrivateDropdown = normalizeComponent_1(
    {},
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    undefined,
    undefined
  );

var script$4 = _objectSpread({}, PrivatePopperWrapper, {
  name: 'VTooltip',
  vPopperTheme: 'tooltip'
});

/* script */
const __vue_script__$4 = script$4;
/* template */

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PrivateTooltip = normalizeComponent_1(
    {},
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

//
var script$5 = {
  name: 'VTooltipDirective',
  components: {
    Popper: PrivatePopper,
    PopperContent: PrivatePopperContent
  },
  mixins: [PrivatePopperMethods],
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default: 'tooltip'
    },
    contentHtml: {
      type: Boolean,
      default: function _default() {
        return getDefaultConfig(this.theme, 'contentHtml');
      }
    },
    content: {
      type: [String, Number, Function],
      default: null
    },
    loadingContent: {
      type: String,
      default: function _default() {
        return getDefaultConfig(this.theme, 'loadingContent');
      }
    }
  },
  data: function data() {
    return {
      asyncContent: null
    };
  },
  computed: {
    isContentAsync: function isContentAsync() {
      return typeof this.content === 'function';
    },
    loading: function loading() {
      return this.isContentAsync && this.asyncContent == null;
    },
    finalContent: function finalContent() {
      if (this.isContentAsync) {
        return this.loading ? this.loadingContent : this.asyncContent;
      }

      return this.content;
    }
  },
  watch: {
    content: {
      handler: function handler() {
        this.fetchContent(true);
      },
      immediate: true
    },
    finalContent: function finalContent(value) {
      var _this = this;

      this.$nextTick(function () {
        _this.$refs.popper.onResize();
      });
    }
  },
  created: function created() {
    this.$_fetchId = 0;
  },
  methods: {
    fetchContent: function fetchContent(force) {
      var _this2 = this;

      if (typeof this.content === 'function' && this.$_isOpen && (force || !this.$_loading && this.asyncContent == null)) {
        this.asyncContent = null;
        this.$_loading = true;
        var fetchId = ++this.$_fetchId;
        var result = this.content(this);

        if (result.then) {
          result.then(function (res) {
            return _this2.onResult(fetchId, res);
          });
        } else {
          this.onResult(fetchId, result);
        }
      }
    },
    onResult: function onResult(fetchId, result) {
      if (fetchId !== this.$_fetchId) return;
      this.$_loading = false;
      this.asyncContent = result;
    },
    onShow: function onShow() {
      this.$_isOpen = true;
      this.fetchContent();
    },
    onHide: function onHide() {
      this.$_isOpen = false;
    }
  }
};

/* script */
const __vue_script__$5 = script$5;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "Popper",
    _vm._g(
      _vm._b(
        {
          ref: "popper",
          attrs: {
            theme: _vm.theme,
            "popper-node": function() {
              return _vm.$refs.popperContent.$el
            },
            "arrow-node": function() {
              return _vm.$refs.popperContent.$refs.arrow
            }
          },
          on: { "apply-show": _vm.onShow, "apply-hide": _vm.onHide },
          scopedSlots: _vm._u([
            {
              key: "default",
              fn: function(ref) {
                var popperId = ref.popperId;
                var isOpen = ref.isOpen;
                var autoHide = ref.autoHide;
                var hide = ref.hide;
                var handleResize = ref.handleResize;
                var onResize = ref.onResize;
                return [
                  _c(
                    "PopperContent",
                    {
                      ref: "popperContent",
                      class: {
                        "v-popper--tooltip-loading": _vm.loading
                      },
                      attrs: {
                        "popper-id": popperId,
                        theme: _vm.theme,
                        "is-open": isOpen,
                        "auto-hide": autoHide,
                        "handle-resize": handleResize
                      },
                      on: { hide: hide, resize: onResize }
                    },
                    [
                      _vm.contentHtml
                        ? _c("div", {
                            domProps: { innerHTML: _vm._s(_vm.finalContent) }
                          })
                        : _c("div", {
                            domProps: { textContent: _vm._s(_vm.finalContent) }
                          })
                    ]
                  )
                ]
              }
            }
          ])
        },
        "Popper",
        _vm.$attrs,
        false
      ),
      _vm.$listeners
    )
  )
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var PrivateTooltipDirective = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
    undefined
  );

var TARGET_CLASS = "v-popper--has-tooltip";
/**
 * Support placement as directive modifier
 */

function getPlacement(options, modifiers) {
  var result = options.placement;

  if (!result && modifiers) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = placement[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var pos = _step.value;

        if (modifiers[pos]) {
          result = pos;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  }

  if (!result) {
    result = getDefaultConfig(options.theme || 'tooltip', 'placement');
  }

  return result;
}
function getOptions(el, value, modifiers) {
  var options;

  var type = _typeof(value);

  if (type === 'string') {
    options = {
      content: value
    };
  } else if (value && type === 'object') {
    options = value;
  } else {
    options = {
      content: false
    };
  }

  options.placement = getPlacement(options, modifiers);

  options.targetNode = function () {
    return el;
  };

  return options;
}
function createTooltip(el, value, modifiers) {
  var options = getOptions(el, value, modifiers);
  var tooltipApp = el.$_popper = new Vue({
    data: {
      options: options
    },
    render: function render(h) {
      var options = this.options;
      return h(PrivateTooltipDirective, {
        attrs: _objectSpread({}, options, {
          // Delete props from attrs to prevent Vue from
          // mutating `this.options` when removing props
          // from `$attrs` automatically
          theme: undefined,
          contentHtml: undefined,
          content: undefined,
          loadingContent: undefined
        }),
        props: options,
        ref: 'tooltip'
      });
    }
  });
  var mountTarget = document.createElement('div');
  document.body.appendChild(mountTarget);
  tooltipApp.$mount(mountTarget); // Class on target

  if (el.classList) {
    el.classList.add(TARGET_CLASS);
  }

  return tooltipApp;
}
function destroyTooltip(el) {
  if (el.$_popper) {
    el.$_popper.$destroy();
    delete el.$_popper;
    delete el.$_popperOldOpen;
  }

  if (el.classList) {
    el.classList.remove(TARGET_CLASS);
  }
}
function bind(el, _ref) {
  var value = _ref.value,
      oldValue = _ref.oldValue,
      modifiers = _ref.modifiers;
  var options = getOptions(el, value, modifiers);

  if (!options.content || getDefaultConfig(options.theme || 'tooltip', 'disabled')) {
    destroyTooltip(el);
  } else {
    var tooltipApp;

    if (el.$_popper) {
      tooltipApp = el.$_popper;
      tooltipApp.options = options;
    } else {
      tooltipApp = createTooltip(el, value, modifiers);
    } // Manual show


    if (typeof value.open !== 'undefined' && value.open !== el.$_popperOldOpen) {
      el.$_popperOldOpen = value.open;
      value.open ? tooltipApp.$refs.tooltip.show() : tooltipApp.$refs.tooltip.hide();
    }
  }
}
var PrivateVTooltip = {
  bind: bind,
  update: bind,
  unbind: function unbind(el) {
    destroyTooltip(el);
  }
};

function addListeners(el) {
  el.addEventListener('click', onClick);
  el.addEventListener('touchstart', onTouchStart, supportsPassive ? {
    passive: true
  } : false);
}

function removeListeners(el) {
  el.removeEventListener('click', onClick);
  el.removeEventListener('touchstart', onTouchStart);
  el.removeEventListener('touchend', onTouchEnd);
  el.removeEventListener('touchcancel', onTouchCancel);
}

function onClick(event) {
  var el = event.currentTarget;
  event.closePopover = !el.$_vclosepopover_touch;
  event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all;
}

function onTouchStart(event) {
  if (event.changedTouches.length === 1) {
    var el = event.currentTarget;
    el.$_vclosepopover_touch = true;
    var touch = event.changedTouches[0];
    el.$_vclosepopover_touchPoint = touch;
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchCancel);
  }
}

function onTouchEnd(event) {
  var el = event.currentTarget;
  el.$_vclosepopover_touch = false;

  if (event.changedTouches.length === 1) {
    var touch = event.changedTouches[0];
    var firstTouch = el.$_vclosepopover_touchPoint;
    event.closePopover = Math.abs(touch.screenY - firstTouch.screenY) < 20 && Math.abs(touch.screenX - firstTouch.screenX) < 20;
    event.closeAllPopover = el.$_closePopoverModifiers && !!el.$_closePopoverModifiers.all;
  }
}

function onTouchCancel(event) {
  var el = event.currentTarget;
  el.$_vclosepopover_touch = false;
}

var PrivateVClosePopper = {
  bind: function bind(el, _ref) {
    var value = _ref.value,
        modifiers = _ref.modifiers;
    el.$_closePopoverModifiers = modifiers;

    if (typeof value === 'undefined' || value) {
      addListeners(el);
    }
  },
  update: function update(el, _ref2) {
    var value = _ref2.value,
        oldValue = _ref2.oldValue,
        modifiers = _ref2.modifiers;
    el.$_closePopoverModifiers = modifiers;

    if (value !== oldValue) {
      if (typeof value === 'undefined' || value) {
        addListeners(el);
      } else {
        removeListeners(el);
      }
    }
  },
  unbind: function unbind(el) {
    removeListeners(el);
  }
};

/* Exports */

var options = config; // Directive

var VTooltip = PrivateVTooltip;
var VClosePopper = PrivateVClosePopper; // Components

var Dropdown = PrivateDropdown;
var Popper = PrivatePopper;
var PopperContent = PrivatePopperContent;
var PopperMethods = PrivatePopperMethods;
var PopperWrapper = PrivatePopperWrapper;
var ThemeClass = PrivateThemeClass;
var Tooltip = PrivateTooltip;
var TooltipDirective = PrivateTooltipDirective;
/* Vue plugin */

function install(Vue) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  if (install.installed) return;
  install.installed = true;
  assign(config, options); // Directive

  Vue.directive('tooltip', PrivateVTooltip);
  Vue.directive('close-popper', PrivateVClosePopper); // Components

  Vue.component('v-dropdown', PrivateDropdown);
  Vue.component('VDropdown', PrivateDropdown);
  Vue.component('v-tooltip', PrivateTooltip);
  Vue.component('VTooltip', PrivateTooltip);
}
var plugin = {
  install: install,
  options: config // Auto-install

};
var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default plugin;
export { Dropdown, Popper, PopperContent, PopperMethods, PopperWrapper, ThemeClass, Tooltip, TooltipDirective, VClosePopper, VTooltip, createTooltip, destroyTooltip, install, options };
