<style scoped>
iframe {
  width: 100%;
  border-style: none;
}
</style>

<template>
    <iframe class="iframe" :height="getHeight" :src=getPageUrl></iframe>
</template>
<script>
import util from '@/libs/util';
import { on, off } from 'iview/src/utils/dom';

export default {
    name: 'IframeTask',
    props: ['taskPath'],
    computed: {
        getPageUrl() {
            return util.ajax.defaults.baseURL + "/" + this.taskPath + "/" + this.$route.params.id
        },
        getHeight: function() {
          return this.inner_height;
        },
    },
    methods: {
        handleResize() {
            this.inner_height = window.innerHeight - 100
        },

    },
    data () {
        return {
            inner_height: window.innerHeight - 100,
        }
    },
    mounted() {
        this.handleResize();
        on(window, 'resize', this.handleResize);
    },
    beforeDestroy () {
        off(window, 'resize', this.handleResize);
    }
}
</script>
