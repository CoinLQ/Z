<style scoped>
</style>

<template>
</template>

<script>
import bus from '@/bus';

export default {

	data() {
		return {
			target: 'canvas'
		}
	},

    mounted: function() {
    	let _this = this;

        document.body.onkeydown = _.throttle(function(event) {
    		// console.log("keydown event ");
    		// console.dir(event);
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
		        112: 'help', // F1
		        113: 'focusGlyphPanel', // F2
		        114: 'focusCanvasPanel', // F3
		    }

		    let action = actionMap[event.keyCode];
		    if (!action) return;

		    if (action == 'focusGlyphPanel') {_this.target = 'glyph'; return}
		    if (action == 'focusCanvasPanel') {_this.target = 'canvas'; return}

		    // console.log('KeyEvent target: ' + _this.target);

	        bus.$emit('keyEvent', {target: _this.target,action: action, modify:{enlarge: event.shiftKey, shrink: event.altKey, step: event.ctrlKey}});

	        event.preventDefault();
        }, 200);
    }
}
</script>

