<style scoped>
iframe {
  width: 100%;
  border-style: none;
}
</style>
<template>
  <iframe class="iframe" :height="inner_height" :src="getPageUrl"></iframe>
</template>
<script>
import util from '@/libs/util';
import { on, off } from 'iview/src/utils/dom';

export default {
    name: 'tripitaka',
    computed: {
        getPageUrl() {
            console.log(this.$route.params.id)
            return util.ajax.defaults.baseURL + "/tripitaka/"+ this.$route.params.id
        }

    },
    methods: {
        handleResize() {
            this.inner_height = window.innerHeight - 100
        },
        updateBannerHeader() {
            let url = util.ajax.defaults.baseURL + "/api/tripitaka/?code=" +  this.$route.params.id ;
            util.ajax.get(url, {})
            .then(function (response) {
                this.$store.commit('updateBannerHeader', response.data.results[0].name);
            }.bind(this))
            .catch(function (error) {
                console.log(error)
            });
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
