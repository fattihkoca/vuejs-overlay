<template>
  <div v-if="containerVisible" class="v-overlay" ref="container"
       @click.prevent="closeByBackdrop($event)" @mousedown="mouseDownListener($event)">
    <div v-if="backdrop" class="v-overlay-backdrop"></div>

    <div class="v-overlay-field">
      <div v-show="contentVisible" class="v-overlay-main"
           :class="{['v-overlay-animate-' + animate]: animate && reanimate, 'v-overlay-closing': closing}"
           ref="overlay">
        <header v-if="header" class="v-overlay-header">
          <h4 class="v-overlay-title" v-text="header"></h4>
        </header>
        <div class="v-overlay-body">
          <slot v-show="contentVisible"></slot>
        </div>
      </div>

      <button v-if="closeable && closeOnCancel" class="v-overlay-close-handle"
              @click.prevent.stop="close" :title="closeTitle"></button>

      <div v-if="!contentVisible && loadingVisible" class="v-overlay-loading">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
          <circle cx="50" cy="50" fill="none" stroke="#FFF" stroke-width="6" r="35"
                  stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(222 50 50)">
            <animateTransform attributeName="transform" type="rotate" calcMode="linear"
                              values="0 50 50;360 50 50"
                              keyTimes="0;1" dur="1s" begin="0s"
                              repeatCount="indefinite"></animateTransform>
          </circle>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "overlay",
  props: {
    opened: Boolean,
    visible: Boolean,
    header: {
      type: [String, Boolean],
      default: false,
    },
    closeable: {
      type: Boolean,
      default: true
    },
    closeByBackdropClick: {
      type: Boolean,
      default: true
    },
    closeOnEscape: {
      type: Boolean,
      default: true
    },
    closeOnCancel: {
      type: Boolean,
      default: true
    },
    closeTitle: {
      type: String,
      default: 'Close'
    },
    backdrop: {
      type: Boolean,
      default: true
    },
    animate: {
      validator: value => {
        return [
          'bounce', 'fade', 'slide-down', 'slide-left', 'slide-right',
          'slide-up', 'zoom-in', 'zoom-out', false
        ].indexOf(value) !== -1
      },
      default: false
    }
  },
  data() {
    return {
      containerVisible: false,
      contentVisible: false,
      visibleDelay: 10,
      closing: false,
      closingTimeout: null,
      closingDelay: 125,
      loadingVisible: true,
      scrollY: 0,
      reanimate: true,
      mouseDownWasOutside: true,
      lastMouseDownX: 0,
      lastMouseDownY: 0,
    };
  },
  watch: {
    opened(val) {
      this.openedEvent(val);
    },
    visible(val) {
      this.visibleEvent(val);
    },
  },
  methods: {
    init() {
      this.setDocScrollY();
      this.openedEvent(this.opened);
      this.visibleEvent(this.visible);
    },
    clearClosingTimeout() {
      this.closing = false;
      clearTimeout(this.closingTimeout);
    },
    openedEvent(status) {
      this.clearClosingTimeout();

      if (status) {
        this.containerVisible = true;
        this.open();
        return;
      }

      this.close();
    },
    visibleEvent(status) {
      if (status) {
        setTimeout(() => {
          this.contentVisible = true;
          setTimeout(this.alignCenter, 0);

          this.resizeObserver();
        }, this.visibleDelay);

        return;
      }

      this.close();
    },
    open() {
      this.preventScroll(true);
      this.$emit('opened');
    },
    close() {
      if (!this.closeable)
        return;

      this.clearClosingTimeout();
      this.loadingVisible = this.reanimate = false;
      this.closing = true;
      setTimeout(() => {
        this.reanimate = true;
      }, 0);
      this.closingTimeout = setTimeout(() => {
        this.containerVisible = this.closing = false;
        this.loadingVisible = true;
        this.contentVisible = false;
      }, this.closingDelay);

      this.preventScroll(false);
      this.$emit('closed');
    },
    closeByBackdrop(e) {
      if (this.$refs.overlay instanceof Element
          && this.closeByBackdropClick
          && this.isOutsideTarget(e)
          && !this.isDragException(e)) {
        this.close();
      }
    },
    isOutsideTarget(e) {
      let target = e.target,
          overlay = this.$refs.overlay;

      return !(overlay === target || overlay.contains(target));
    },
    mouseDownListener(e) {
      this.mouseDownWasOutside = this.isOutsideTarget(e);
      this.lastMouseDownX = e.offsetX;
      this.lastMouseDownY = e.offsetY;
    },
    // Detects mouse dragging from inside to outside
    isDragException(e) {
      let deltaX = e.offsetX - this.lastMouseDownX,
          deltaY = e.offsetY - this.lastMouseDownY,
          distSq = (deltaX * deltaX) + (deltaY * deltaY),
          isDrag = distSq > 3;

      return isDrag && !this.mouseDownWasOutside
    },
    escapeKey(e) {
      if (this.closeable && this.closeOnEscape && e.key === 'Escape') {
        this.close();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    },
    alignCenter() {
      let overlay = this.$refs.overlay;

      if (!(overlay instanceof Element)) {
        return;
      }

      let marginTop = (window.innerHeight - overlay.offsetHeight) / 2;
      overlay.style.margin = '';
      overlay.style.marginLeft = overlay.style.marginRight = 'auto';

      if (overlay.offsetHeight < window.innerHeight) {
        overlay.style.marginTop = marginTop + 'px';
      } else {
        overlay.style.marginTop = '0';
      }
    },
    setDocScrollY() {
      if (this.opened) {
        return;
      }

      this.scrollY = `${window.scrollY}px`;
    },
    preventScroll(prevent) {
      let body = window.document.body,
          html = window.document.documentElement,
          hasClass = (element, className) => {
            return !!element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
          },
          addClass = (element, className) => {
            if (!hasClass(element, className)) {
              element.className += ' ' + className;
              element.className = element.className.trim();
            }
          },
          removeClass = (element, className) => {
            element.className = element.className.replace(
                new RegExp('( |^)' + className + '( |$)', 'g'), ' ').trim();
          };

      if (prevent) {
        body.style.top = `-${this.scrollY}`;
        addClass(body, 'parent-doc-fixed');
        addClass(body, 'default-scroll-behavior');
        addClass(html, 'default-scroll-behavior');
        return;
      }

      let scrollToY = parseInt(this.scrollY || '0');
      window.scrollTo(0, scrollToY);
      removeClass(body, 'parent-doc-fixed');
      body.style.top = '';

      setTimeout(() => {
        removeClass(body, 'default-scroll-behavior');
        removeClass(html, 'default-scroll-behavior');
      }, 0);
    },
    resizeObserver() {
      if ((typeof ResizeObserver !== 'function')) {
        return;
      }

      let ro = new ResizeObserver(entries => {
        this.alignCenter();
      });

      ro.observe(this.$refs.overlay);
    },
  },
  mounted() {
    this.init();
    document.body.appendChild(this.$el);
    window.addEventListener('resize', this.alignCenter);
    window.addEventListener("keydown", this.escapeKey);
    window.addEventListener('scroll', this.setDocScrollY);
  },
  destroyed() {
    window.removeEventListener('resize', this.alignCenter);
    window.removeEventListener("keydown", this.escapeKey);
    window.removeEventListener('scroll', this.setDocScrollY);
  }
};
</script>

