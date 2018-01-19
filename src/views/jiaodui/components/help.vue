<style scoped>
.cover {
    width:100%;
    height:100%;
    background-color:#0e0e0e;
    position:absolute;
    top:0;
    left:0;
    z-index:2;
    opacity:0.8;
    /*兼容IE8及以下版本浏览器*/
    filter: alpha(opacity=80);
}

.hide {
	display: none;
}

.content-wrapper {
	text-align: center;
	margin: 100px 50px;
	color: white;
	font-size: 2em;
	overflow: scroll;
}
</style>

<template>
<div class="cover" :class="{hide: toHide}">
	<div class="content-wrapper"><div class="content">
			说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书
	说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书说明书

	</div></div>
</div>
</template>

<script>
import bus from '@/bus';

export default {
	name: 'HelpPage',

	data() {
		return {
			toHide: true,
		}
	},

    mounted: function() {
    	let _this = this;

    	bus.$on('keyEvent', function(t) {
    		if (t.action == 'help')
	    		_this.toHide = _this.toHide ? false : true;
    	})
    }
}
</script>

