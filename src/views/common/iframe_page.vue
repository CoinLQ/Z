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
    name: 'IframePage',
    computed: {
        getPageUrl() {
            return util.ajax.defaults.baseURL + "/" + this.$route.name
        },
        getHeight: function() {
          return this.inner_height;
        },
    },
    methods: {
        handleResize() {
            this.inner_height = window.innerHeight - 100
        },
        updateBannerHeader() {
        }

    },
    data () {
        return {
            inner_height: window.innerHeight - 100,
        }
    },
    mounted() {
        this.handleResize();
        this.updateBannerHeader();
        on(window, 'resize', this.handleResize);
    },
    beforeDestroy () {
        off(window, 'resize', this.handleResize);
    }
}
</script>
