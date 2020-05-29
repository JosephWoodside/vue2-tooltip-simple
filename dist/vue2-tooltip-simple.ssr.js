'use strict';Object.defineProperty(exports,'__esModule',{value:true});//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script = {
  props: {
    classes: {
      type: String,
      required: false,
      default: "primary"
    },
    elementId: {
      type: String,
      required: true
    },
    mode: {
      type: String,
      default: "hover"
    }
  },
  data: function data() {
    return {
      hidden: true,
      tooltipElement: null
    };
  },
  computed: {
    tooltipId: function tooltipId() {
      return "tooltip-".concat(this.elementId);
    },
    triangleId: function triangleId() {
      return "triangle-".concat(this.elementId);
    }
  },
  mounted: function mounted() {
    this.tooltipElement = document.getElementById(this.tooltipId);

    if (this.elementId.length !== 0) {
      this.mountListeners(this.elementId);
    }
  },
  methods: {
    handleMouseMove: function handleMouseMove(event) {
      var offset = this.getOffset();
      this.tooltipElement.style.left = event.clientX - offset.left + "px";
      this.tooltipElement.style.top = event.clientY - offset.top + "px";
      this.tooltipElement.style.position = "fixed";
    },
    handleHide: function handleHide() {
      this.hidden = true;
    },
    handleShow: function handleShow() {
      this.hidden = false;
    },
    handleClick: function handleClick() {
      this.hidden = !this.hidden;
      var offset = this.getElementPositionOffset();
      this.tooltipElement.style.left = offset.left + "px";
      this.tooltipElement.style.top = offset.top + "px";
      this.tooltipElement.style.position = "absolute";
    },
    getOffset: function getOffset() {
      return {
        left: this.tooltipElement.offsetWidth / 2 - 5,
        top: this.tooltipElement.offsetHeight + 20
      };
    },
    getElementPositionOffset: function getElementPositionOffset() {
      var element = document.getElementById(this.elementId);
      var elementRect = element.getBoundingClientRect();
      return {
        left: elementRect.left - elementRect.width / 2,
        top: elementRect.top + window.scrollY - elementRect.height * 1.65
      };
    },
    mountListeners: function mountListeners(id) {
      var _this = this;

      var element = document.getElementById(id);

      if (this.mode === "hover") {
        element.addEventListener("mouseenter", this.handleShow);
        element.addEventListener("mouseleave", this.handleHide);
        document.addEventListener("mousemove", function (e) {
          return _this.handleMouseMove(e);
        });
      } else if (this.mode === "click") {
        element.addEventListener("click", this.handleClick);
      }
    },
    unMountListeners: function unMountListeners(id) {
      var _this2 = this;

      this.hidden = true;
      var element = document.getElementById(id);

      if (this.mode === "hover") {
        element.removeEventListener("mouseenter", this.handleShow);
        element.removeEventListener("mouseleave", this.handleHide);
        document.removeEventListener("mousemove", function (e) {
          return _this2.handleMouseMove(e);
        });
      } else if (this.mode === "click") {
        element.removeEventListener("click", this.handleClick);
      }
    }
  },
  watch: {
    elementId: function elementId(newId, oldId) {
      if (oldId.length) {
        this.unMountListeners(oldId);
      }

      if (newId.length) {
        this.mountListeners(newId);
      }
    },
    mode: function mode(newMode, oldMode) {
      if (newMode !== oldMode) {
        this.unMountListeners(this.elementId);
        this.mountListeners(this.elementId);
      }
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group =  css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.hidden,
      expression: "!hidden"
    }],
    staticClass: "base-container",
    class: _vm.classes,
    attrs: {
      "id": _vm.tooltipId
    }
  }, [_vm._ssrNode("<div>", "</div>", [_vm._t("content")], 2), _vm._ssrNode(" <div" + _vm._ssrAttr("id", _vm.triangleId) + _vm._ssrClass(null, "triangle triangle__" + _vm.classes) + "></div>")], 2);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-5c2f1cfe_0", {
    source: ".base-container[data-v-5c2f1cfe]{position:fixed;z-index:10000;max-width:10rem;min-width:2rem;min-height:2rem;width:auto;border-radius:15px;display:flex;flex-direction:column;justify-content:center;align-items:center;border:1px solid transparent}.triangle[data-v-5c2f1cfe]{width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;margin-bottom:-10px;margin-left:-5px;position:relative}.triangle__primary[data-v-5c2f1cfe]{border-top:12px solid #cce5ff}.triangle__warning[data-v-5c2f1cfe]{border-top:12px solid #fff3cd}.triangle__info[data-v-5c2f1cfe]{border-top:12px solid #d1ecf1}.triangle__error[data-v-5c2f1cfe]{border-top:12px solid #f8d7da}.primary[data-v-5c2f1cfe]{color:#004085;background-color:#cce5ff;border-color:#b8daff}.warning[data-v-5c2f1cfe]{color:#856404;background-color:#fff3cd;border-color:#ffeeba}.error[data-v-5c2f1cfe]{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb}.info[data-v-5c2f1cfe]{color:#0c5460;background-color:#d1ecf1;border-color:#bee5eb}.hidden[data-v-5c2f1cfe]{display:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-5c2f1cfe";
/* module identifier */

var __vue_module_identifier__ = "data-v-5c2f1cfe";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);// Import vue component

var install = function installVue2TooltipSimple(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('Vue2TooltipSimple', __vue_component__);
}; // Create module definition for Vue.use()


var plugin = {
  install: install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
} // Inject install function into component - allows component
// to be registered via Vue.use() as well as Vue.component()


__vue_component__.install = install; // Export component by default
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = component;
exports.default=__vue_component__;