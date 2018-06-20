<style lang="css">
    @import './css/base.css';
    @import './css/user.css';
</style>
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
import Cookies from 'js-cookie';
import env from '@/config/env';

export default {
    name: 'activate',
    props:['token'],
    computed: {
        getPageUrl() {
            
            return util.ajax.defaults.baseURL + this.$route.path 
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
