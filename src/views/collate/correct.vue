<style scoped>
iframe {
  width: 100%;
  border-style: none;
}
</style>
<template>
  <iframe class="iframe" :style="{height: getHeight}" :src=getPageUrl></iframe>
  <!-- <div id="container" class="iframe" ref="container"></div> -->
</template>
<script>
import util from '@/libs/util'

export default {
  name: 'correct',

  computed: {
      getHeight: function() {
          return (window.innerHeight - 100) + 'px';
      },

      getPageUrl() {
        return "http://localhost:9000/correct/1/"
      }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      // let url = 'http://localhost:9000/correct/1/';
      // let container = this.$refs.container;
      // window.container = container;
      // window.ajax = util.ajax;
      // window.url = url;
      // util.ajax.get(url).then(function (response) {

      // })
    }
  }
}

</script>
