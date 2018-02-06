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
	    color: #fffdddee;
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
	import xpng from '../img/deleted.png';

	export default {
		name: 'glyphBlock',

		data() {
			return {
				'clip': '',
				'isActive': this.active,
				'image': {},
				'rect': {},
				'refRects': {}, // other rects in the same column for reference.
				'op': 1,
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
				this.rect = _.cloneDeep(this.rectData)
				let trans_rect = this.correct({x: this.rectData.x-this.imgData.x,
																			y: this.rectData.y-this.imgData.y,
																			w: this.rectData.w,
																			h: this.rectData.h});

				this.rect = _.assign(this.rect, trans_rect)

				setTimeout(this.getRefRects(this.rectData.cid), Math.random()*3000);

				util.createImgObjWithUrl(this.imgData.url)
				.then(function(v){
					this.image = v.target;
					this.clip = util.getImageClip(v.target, this.rect.w, this.rect.h, this.rect.x, this.rect.y, 1);
				}.bind(this)).catch(function(v) {
					console.log("图片载入失败 " + v);
				})
			},

			getRefRects(id) {
				util.ajax.get('/api/rect/' + id + '/col_rects/')
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

				    if (this.isActive) {
				    	this.onClick();
				    }

				}.bind(this)).catch(function(error){
				    console.log(error);
				    this.$Notice.error({
				        title: this.$t('Failed'),
				        desc: error.message
				    });
				}.bind(this));
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
					this.clip = xpng;
					this.op = 3;
				} else {
					this.op = 2;
					if (rect.created) {
						this.rect = {};
						this.op = 4;
					}
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

			getRectData() {
				let origin = this.rectData;
				let update = {x: _.round(this.rect.x+this.imgData.x),
							y: _.round(this.rect.y+this.imgData.y),
							w: _.round(this.rect.w),
							h: _.round(this.rect.h)};

				this.rect.op = origin.x == update.x
										&& origin.y == update.y
										&& origin.w == update.w
										&& origin.h == update.h
										? 1 : this.op;

				return _.assign(this.rect, update);
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
