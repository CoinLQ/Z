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
</style>

<template>
<div class="cover" :class="{hide: toHide}">
	<div class="content-wrapper">
    <div class="content">
		  <div class="v1"  v-if="!withGlyph">
        <div class="img-wrapper">
          <img src="../img/keyboard-op1.png">
        </div>
        <div class="text-wrapper">
          <ul>
            <li>[F1] 本帮助页面</li>
            <li>[AWSD] 控制字块的选择</li>
            <li>[←↑↓→] 控制切分框的移动、变形等操作</li>
            <li>[1-9] 控制切分图片的放大倍率</li>
            <li>[x] 移动切分框的四边</li>
          </ul>
          <ul>
            <li>[space] 选中切分框，作为操作对象</li>
            <li>[shift] 放大状态</li>
            <li>[alt] 缩小状态</li>
            <li>[ctrl] 移动步长</li>
            <li>[k] 标记切分框为删除状态/恢复状态</li>
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

