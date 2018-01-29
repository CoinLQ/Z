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
		/*display: none;*/
	    text-align: center;
	    background-color: #2E363F;
	    color: #d6d6d6;
	    font-size: 80px;
	}

	.char-wrapper {
	    margin-top: -5px;
	}

	.confidence {
		/*height: 26px;*/
		background-color: #404040;
		opacity: 1;
		color: #eee;
		padding-top: 3px;
		text-align: center;
		border-radius: 0 0 3px 3px;
		font-family: monospace;
		font-size: large;
	}

	.active {
		background-color: #27A9E3;
	}

	.glyph-wrapper {
		/*display: flex;*/
	}
</style>

<template>
	<div class="outer-wrapper">
		<div class="inner-wrapper" @click="onClick">
			<div class="glyph-wrapper">
				<div class="glyph"><img :src="clip"></div>
				<div class="glyph char"><div class="char-wrapper">{{rectData.ch}}</div></div>
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
				'rect': {},
				'refRects': {}, // other rects in the same column for reference.
				'deleted': false,
				'xpng': 'data:image/png;base64,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'
			}
		},

		props: [
			'active',
			'rectData',
			'imgData',
		],

		mounted() {
			this.init();
		},

		watch: {
			imgData() {
				this.init();
			}
		},

		methods: {
			init() {
				this.rect = {x: this.rectData.x-this.imgData.x, y: this.rectData.y-this.imgData.y, w: this.rectData.w, h: this.rectData.h};

				this.rect = this.correct(this.rect);

				util.ajax.get('/api/rect/' + this.rectData.cid + '/col_rects/')
				.then(function(response){
				    let suc = response.data.status == 0;

				    if (!suc) {
				        throw {message: response.data.msg}
				    }
				    this.refRects = _(response.data.rects).forEach(function (r) {
							r.x = r.x-r.column_set.x;
							r.y = r.y-r.column_set.y;
							r.refonly = true;
				    });
				}.bind(this)).catch(function(error){
				    console.log(error);
				    this.$Notice.error({
				        title: 'Failed',
				        desc: error.message
				    });
				}.bind(this));

				util.createImgObjWithUrl(this.imgData.url)
				.then(function(v){
					this.image = v.target;
					this.clip = util.getImageClip(v.target, this.rect.w, this.rect.h, this.rect.x, this.rect.y, 1);
				}.bind(this)).catch(function(v) {
					console.log("Image failed to load! " + v);
				})
			},
			onClick() {
				this.isActive = true;
				this.$store.commit('setCurGlyph', {glyph: this, curRect: this.rect, image:this.image, refRects: this.refRects});
				this.$emit('highlight', this);
			},

			resetFocus() {
				this.isActive = false;
			},

			updateClip(rect) {
				if (rect.deleted) {
					this.clip = this.xpng;
					this.deleted = true;
				} else {
					this.rect.x = rect.x;
					this.rect.y = rect.y;
					this.rect.w = rect.w;
					this.rect.h = rect.h;
					this.clip = util.getImageClip(this.image, this.rect.w, this.rect.h, this.rect.x, this.rect.y, 1);
					this.deleted = false;
				}
			},

			getImage() {
				return this.image;
			},

			getImageCoordOrigin() {
				return {x: this.imgData.x, y: this.imgData.y};
			},

			getRectData() {
				let final = this.rectData;
				let update = {x: _.round(this.rect.x+this.imgData.x),
							y: _.round(this.rect.y+this.imgData.y),
							w: _.round(this.rect.w),
							h: _.round(this.rect.h)};

				final.op = this.deleted? 3 : (final.x == update.x
										&& final.y == update.y
										&& final.w == update.w
										&& final.h == update.h
										? 1 : 2);

				return _.merge(final, update);
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
			},
		}
	}
</script>
