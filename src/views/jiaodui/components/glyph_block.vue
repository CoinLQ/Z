<style type="text/css" scoped>
	img {
		width: 100%;
		height: 100%;
		border-radius: 3px 3px 0 0;
	}

	.outer-wrapper {
		margin: 20px 10px;
	}

	.inner-wrapper {
		box-shadow: 2px 2px 1px 0px #363E4E;
		border-radius: 3px;
		/*width: 240px;*/
	}

	.inner-wrapper:hover {
		box-shadow: 0px 0px 3px 3px #363E4E;
	}

	.glyph {
		width: 120px;
		height: 120px;
		border-radius: 3px 3px 0 0;
	}

	.char {
		display: none;
	    text-align: center;
	    background-color: #2E363F;
	    color: white;
	    font-size: 80px;
	}

	.char-wrapper {
	    margin-top: -5px;
	}

	.confidence {
		/*height: 26px;*/
		background-color: #404040;
		opacity: 1;
		color: white;
		padding-top: 3px;
		text-align: center;
		border-radius: 0 0 3px 3px;
		font-family: monospace;
		font-size: large;
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
				'rect': {}
			}
		},

		props: [
			'active',
			'rectData',
			'imgData',
		],

		mounted() {
			this.rect = {x: this.rectData.x-this.imgData.x, y: this.rectData.y-this.imgData.y, w: this.rectData.w, h: this.rectData.h};

			this.rect = this.correct(this.rect);

			util.createImgObjWithUrl(this.imgData.s3_uri)
			.then(function(v){
				this.image = v.target;
				this.clip = util.getImageClip(v.target, this.rect.w, this.rect.h, this.rect.x, this.rect.y, 1);
			}.bind(this)).catch(function(v) {
				console.log("Image failed to load! " + v);
			})
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
			},

			correct(rect) {
				if (rect.w<0) {
                    rect.x = rect.x + rect.w
                    rect.w = Math.abs(rect.w)
                }
                if (rect.h<0) {
                    rect.y = rect.y + rect.h
                    rect.h = Math.abs(rect.h)
                }
                if (rect.w <5) {
                    rect.w = 5;
                }
                if (rect.h <5){
                    rect.h = 5;
                }
                return rect;
			}
		}
	}
</script>