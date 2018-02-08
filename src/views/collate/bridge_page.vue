<style scoped>
iframe {
  width: 100%;
  border-style: none;
}
</style>
<template>
  <iframe class="iframe" :style="{height: getHeight}" :src=getPageUrl></iframe>
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
        let base_path = this.$route.query.base_path;
        return util.ajax.defaults.baseURL + "/" + this.$route.name +"/" + this.$route.params.id
      }
  },

}

</script>
