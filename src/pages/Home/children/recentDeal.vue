<template>
  <div class="recentDeal" v-if="recentDealData">
    <div class="titleBar">
      <div class="title">最近成交</div>
      <!-- <div class="moreBtn">
        <span>更多</span>
        <img src="@/assets/icons/rightArrow.png" alt="" />
      </div> -->
    </div>
    <!-- 最近成交剧本信息 -->
    <div class="dealMessage" v-if="recentDealData">
      <!-- 首行类型头 -->
      <div class="titleRow">
        <div class="typeTitle">类型</div>
        <div class="scriptNameTitle">剧本名</div>
        <div class="authorTitle">作者</div>
        <div class="dealTimeTitle">交易时间</div>
      </div>

      <!-- 剧本交易信息 -->
      <div
        class="scriptMessage"
        v-for="item in recentDealData"
        :key="item.book_id"
        @click="toScriptDetail(item.book_id)"
      >
        <div class="type">{{ item.sort_name }}</div>
        <div class="scriptName">{{ item.book_name }}</div>
        <div class="author">{{ item.author }}</div>
        <div class="dealTime">{{ item.paytime }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["recentDealData"],
  data() {
    return {};
  },

  methods: {
    // 点击最近成交, 跳转到详情页面
    toScriptDetail(book_id) {
      this.$router.push({
        path: "/scriptdetail",
        query: {
          book_id,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/font.less");

.recentDeal {
  width: 1200px;
  margin: 0px auto;
  margin-bottom: 50px;
}

.titleBar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 20px;

  .title {
    font-size: 22px;
    font-weight: 500;
    font-family: siyuanTitle;
  }

  .moreBtn {
    width: 76px;
    height: 30px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f6f6f6;

    span {
      color: #333333;
      font-size: 14px;
      margin-right: 3px;
    }

    img {
      margin-left: 3px;
      width: 5px;
    }
  }
}

.dealMessage {
  .titleRow {
    height: 22px;
    color: #9e9e9e;
    display: flex;
    margin: 12px 0;

    .typeTitle {
      width: 238px;
    }

    .scriptNameTitle {
      width: 274px;
    }

    .authorTitle {
      width: 498px;
    }

    .dealTimeTitle {
      flex: 1;
    }
  }

  .scriptMessage {
    display: flex;
    height: 51px;
    line-height: 51px;
    cursor: pointer;

    &:hover {
      background-color: #fafafa;
    }

    &:hover .scriptName {
      color: #f87d00;
    }

    .type {
      width: 238px;
      color: #9e9e9e;
    }

    .scriptName {
      width: 274px;
      color: #333333;
    }

    .author {
      width: 498px;
      color: #333;
    }

    .dealTime {
      flex: 1;
      font-family: robota;
    }
  }
}
</style>