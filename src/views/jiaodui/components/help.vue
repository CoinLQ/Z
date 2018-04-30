<style scoped>
.cover {
  width:100%;
  height:100%;
  background-color: currentColor; /*steelblue;*/
  position:absolute;
  top:0;
  left:0;
  z-index:2;
  opacity:0.95;
  /*兼容IE8及以下版本浏览器*/
  filter: alpha(opacity=90);
  overflow: scroll;
}

.hide {
	display: none;
}

.content-wrapper {
	text-align: center;
	margin: 10px;
  border: 2px grey dashed;
	color: white;
	font-size: 2em;
  width: 100%;
  height: 100%;
}

.img-wrapper {
  margin: 70px 0 30px;
}
.text-wrapper {
    display: flex;
    justify-content: space-evenly;
    text-align: left;
}
.help-guide {
  position: fixed;
  top: 120px;
  font-size: 32px;
  margin-left: 40px;
}
</style>

<template>
<div>
  <div class='help-guide' @click="openHelp">
    <Icon type="ios-help">F1 帮助</Icon>
  </div>
  <div class="cover" :class="{hide: toHide}">
    <div class="content-wrapper">
      <div class="content">
        <div class="v1"  v-if="!withGlyph">
          <div class="img-wrapper">
            <img src="../img/keyboard-op1.png">
          </div>
          <div class="text-wrapper">
            <ul>
              <li>[F1] 本帮助页面/切换</li>
              <li>[1-5] 【显示功能】控制切分图片的放大倍率</li>
              <li>[AWSD] 控制字块的选择</li>
              <li>[space] 切分框操作模式/切换</li>
              <li>小技巧：单边调整键自动进入操作模式</li>
            </ul>
            <ul>
              <li>[ shift + [←↑↓→] ] 【操作模式】单边调整膨胀</li>
              <li>[ alt+ [←↑↓→] ] 【操作模式】单边调整缩小</li>
              <li>[ ←↑↓→ ]【操作模式】单方向移动切分框</li>
              <li>[ ctrl + [←↑↓→] ]【操作模式】加速单方向移动切分框</li>
              <li>[k] 【操作模式】删除当前切分框/切换</li>
            </ul>
          </div>
        </div>
        <div v-else>
          <div class="img-wrapper">
            <img src="../img/keyboard-op2.png">
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import bus from '@/bus';

export default {
	name: 'HelpPage',

	data() {
		return {
			toHide: true,
      withGlyph: true
		}
	},
  methods: {
    openHelp () {
      this.toHide = false;
    }
  },
    mounted: function() {
    	let _this = this;

    	bus.$on('keyEvent', function(t) {
    		if (t.action == 'help' && t.type == 'keydown')
	    		_this.toHide = _this.toHide ? false : true;
    	})

      if (this.$route.path.includes('confidence') || this.$route.path.includes('classify')) {
        this.withGlyph = true;
      }
      if (this.$route.path.includes('onebyone')) {
        this.withGlyph = false;
      }
    }
}
</script>

