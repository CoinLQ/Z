<style scoped>
@import './css/base.css'
</style>

<template>
<div id="judge">
  <div class="container">
    <div class="row">
      <div class="judge-base-text" id="judge-base-text">
        <span v-for="e in merged_base_text">
            <span is="sutra-unit" :data="e" :sharedata="sharedata"></span>
        </span>
      </div>
      <!--<div>选择标点：
        <select>
          <option>CBETA</option>
          <option>高丽藏</option>
        </select>
      </div>-->
    </div>
    <div class="row">
      <ul class="diffseg-region">
        <li v-for="(diffsegresult, index) in sharedata.diffsegresults">
          <div is="diffseg-box" :diffsegresult="diffsegresult" :segindex="index" :sharedata="sharedata"></div>
        </li>
      </ul>
      <Page :current="diffseg_curpage" :total="diffseg_page_count" simple @on-change="changePage"></Page>

      <div class="text-center">
        <Button type="info" long :disabled="not_all_selected || (sharedata.status == 4)" @click.stop.prevent="finishJudgeTask">提交</Button>
      </div>
    </div>
    <div class="row">
      <component is="judge-dialog" :sharedata="sharedata" v-on:reload="judgeDone(diffseg_curpage)"></component>
      <component is="merge-dialog" :sharedata="sharedata" v-on:reload="mergeSplitDone(diffseg_curpage)"></component>
      <component is="split-dialog" :sharedata="sharedata" v-on:reload="mergeSplitDone(diffseg_curpage)"></component>
    </div>
  </div>
</div>

</template>
<script src="./js/tripitaka.js"></script>>
<script>
import axios from 'axios';
import util from '@/libs/util'

import tripitaka from './js/tripitaka.js'
import splitDialog from './comps/splitDialog'
import mergeDialog from './comps/mergeDialog'
import judgeDialog from './comps/judgeDialog'
import diffsegBox from './comps/diffsegBox'
import sutraUnit from './comps/sutraUnit'

export default {
  name: 'correct',
  components: {judgeDialog, mergeDialog, splitDialog, diffsegBox, sutraUnit},

  data() {
    return {
      base_text: '',
      diffseg_pos_lst: [],
      punct_lst: '',
      diffseg_page_count: 1,
      diffseg_curpage: 1,
      merged_base_text: [],
      not_all_selected: true,
      submit_title: '',
      sharedata: {task_id: 4, status: 0, base_tripitaka_id: null, judgeDialogVisible: false, mergeDialogVisible: false, splitDialogVisible: false, segindex: -1, diffseg_no: 0, diffsegresults: []  }
    }
  },
  mounted() {
    var vm = this
    util.ajax.get('/api/judge/' + vm.sharedata.task_id + '/')
    .then(function(response) {
      vm.base_text = response.data.base_text;
      vm.diffseg_pos_lst = response.data.diffseg_pos_lst;
      vm.punct_lst = response.data.punct_lst;
      vm.sharedata.base_tripitaka_id = response.data.base_tripitaka_id;
      vm.sharedata.status = response.data.status;
      vm.loadSutraText();
      if (vm.sharedata.status == 4) {
        vm.submit_title = '已完成';
      } else {
        vm.submit_title = '请判取完再提交';
      }
    });
    this.reloadDiffsegs(1);
    this.checkAllSelected();
    //console.log(lines);
    //this.merged_base_text = lines.join('<br />');
    //console.log(this.merged_base_text);
    //var lines = tripitaka.judge_merge_text_punct1(this.base_text, this.diffseg_pos_lst, this.punct_lst);
    //$('#judge-base-text2').html(lines.join('<br />'));

    // 点击每个校勘记区域时，将底本经文中对应的文本段置为红色，并进入可视区。
    // $('.diffseg-box').click(function(e){
    //   var diffseg_id = $(this).attr('diffseg-id');
    //   var tag = $('#diffseg-tag-' + diffseg_id);
    //   var offset = tag.position().top - 60;
    //   $('.diffseg-tag').removeClass('diffseg-tag-selected');
    //   $('.diffseg-tag').removeClass('diffseg-tag-notext-selected');
    //   if (tag.hasClass('diffseg-tag-notext')) {
    //     tag.addClass('diffseg-tag-notext-selected');
    //   } else {
    //     tag.addClass('diffseg-tag-selected');
    //   }
    //   $('div.judge-base-text').animate({
    //     scrollTop: offset + $('div.judge-base-text').scrollTop()
    //   }, 500);
    // });
  },
  watch: {
    diffseg_curpage: function (newPage, oldPage) {
      this.reloadDiffsegs(newPage);
    }
  },
  methods: {
    loadSutraText: function() {
      // 加载底本经文
      console.log(tripitaka)
      this.merged_base_text = tripitaka.judge_merge_text_punct(this.base_text, this.diffseg_pos_lst, this.punct_lst);
    },
    changePage(page) {
      this.diffseg_curpage = page;
    },
    reloadDiffsegs: function(newPage) {
      var vm = this
      util.ajax.get('/api/judge/' + vm.sharedata.task_id + '/diffsegresults/?page=' + newPage)
      .then(function(response) {
        var diffseg_count = response.data.count;
        if (diffseg_count > 1) {
          vm.diffseg_page_count = parseInt((diffseg_count - 1) / 5) + 1;
        }
        var diffsegresults = response.data.results;
        for (var i = 0; i < diffsegresults.length; ++i) {
          var diffsegtexts = diffsegresults[i].diffseg.diffsegtexts;
          var text_to_diffsegtexts = {};
          var text_count = 0;
          for (var j = 0; j < diffsegtexts.length; ++j) {
            var text = diffsegtexts[j].text;
            if (text in text_to_diffsegtexts) {
              text_to_diffsegtexts[text].push(diffsegtexts[j]);
            } else {
              text_to_diffsegtexts[text] = [ diffsegtexts[j] ];
              text_count++;
            }
          }
          diffsegresults[i].text_to_diffsegtexts = text_to_diffsegtexts;
          diffsegresults[i].text_count = text_count;
        }
        vm.sharedata.diffsegresults = diffsegresults;
        vm.sharedata.segindex = 0;
      });
    },
    checkAllSelected: function() {
      var vm = this
      util.ajax.get('/api/judge/' + vm.sharedata.task_id + '/allselected/')
      .then(function(response) {
        vm.not_all_selected = ! response.data.all_selected;
      })
    },
    setCurrentSeg: function (diffseg_id) {
      this.current_diffseg_id = diffseg_id;
    },
    judgeDone: function(newPage) {
      this.reloadDiffsegs(newPage);
      this.checkAllSelected();
    },
    mergeSplitDone: function(newPage) {
      this.reloadDiffsegs(newPage);
      this.checkAllSelected();
    },
    finishJudgeTask: function() {
      var vm = this;
      util.ajax.post('/api/judge/' + this.sharedata.task_id + '/finish/')
      .then(function(response) {
        alert('提交成功！');
      })
      .catch(function (error) {
        vm.error = '提交出错！';
      });
    }
  }
}

</script>
