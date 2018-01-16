<template>
</template>

<script>
export default {
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
			    }

			    let action = actionMap[event.keyCode];
			    if (action) {
			        event.preventDefault()
			        _this.$emit('keyEvent', {action: action, modify:{enlarge: event.shiftKey, shrink: event.altKey, scale: event.ctrlKey}});
			    }
            return;
        }, 100);
    }
}
</script>

<style scoped>

</style>