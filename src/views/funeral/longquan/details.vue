<style lang="less" scoped>
@import "../funeral.less";
</style>

<template>
  <div class="funeral-details">
    <div class="details-header">
      <Input v-model="localValue" class="local-search">
          <Button slot="append" icon="ios-search"></Button>
      </Input>
    </div>
    <div class="details">
      <div class="details-left">
        <div class="detail-search-content">
          <Input v-model="detailValue" class="detail-search">
            <Button slot="append" icon="ios-search"></Button>
          </Input>
        </div>
        <Tree :data="menus" class="details-menu"></Tree>
      </div>
      <div class="details-right">
        <p>
          No. 1164-10a 灵峰蕅益大师西斋净土诗赞
          岁月无穷寿。含里虚空不老春(此是主。下是伴)。四色蕅花香气远(诸天所居)。诸天童子性情真。况兼善友皆招我。来作逍遥快乐人。
        </p>
        <div class="right-click-menu">
          <span class="right-click-triangle"></span>
          <div class="right-click-content">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
              <Row type="flex">
                <Col span="24">
                  <Col span="8">判取</Col>
                  <Col span="8">版本</Col>
                  <Col span="8">用字</Col>
                </Col>
                <Col span="24">
                  <Col span="8"><Radio v-model="single"></Radio></Col>
                  <Col span="8">高丽</Col>
                  <Col span="8">菩提</Col>
                </Col>
                <Col span="24">
                  <Col span="8"><Radio v-model="single"></Radio></Col>
                  <Col span="8">高丽</Col>
                  <Col span="8">菩提</Col>
                </Col>
              </Row>
              <div class="modal-fankui">
                <span>反馈判取：</span>
                <Input placeholder="" clearable></Input>
              </div>
              <div class="modal-fankui">
                <div>存疑说明：</div>
                <Input type="textarea" :rows="4" placeholder=""></Input>
              </div>
              <div class="modal-btngroup">
                <Button type="ghost" @click="handleSubmit('formCustom')">确定</Button>
                <Button type="ghost" @click="handleReset('formCustom')" style="margin-left: 8px">取消</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      localValue: "",
      detailValue: "",
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
      ],
      columns1: [
        {
          title: "Name",
          key: "name"
        },
        {
          title: "Age",
          key: "age"
        },
        {
          title: "Address",
          key: "address"
        }
      ],
      data1: [
        {
          name: "John Brown",
          age: 18,
          address: "New York No. 1 Lake Park",
          date: "2016-10-03"
        },
        {
          name: "Jim Green",
          age: 24,
          address: "London No. 1 Lake Park",
          date: "2016-10-01"
        },
        {
          name: "Joe Black",
          age: 30,
          address: "Sydney No. 1 Lake Park",
          date: "2016-10-02"
        },
        {
          name: "Jon Snow",
          age: 26,
          address: "Ottawa No. 2 Lake Park",
          date: "2016-10-04"
        }
      ]
    };
  }
};
</script>