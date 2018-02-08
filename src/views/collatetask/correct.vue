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
        return util.ajax.defaults.baseURL + "/correct/" + this.$route.params.id
      }
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {

    }
  }
}

</script>
