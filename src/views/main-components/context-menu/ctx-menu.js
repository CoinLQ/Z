export default {
  name: 'CtxMenu',
  data: function () {
    return {
      menuTop: 0,
      menuLeft: 0,
      menuVisible: false
    };
  },
  props: ['items'],
  methods: {
    setPositionFromEvent(event) {
      const { pageX, pageY } = event;
      this.menuTop = pageY - (document.body.scrollTop);
      this.menuLeft = pageX;
    },
    openMenu: function (event) {
      this.menuVisible = true;
      // debugger;
      this.setPositionFromEvent(event);
      event.preventDefault();
      event.stopPropagation();
      return false;
    },
    closeMenu: function (event) {
      this.menuVisible = false;
    },
    itemClick: function (item) {
      console.log(item);
      this.$emit('menuclick', item);
    }
  },
  computed: {
    ctxStyle() {
      return {
        'display': this.menuVisible ? 'block' : 'none',
        'top': (this.menuTop || 0) + 'px',
        'left': (this.menuLeft || 0) + 'px'
      };
    }
  }
};