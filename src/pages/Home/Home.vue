<template>
  <div class="home">
    <!-- banner -->
    <Banner></Banner>
    <div class="selectAndRank">
      <!-- 优质精选 -->
      <HqSelected :hqSelectedData="hqSelectedData"></HqSelected>
      <!-- 排行榜 -->
      <RankList :rankListData="rankListData"></RankList>
    </div>
    <!-- 推荐作者 -->
    <recommend-author :recommendAuthorData="recommendAuthorData"></recommend-author>
    <!-- 最近更新 -->
    <RecentUpdate></RecentUpdate>
    <!-- <latest-script></latest-script> -->
    <!-- 成交作品 -->
    <!-- <deal-script></deal-script> -->
    <!-- 最近成交 -->
    <RecentDeal :recentDealData="recentDealData"></RecentDeal>
  </div>
</template>

<script>
import Banner from './children/Banner.vue'
import RankList from "./children/RankList";
import HqSelected from "./children/HqSelected.vue";
// import latestScript from "./children/LatestScript";
// import DealScript from '../../notUse/DealScript.vue';
import RecommendAuthor from './children/RecommendAuthor.vue';
import RecentUpdate from './children/RecentUpdate.vue'
import RecentDeal from './children/recentDeal.vue'
import { reqIndexRecommend } from '@/requests/home'

export default {
  data() {
    return {
      homedata: null,
      hqSelectedData: null,
      rankListData: null,
      recommendAuthorData: null,
      recentDealData: null,
    }
  },

  components: {
    Banner,
    RankList,
    HqSelected,
    // latestScript,
    // DealScript,
    RecommendAuthor,
    RecentUpdate,
    RecentDeal
  },

  methods: {
    async getData() {
      let result = await reqIndexRecommend();
      // console.log(result);
      if (result.status == 200) {
        // console.log(result);
        this.homedata = result.data.data;
        this.hqSelectedData = this.homedata.indexCommend[0];
        this.rankListData = this.homedata.indexCommend[1];
        this.recommendAuthorData = this.homedata.indexCommend[2];
        this.recentDealData = this.homedata.dealbook;
      }
    }
  },

  computed: {
  },

  mounted() {
    this.getData();
  },
};
</script>

<style lang="less" scoped>
.selectAndRank {
  width: 1200px;
  margin: 50px auto;
  display: flex;
  justify-content: space-between;
}
</style>