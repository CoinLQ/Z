<style type="text/css" scoped>
	img {
		width: 80px;
		height: 80px;
		border-radius: 3px 3px 0 0;
	}

	.outer-wrapper {
		margin: 20px 10px;
	}

	.inner-wrapper {
		box-shadow: -3px -2px 9px 0px #363E4E;
		border-radius: 3px;
	}

	.inner-wrapper:hover {
		box-shadow: -3px -2px 30px 2px #363E4E;	
	}

	.glyph {
		float: left;
		width: 80px;
		height: 80px;
		border-radius: 3px 3px 0 0;
	}

	.char {
		/*display: none;*/
	    width: 80px;
	    height: 80px;
	    text-align: center;
	    background-color: #2E363F;
	    color: white;
	    font-size: 60px;
	}

	.char-wrapper {
	    margin-top: -5px;
	}

	.confidence {
		height: 26px;
		background-color: #404040;
		opacity: 1;
		color: white;
		margin-top: -5px;
		padding-top: 3px;
		text-align: center;
		border-radius: 0 0 3px 3px;
		clear: left;
	}

	.active {
		background-color: #27A9E3;
	}
</style>

<template>
	<div class="outer-wrapper">
		<div class="inner-wrapper" @click="onClick">
			<div class="glyph-wrapper">
				<div class="glyph"><img :src="clip"></div>
				<div class="glyph char"><div class="char-wrapper">{{rectData.word}}</div></div>
			</div>
			<div class="confidence" :class="{active:isActive}">
				<label>{{ rectData.cc }}</label>
			</div>
		</div>
	</div>
</template>

<script type="text/javascript">
	import util from '@/libs/util';

	export default {
		name: 'glyphBlock',

		data() {
			return {
				'clip': '',
				'isActive': this.active,
				'image': {},
				'rect': {x: this.rectData.x-this.imgData.x, y: this.rectData.y-this.imgData.y, w: this.rectData.w, h: this.rectData.h}
			}
		},

		props: [
			'active',
			'rectData',
			'imgData',
		],

		mounted() {
			util.createImgObjWithUrl(this.imgData.s3_uri)
			.then(function(v){
				this.image = v.target;
				this.clip = util.getImageClip(v.target, this.rectData.w, this.rectData.h, this.rectData.x - this.imgData.x, this.rectData.y - this.imgData.y, 1);
			}.bind(this)).catch(function(v) {
				console.log("Image failed to load! " + v);
			})
			// this.image = new Image();
	        // // this.image.crossOrigin = "*";
	        // this.image.onload = function(evt){
			// 	this.clip = util.getImageClip(evt.target, this.rectData.w, this.rectData.h, this.rectData.x - this.imgData.x, this.rectData.y - this.imgData.y, 1);
	        // }.bind(this);

	        // this.image.src = this.imgData.s3_uri;
		},

		methods: {
			onClick() {
				this.isActive = true;
				this.$store.commit('setFocusItem', {item: this, curRect: this.rect, image:this.image});
				this.$emit('highlight', this);
			},

			resetFocus() {
				this.isActive = false;
			},

			updateClip(rect) {
				if (rect && rect.x && rect.y && rect.w && rect.h) {
					this.rect.x = rect.x;
					this.rect.y = rect.y;
					this.rect.w = rect.w;
					this.rect.h = rect.h;
					this.clip = util.getImageClip(this.image, this.rect.w, this.rect.h, this.rect.x, this.rect.y, 1);
				}
			},

			getImage() {
				return this.image;
			},

			getImageCoordOrigin() {
				return {x: this.imgData.x, y: this.imgData.y};
			},

			getTransRect() {
				return this.rect;
			}
		}
	}
</script>