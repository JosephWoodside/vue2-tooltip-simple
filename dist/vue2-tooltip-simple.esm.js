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

  data() {
    return {
      hidden: true,
      tooltipElement: null
    };
  },

  computed: {
    tooltipId() {
      return `tooltip-${this.elementId}`;
    },

    triangleId() {
      return `triangle-${this.elementId}`;
    }

  },

  mounted() {
    this.tooltipElement = document.getElementById(this.tooltipId);

    if (this.elementId.length !== 0) {
      this.mountListeners(this.elementId);
    }
  },

  methods: {
    handleMouseMove(event) {
      const offset = this.getOffset();
      this.tooltipElement.style.left = event.clientX - offset.left + "px";
      this.tooltipElement.style.top = event.clientY - offset.top + "px";
      this.tooltipElement.style.position = "fixed";
    },

    handleHide() {
      this.hidden = true;
    },

    handleShow() {
      this.hidden = false;
    },

    handleClick() {
      this.hidden = !this.hidden;
      const offset = this.getElementPositionOffset();
      this.tooltipElement.style.left = offset.left + "px";
      this.tooltipElement.style.top = offset.top + "px";
      this.tooltipElement.style.position = "absolute";
    },

    getOffset() {
      return {
        left: this.tooltipElement.offsetWidth / 2 - 5,
        top: this.tooltipElement.offsetHeight + 20
      };
    },

    getElementPositionOffset() {
      const element = document.getElementById(this.elementId);
      const elementRect = element.getBoundingClientRect();
      return {
        left: elementRect.left - elementRect.width / 2,
        top: elementRect.top + window.scrollY - elementRect.height * 1.65
      };
    },

    mountListeners(id) {
      const element = document.getElementById(id);

      if (this.mode === "hover") {
        element.addEventListener("mouseenter", this.handleShow);
        element.addEventListener("mouseleave", this.handleHide);
        document.addEventListener("mousemove", e => this.handleMouseMove(e));
      } else if (this.mode === "click") {
        element.addEventListener("click", this.handleClick);
      }
    },

    unMountListeners(id) {
      this.hidden = true;
      const element = document.getElementById(id);

      if (this.mode === "hover") {
        element.removeEventListener("mouseenter", this.handleShow);
        element.removeEventListener("mouseleave", this.handleHide);
        document.removeEventListener("mousemove", e => this.handleMouseMove(e));
      } else if (this.mode === "click") {
        element.removeEventListener("click", this.handleClick);
      }
    }

  },
  watch: {
    elementId(newId, oldId) {
      if (oldId.length) {
        this.unMountListeners(oldId);
      }

      if (newId.length) {
        this.mountListeners(newId);
      }
    },

    mode(newMode, oldMode) {
      if (newMode !== oldMode) {
        this.unMountListeners(this.elementId);
        this.mountListeners(this.elementId);
      }
    }

  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
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
  }, [_c('div', [_vm._t("content")], 2), _vm._v(" "), _c('div', {
    class: "triangle triangle__" + _vm.classes,
    attrs: {
      "id": _vm.triangleId
    }
  })]);
};

var __vue_staticRenderFns__ = [];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-5c2f1cfe_0", {
    source: ".base-container[data-v-5c2f1cfe]{position:fixed;z-index:10000;max-width:10rem;min-width:2rem;min-height:2rem;width:auto;border-radius:15px;display:flex;flex-direction:column;justify-content:center;align-items:center;border:1px solid transparent}.triangle[data-v-5c2f1cfe]{width:0;height:0;border-left:12px solid transparent;border-right:12px solid transparent;margin-bottom:-10px;margin-left:-5px;position:relative}.triangle__primary[data-v-5c2f1cfe]{border-top:12px solid #cce5ff}.triangle__warning[data-v-5c2f1cfe]{border-top:12px solid #fff3cd}.triangle__info[data-v-5c2f1cfe]{border-top:12px solid #d1ecf1}.triangle__error[data-v-5c2f1cfe]{border-top:12px solid #f8d7da}.primary[data-v-5c2f1cfe]{color:#004085;background-color:#cce5ff;border-color:#b8daff}.warning[data-v-5c2f1cfe]{color:#856404;background-color:#fff3cd;border-color:#ffeeba}.error[data-v-5c2f1cfe]{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb}.info[data-v-5c2f1cfe]{color:#0c5460;background-color:#d1ecf1;border-color:#bee5eb}.hidden[data-v-5c2f1cfe]{display:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-5c2f1cfe";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

// Import vue component

const install = function installVue2TooltipSimple(Vue) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('Vue2TooltipSimple', __vue_component__);
}; // Create module definition for Vue.use()


const plugin = {
  install
}; // To auto-install when vue is found
// eslint-disable-next-line no-redeclare

/* global window, global */

let GlobalVue = null;

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

export default __vue_component__;
