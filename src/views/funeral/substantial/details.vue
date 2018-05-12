<style lang="less">
@import "../funeral.less";
</style>

<template>
  <div class="funeral-details sub-details">
    <div class="details">
      <div class="details-left">
        <Tabs value="name1" class="funeral-details-tabs">
          <TabPane label="经" name="name1" class="funeral-details-tabpane">
            <div class="detail-search-content">
              <Input v-model="detailValue" class="detail-search">
                <Button slot="append" icon="ios-search"></Button>
              </Input>
            </div>
            <Tree :data="menus" class="details-menu"></Tree>
          </TabPane>
          <TabPane label="册" name="name2" class="funeral-details-tabpane">
            <div class="detail-search-content">
              <Input v-model="detailValue" class="detail-search">
                <Button slot="append" icon="ios-search"></Button>
              </Input>
            </div>
            <Tree :data="menus" class="details-menu"></Tree>
          </TabPane>
        </Tabs>
      </div>
      <Card :bordered="false" class="details-right">
        <p slot="title" class="details-right-title">
          <Breadcrumb class="details-right-bread">
            <BreadcrumbItem to="/">永乐北藏</BreadcrumbItem>
            <BreadcrumbItem to="/components/breadcrumb">大波若金属</BreadcrumbItem>
            <BreadcrumbItem>大波若金属</BreadcrumbItem>
          </Breadcrumb>

          <Page :current="2" :total="50" simple></Page>
          <span class="details-right-switch">
            <span>切分</span>
            <Switch size="large" v-model="switchdata" @on-change="change">
              <span slot="open">开启</span>
              <span slot="close">隐藏</span>
            </Switch>
          </span>
        </p>

        <div  class="details-right-main">
          <p>
            No. 1164-10a 灵峰蕅益大师西斋净土诗赞
            岁月无穷寿。含里虚空不老春(此是主。下是伴)。四色蕅花香气远(诸天所居)。诸天童子性情真。况兼善友皆招我。来作逍遥快乐人。


            <div class="right-click-menu">
              <span class="right-click-triangle"></span>
              <ul class="right-click-content">
                <li><Icon type="search"></Icon>全文检索</li>
                <li><Icon type="clipboard"></Icon>标点问题反馈</li>
                <li><Icon type="ios-information"></Icon>格式标注问题反馈</li>
              </ul>
            </div>
          </p>
        </div>
      </Card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      localValue: "",
      detailValue: "",
      switchdata: false,
      menus: [
        {
          title: "龙泉大葬经",
          children: [
            {
              title: "第一章（600）",
              children: [
                {
                  title: "第1卷"
                },
                {
                  title: "第2卷"
                },
                {
                  title: "第3卷"
                },
                {
                  title: "第4卷"
                }
              ]
            },
            {
              title: "第2章（60）",
              children: [
                {
                  title: "第1卷"
                },
                {
                  title: "第2卷"
                },
                {
                  title: "第3卷"
                },
                {
                  title: "第4卷"
                }
              ]
            },
            {
              title: "第3章（60）",
              children: [
                {
                  title: "第1卷"
                },
                {
                  title: "第2卷"
                },
                {
                  title: "第3卷"
                },
                {
                  title: "第4卷"
                }
              ]
            }
          ]
        }
      ]
    };
  },
  methods: {
    change(status) {
      this.$Message.info("开关状态：" + status);
    }
  }
};
</script>