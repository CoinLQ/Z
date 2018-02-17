<style scoped>
iframe {
  width: 100%;
  border-style: none;
}
</style>
<template>
  <IframeTask :task-path="getPageUrl"></IframeTask>
</template>
<script>
import util from '@/libs/util'
import IframeTask from './iframe_task';

export default {
  name: 'correct',
  components: { IframeTask },
  computed: {
      getHeight: function() {
          return (window.innerHeight - 100) + 'px';
      },

      getPageUrl() {
        let base_path = this.$route.query.base_path;
        return this.$route.name
      }
  }
}
</script>
