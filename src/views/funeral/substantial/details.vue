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

　　稽首楚石大导师

　　即是阿弥陀正觉(末法能如此高提祖印者甚难甚难)　　以兹微妙胜伽陀

　　令我读诵当参学(此为后来读此诗者指示榜样。即二有参入妙三观令四悉冷然)　　一读二读尘念消　　三读四读染情薄　　读至十百千万遍　　此身已向莲花托　　亦愿后来读诵者　　同予毕竟生极乐(毕竟亦有事理。事则决定趣向。理则不在别处)　　还摄无边念佛人

　　永破事理分张恶(此楚石大师赋怀净土宗旨。亦是灵峰老人选诗本旨)　　同居净故四俱净　　圆融直捷超方略(二句和盘托出。却深固幽远无人能到)

　　成时曰。事理分张。恶者谓舍西方功德庄严之阿弥陀佛而别计自性弥陀。舍西方功德庄严之极乐世界而别取唯心净土。此则事理乖张成大邪见。自他俱贼隳正法轮。的是恶见恶业。当来必受十方阿鼻大恶报也。同居净故四俱净者。谓西方极乐世界超胜十方一切净土。然其故不在上三净土而在同居。良以博地凡夫圆证三不退。下品人民与一生补处之上善人俱会一处。正报既尔依报亦然。缘生胜妙五尘与妙中谛称性五尘非一非异非远非近。所以横竖俱超横竖俱即。最为不可思义。信则当下便是。拟议则乖。乖则贤智不可以为道。是则愚夫愚妇与知与能。故曰圆融直捷超方略也。

　　No. 1164-10 西斋净土诗(卷一)

　　四明沙门梵琦着

　　西有沙门智旭点定

　　怀净土诗(并序○七十七首)

　　诗云。伐柯伐柯。其则不远。说者曰。睨而视之犹以为远。信斯言也。阿弥陀佛三十二相．八十种好。神通光明华池宝座琼楼玉宇皆我自心发之。心不见心。无相可得。昔天衣怀禅师亲见明觉。尽佛祖不传之妙。常修净土。垂问学者曰。若舍薉取净则是取舍之情。若言无净土又违佛语。当云何修。自答云。生则决定生。去则实不去。余谢事闲居作怀净土诗。劝同袍之士及同社之人。凡有心者悉令念佛。夫何远之有。

　　我佛真身不可量。大人陪从有辉光。食时并是天肴膳。行处无非圣道场。庭下碧流微吐韵。殿前瑶草细吹香。十方一等庄严刹。终说西方出异方(此世界悉檀中之第一义也)。

　　万劫修行相好身。身光知是几由旬。消磨岁月无穷寿。含里虚空不老春(此是主。下是伴)。四色蕅花香气远(诸天所居)。诸天童子性情真。况兼善友皆招我。来作逍遥快乐人。

　　要观无量寿慈容。只在而今心想中。坐断死生来去路。包含地水火风空。顶分肉髻光千道。座压莲华锦一丛(心容如此)。处处登临宝楼阁。真珠璀璨玉玲珑(根心容来)。每为娑婆苦所萦。谁闻净土不求生。天人皆是大乘器。草木亦称三宝名。处处园林如绣出。重重楼阁似生成(所闻净土如此)。诸贤莫怪归来晚。见说芙蕖始发荣(结归谁不求生)。

　　却望(二字贯下六句)金莲宝界遥。楼台一一倚云霄。黄莺韵美春长在。玉树枝柔岁不凋。流水有声随岸转。好花无数逐风飘。野人自选归来日。何待诸贤折简招(豪杰之士)。

　　此邦潇洒乐无厌。遥羡(二字贵到底)诸人智养恬。座用真珠为映饰。台将妙宝作庄严。纯金细砾铺渠底。软玉新梢出树尖。眉相古今描不尽。晚来天际月纤纤(上皆智养恬也)。

　　参差宝构倚层虚。纵有丹青画不如(为甚不如)。林影交飞金孔雀。水光倒浸玉芙蕖。分明池上佛身现。宛转眉间毫相舒。百亿三千大千界。尽令方寸摄无余(果然描不成画不就)。

　　放下身心佛现前(提起下七句皆佛现前也)。寻常盈耳法音宣。风柯但奏无生曲。日观长开不夜天。行趁玉阶云冉冉。坐依珠树月娟娟。凡夫到此皆成圣。不历僧祗道果圆。

　　妙明觉体即如来。暂借莲花养圣胎。瑞相且分三十二。流光何止百千垓(垓借作数目字用)。庄严宝具相随到。细软天衣不假裁(皆不离觉体)。上品上生生死绝。尘尘刹刹紫金台。

　　未归极乐尚阎浮。漂泊风尘更几秋(自痛余生)。残梦频惊蕉叶雨。故乡只在蕅华洲(念佛三昧)。屈伸臂顷无多地。高占人群最上头(两联皆串)。二大士心怜老病。何妨携手上层楼。

　　纸画木雕泥塑成。现成真佛甚分明(此圆妙观智。即地暖波清也)。皈依不是他家事。福德还从自己生。万树花开因地暖。千江月现为波清。朝参暮礼常如此。在处皆通极乐城。

　　念佛功深罪自除(惑业净)。身归极乐国中居(苦果亡)。丛林草木璚瑶接。大地山河锦绣舒(承极乐国中来映上身字谓苦果亡而法身现)。香界来从移步后(应第一句)。宝莲结自放华初(应第二句)。玉毫炳焕黄金面。天上人间总不如。
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