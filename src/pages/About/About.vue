<template>
  <div class="about">
    <!-- 关于我们页面标题栏 -->
    <div class="pageTitleBar">
      <div class="content"><span>关于我们</span></div>
    </div>

    <div class="descArea">
      司马光，字君实，号迂叟，陕州夏县涑水乡人，《宋史》，《辞海》等明确记载，世称涑水先生。生于河南省信阳市光山县。北宋史学家、文学家。历仕仁宗、英宗、神宗、哲宗四朝，卒赠太师、温国公，谥文正，主持编纂了中国历史上第一部编年体通史《资治通鉴》，为人温良谦恭、刚正不阿，其人格堪称儒学教化下的典范，历来受人景仰。生平著作甚多，主要有史学巨著《资治通鉴》、《温国文正司马公文集》、《稽古录》、《涑水记闻》、《潜虚》等。司马光，字君实，号迂叟，陕州夏县涑水乡人，《宋史》，《辞海》等明确记载，世称涑水先生。生于河南省信阳市光山县。北宋史学家、文学家。历仕仁宗、英宗、神宗、哲宗四朝，卒赠太师、温国公，谥文正，主持编纂了中国历史上第一部编年体通史《资治通鉴》，为人温良谦恭、刚正不阿，其人格堪称儒学教化下的典范，历来受人景仰。生平著作甚多，主要有史学巨著《资治通鉴》、《温国文正司马公文集》、《稽古录》、《涑水记闻》、《潜虚》等。司马光，字君实，号迂叟，陕州夏县涑水乡人，《宋史》，《辞海》等明确记载，世称涑水先生。生于河南省信阳市光山县。北宋史学家、文学家。历仕仁宗、英宗、神宗、哲宗四朝，卒赠太师、温国公，谥文正，主持编纂了中国历史上第一部编年体通史《资治通鉴》，为人温良谦恭、刚正不阿，其人格堪称儒学教化下的典范，历来受人景仰。生平著作甚多，主要有史学巨著《资治通鉴》、《温国文正司马公文集》、《稽古录》、《涑水记闻》、《潜虚》等。
    </div>

    <p class="desire">
      <span>
        企业愿景:
        蹴罢秋千，起来慵整纤纤手。露浓花瘦，薄汗轻衣透。见客入来，袜刬金钗溜。和羞走，倚门回首，却把青梅嗅。</span
      >
    </p>

    <p class="title">联系方式</p>

    <div class="companyInformation">
      <div class="informationItem">
        公司名称：上饶市云上中文信息技术有限公司
      </div>
      <div class="informationItem">
        地址：江西省上饶市高铁经济试验区文创南区 3 号楼3 楼
      </div>
      <div class="informationItem">邮箱：m5h53209lb9@gmail.com</div>
      <div class="informationItem">微信：4651354（合作交流请扫码）</div>
      <div class="content">
        <div class="qrCodeBox"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  mounted() {
    this.$store.commit("changeActiveIndex", 3);
  },
};
</script>

<style lang="less" scoped>
.about {
  .pageTitleBar {
    width: 100%;
    height: 100px;
    line-height: 100px;
    background: url(@/assets/imgs/bg.png) center center;
    background-size: 100% auto;
    .content {
      width: 1200px;
      margin: 0 auto;
      color: #333333;
    }
  }

  .descArea {
    width: 1200px;
    margin: 20px auto;
    color: #666666;
    line-height: 30px;
  }

  .desire {
    width: 1200px;
    margin: 0 auto;
    color: #666;
  }

  .title {
    margin: 40px auto 24px;
    width: 1200px;
    color: #333;
  }
.companyInformation {
  width: 1200px;
  margin: 0 auto;;
}
  .informationItem {
    width: 1200px;
    color: #666;
    margin: 20px auto;
    line-height: 30px;
  }

  .qrCodeBox {
    display: inline-block;
    background-color: #e8e8e8;
    width: 160px;
    height: 160px;
    border-radius: 6px;
  }
}
</style>