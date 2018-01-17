<style scoped>
.cover {
    width:100%;
    height:100%;
    background-color:#000;
    position:absolute;
    top:0;
    left:0;
    z-index:2;
    opacity:0.3;
    /*兼容IE8及以下版本浏览器*/
    filter: alpha(opacity=30);
}

.hide {
	display: none;
}
</style>

<template>
<div class="cover" :class="{hide: toHide}">
	说明书
</div>
</template>

<script>
export default {
	data() {
		return {
			toHide: true,
		}
	},

    mounted: function() {
    	let _this = this;

        document.body.onkeydown = _.throttle(function(event) {
        		// console.log("keydown event")
                let actionMap =  {
			        38: 'mov-up', // up
			        87: 'mov-up', // w
			        37: 'mov-left', // left
			        65: 'mov-left', // a
			        40: 'mov-down', // down
			        83: 'mov-down', // s
			        39: 'mov-right', // right
			        68: 'mov-right', // d
			        32: 'select', // space
			        88: 'drul', // x for down right up left
			        75: 'delete', // k
			        49: 'scale-1', // 1
			        50: 'scale-2', // 2
			        51: 'scale-3', // 3
			        52: 'scale-4', // 4
			        53: 'scale-5', // 5
			        54: 'scale-6', // 6
			        55: 'scale-7', // 7
			        56: 'scale-8', // 8
			        57: 'scale-9', // 9
			        72: 'help', // h
			    }

			    let action = actionMap[event.keyCode];
			    if (action) {
			        event.preventDefault()
			        _this.$emit('keyEvent', {action: action, modify:{enlarge: event.shiftKey, shrink: event.altKey, step: event.ctrlKey}});

			        if (action == 'help') {
			        	_this.toHide = _this.toHide? 'false' : 'true';
			        }
			    }
        }, 100);
    }
}
</script>