<style lang="scss">
$max-width-for-fullscreen: 1000px;

%fixed {
  position: fixed;
  width: 100vw;
  height: 100vh;
}

%absolute {
  position: absolute
}

%relative {
  position: relative
}

%edge {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

%overflow-hidden {
  overflow: hidden;
}

%overflow-auto {
  overflow: auto;
}

@keyframes v-overlay-bounce-in {
  0% {
    opacity: 0;
    transform: scale3d(.8, .8, .8);
  }

  50% {
    transform: scale3d(1.2, 1.2, 1.2);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes v-overlay-fade-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes v-overlay-slide-down {
  from {
    opacity: 0;
    transform: translate3d(0, -100vh, 0) scale3d(1.2, 1.2, 1.2);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
}

@keyframes v-overlay-slide-left {
  from {
    opacity: 0;
    transform: translate3d(100vw, 0, 0) scale3d(1.2, 1.2, 1.2);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
}

@keyframes v-overlay-slide-right {
  from {
    opacity: 0;
    transform: translate3d(-100vw, 0, 0) scale3d(1.2, 1.2, 1.2);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
}

@keyframes v-overlay-slide-up {
  from {
    opacity: 0;
    transform: translate3d(0, 100vh, 0) scale3d(1.2, 1.2, 1.2);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
}

@keyframes v-overlay-zoom-in {
  from {
    opacity: 0;
    transform: scale3d(.8, .8, .8);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes v-overlay-zoom-out {
  from {
    opacity: 0;
    transform: scale3d(1.2, 1.2, 1.2);
  }

  to {
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

body {
  min-width: 100vw;
  min-height: 100vh;
}

.parent-doc-fixed {
  position: fixed;
}

.default-scroll-behavior {
  scroll-behavior: auto;
}

.v-overlay {
  @extend %fixed;
  z-index: 2147483647;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  @extend %edge;
  @extend %overflow-auto;

  &-backdrop {
    @extend %fixed;
    z-index: 0;
    background: rgba(0, 0, 0, .45);
    @extend %edge;
  }

  &-field {
    @extend %absolute;
    z-index: 1;
    padding: 0;
    width: 100vw;
    min-height: 100vh;
    @extend %edge;
    @extend %overflow-auto;
  }

  &-main {
    @extend %relative;
    z-index: 2;
    padding-top: 35px;
    height: auto;
    min-height: 100vh;
    background: #FFF;
    @extend %overflow-hidden;
    font-size: 16px;
  }

  &-close-handle {
    @extend %absolute;
    z-index: 100;
    top: 10px;
    right: 10px;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    outline: none;
    cursor: pointer;

    &, &:before, &:after {
      display: block;
    }

    &:before, &:after {
      @extend %absolute;
      content: ' ';
      top: 0;
      left: 16px;
      height: 32px;
      width: 2px;
      background: #000
    }

    &:before {
      transform: rotate(45deg)
    }

    &:after {
      transform: rotate(-45deg)
    }
  }

  &-header {
    padding: 5px 10px;
    border-bottom: rgba(0, 0, 0, .1) 1px solid;
    color: rgba(0, 0, 0, .5);

    h4 {
      font-weight: 600;
    }
  }

  &-body {
    padding: 10px;
  }

  &-loading {
    @extend %absolute;
    z-index: 3;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 50px;
  }

  @media screen and (min-width: $max-width-for-fullscreen) {
    padding: 20px;

    &-main {
      padding-top: 0;
      max-width: 800px;
      min-height: auto;
      border-radius: 10px;
      box-shadow: rgba(0, 0, 0, .2) 0 0 40px;
    }

    &-close-handle {
      opacity: 1;
      transition: .2s;

      &:hover {
        opacity: .8;
      }

      &:before, &:after {
        background: #FFF
      }
    }

    &-header {
      padding: 15px 20px;
    }

    &-body {
      padding: 20px;
    }
  }

  &-animate-slide-down {
    animation-name: v-overlay-slide-down;
  }

  &-animate-slide-left {
    animation-name: v-overlay-slide-left;
  }

  &-animate-slide-right {
    animation-name: v-overlay-slide-right;
  }

  &-animate-slide-up {
    animation-name: v-overlay-slide-up;
  }

  &-animate-bounce {
    animation-name: v-overlay-bounce-in;
  }

  &-animate-fade {
    animation-name: v-overlay-fade-in;
  }

  &-animate-zoom-in {
    animation-name: v-overlay-zoom-in;
  }

  &-animate-zoom-out {
    animation-name: v-overlay-zoom-out;
  }

  &-main {
    animation-duration: .25s;
    animation-timing-function: ease-in-out;
  }

  &-closing {
    opacity: 0;
    animation-direction: reverse;
    animation-duration: .20s;
  }
}
</style>
