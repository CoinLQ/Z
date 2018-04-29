<style scoped>
</style>

<template>
</template>

<script>
import bus from '@/bus';

export default {
	methods: {
		handler(event) {
    		// console.log("keydown event ");
    		// console.dir(event);
            let actionMap =  {
		        38: 'mov-up', // up
		        87: 'mov-up-w', // w
		        37: 'mov-left', // left
		        65: 'mov-left-a', // a
		        40: 'mov-down', // down
		        83: 'mov-down-s', // s
		        39: 'mov-right', // right
		        68: 'mov-right-d', // d
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
		        // 113: 'focusGlyphPanel', // F2
		        // 114: 'focusCanvasPanel', // F3
		        17: 'ctrl',
		    }

		    let action = actionMap[event.keyCode];
		    let type = event.type; // keydown or keyup
		    let shiftKey = event.shiftKey;
		    let altKey = event.altKey;
		    let ctrlKey = event.ctrlKey;

		    if (!action) return;

		    if (action == 'ctrl') {
		    	action = 'noop';
		    	ctrlKey = true;
		    }

        // TODO: it'd be better to make combo keys into a certain action.
        bus.$emit('keyEvent', {type: type, action: action, modify:{enlarge: shiftKey, shrink: altKey, step: ctrlKey}});

	        event.preventDefault();
			},
		},

    mounted: function() {
        // document.body.onkeydown = _.throttle(this.handler, 200);
        // document.body.onkeyup = _.throttle(this.handler, 200);
        window.staticfunc = this.handler;
        document.body.addEventListener('keydown', window.staticfunc);
    	//document.body.addEventListener('keyup', window.staticfunc);
    },

    beforeDestroy: function() {
    	document.body.removeEventListener('keydown', window.staticfunc);
    	//document.body.removeEventListener('keyup', window.staticfunc);
      bus.$off('keyEvent');
    }
}
</script>

