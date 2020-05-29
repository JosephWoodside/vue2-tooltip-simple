<!--******************************************************
** Author: Joseph Woodside
** A simple tooltip component.
** Simply pass in the ID of the element that the tooltip is for, and
**    what element you want to display in the tooltip as a slot.
**
** props:
**  'classes' - type of tooltip. Choices: 'primary', 'info', 'warning', 'error'
**  'elementId' - ID of element that the tooltip should attach itself to
**  'mode' - Behavior of tooltip.
**           'hover' will follow cursor
**           'click' will position itself absolutely above the attached element

**
**********************************************************-->
<template>
  <div class="base-container" :class="classes" v-show="!hidden" :id="tooltipId">
    <div>
      <slot name="content"></slot>
    </div>
    <div :id="triangleId" :class="`triangle triangle__${classes}`"></div>
  </div>
</template>

<script>
export default {
  props: {
    classes: {
      type: String,
      required: false,
      default: "primary",
    },
    elementId: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      default: "hover",
    },
  },
  data() {
    return {
      hidden: true,
      tooltipElement: null,
    };
  },
  computed: {
    tooltipId() {
      return `tooltip-${this.elementId}`;
    },
    triangleId() {
      return `triangle-${this.elementId}`;
    },
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
        top: this.tooltipElement.offsetHeight + 20,
      };
    },
    getElementPositionOffset() {
      const element = document.getElementById(this.elementId);
      const elementRect = element.getBoundingClientRect();
      return {
        left: elementRect.left - elementRect.width / 2,
        top: elementRect.top + window.scrollY - elementRect.height * 1.65,
      };
    },
    mountListeners(id) {
      const element = document.getElementById(id);

      if (this.mode === "hover") {
        element.addEventListener("mouseenter", this.handleShow);
        element.addEventListener("mouseleave", this.handleHide);

        document.addEventListener("mousemove", (e) => this.handleMouseMove(e));
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

        document.removeEventListener("mousemove", (e) =>
          this.handleMouseMove(e)
        );
      } else if (this.mode === "click") {
        element.removeEventListener("click", this.handleClick);
      }
    },
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
    },
  },
};
</script>

<style lang="scss" scoped>
$primary-tooltip-color: #cce5ff;
$warning-tooltip-color: #fff3cd;
$info-tooltip-color: #d1ecf1;
$error-tooltip-color: #f8d7da;

.base-container {
  position: fixed;
  z-index: 10000;
  max-width: 10rem;
  min-width: 2rem;
  min-height: 2rem;
  width: auto;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid transparent;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;

  margin-bottom: -10px;
  margin-left: -5px;
  position: relative;

  &__primary {
    border-top: 12px solid $primary-tooltip-color;
  }

  &__warning {
    border-top: 12px solid $warning-tooltip-color;
  }

  &__info {
    border-top: 12px solid $info-tooltip-color;
  }

  &__error {
    border-top: 12px solid $error-tooltip-color;
  }
}

.primary {
  color: #004085;
  background-color: $primary-tooltip-color;
  border-color: #b8daff;
}

.warning {
  color: #856404;
  background-color: $warning-tooltip-color;
  border-color: #ffeeba;
}

.error {
  color: #721c24;
  background-color: $error-tooltip-color;
  border-color: #f5c6cb;
}

.info {
  color: #0c5460;
  background-color: $info-tooltip-color;
  border-color: #bee5eb;
}

.hidden {
  display: none;
}
</style>
