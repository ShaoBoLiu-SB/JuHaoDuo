<template>
  <div class="rankList">
    <div class="titleBar">
      <!-- 排行榜标题 -->
      <div class="rankTitle" v-if="rankListData">{{ rankListData.title }}</div>
      <!-- <div class="moreButton">
        <span>更多</span>
        <img src="@/assets/icons/rightArrow.png" alt="">
      </div> -->
    </div>
    <!-- 排行榜内容 -->
    <div class="rankContent" v-if="rankListData">
      <div class="rankScript" v-for="(item, index) in rankListData.bookList" :key="item.book_id"
        :class="{ activeRankScript: index == activeIndex }" @mousemove="changeActiveIndex(index)" @click="toScriptDetail(item.book_id)">
        <div class="indexNumber"><span>{{ index + 1 }}</span></div>
        <div class="textBox">
          <div class="scriptName">{{ item.book_name }}</div>
          <div class="desc" :class="{ opacityShow: index == activeIndex }">
            风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下...
          </div>
          <div class="tag" :class="{ opacityShow: index == activeIndex }">{{ item.sort_name }}</div>
        </div>
        <div class="imgTagBox">
          <div class="imgBox" :class="{ opacityShow: index == activeIndex }">
            <img :src="item.thumb" alt="">
          </div>
          <div class="tagText" :class="{ opacityShow: index != activeIndex }">家庭</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['rankListData'],
  data() {
    return {
      activeIndex: 0
    }
  },
  methods: {
    changeActiveIndex(index) {
      this.activeIndex = index;
    },
    toScriptDetail(book_id) {
      this.$router.push({
        path: '/scriptdetail',
        query: {
          book_id
        }
      })
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/font.less');

.rankList {
  width: 282px;

  .titleBar {
    display: flex;
    height: 50px;
    border-bottom: 1px solid #E5E5E5;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    user-select: none;

    .rankTitle {
      font-size: 22px;
      font-weight: 500;
      color: #333;
    }

    .moreButton {
      width: 76px;
      height: 30px;
      border-radius: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f6f6f6;
      cursor: pointer;
      user-select: none;

      span {
        font-size: 14px;
        margin-right: 2px;
      }

      img {
        margin-left: 2px;
        width: 5px;
      }
    }
  }

  .rankContent {
    .rankScript {
      width: 100%;
      height: 56px;
      padding: 16px 0;
      box-sizing: border-box;
      border-bottom: 1px solid #E5E5E5;
      display: flex;
      justify-content: space-between;

      &:nth-child(-n + 3) .indexNumber {
        background-color: #f87d00;
        color: white;
      }

      &:nth-child(n+4) .indexNumber {
        background-color: #E8E8E8;
        color: #9E9E9E;
      }

      .indexNumber {
        width: 24px;
        height: 24px;
        font-family: robota;
        font-size: 14px;
        border-radius: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: -10px;

        span {
          transform: translate(.2px, .5px);
        }
      }

      .textBox {
        margin-left: -70px;

        .scriptName {
          color: #333;
          font-weight: 350;
        }

        .desc {
          color: #9e9e9e;
          font-size: 12px;
          font-weight: 150px;
          width: 144px;
          margin-top: 6px;
          opacity: 0;
        }

        .tag {
          width: 36px;
          height: 18px;
          background-color: rgba(254, 236, 217, 15);
          border-radius: 5px;
          color: #F87D00;
          font-size: 12px;
          text-align: center;
          line-height: 18px;
          margin-top: 5px;

          opacity: 0;
        }
      }

      .imgTagBox {
        position: relative;
        transform: translateX(-75px);

        .imgBox {
          position: absolute;
          top: 0;
          width: 72px;
          height: 96px;
          border-radius: 4px;
          overflow: hidden;
          background-color: cadetblue;
          opacity: 0;
          display: flex;

          img {
            width: 100%;
          }
        }

        .tagText {
          position: absolute;
          top: 0;
          width: 72px;
          font-size: 14px;
          text-align: right;
          color: #666666;
          padding-right: 5px;
          box-sizing: border-box;
          opacity: 0;
        }
      }
    }

    .activeRankScript {
      height: 130px;
      cursor: pointer;
    }

    .opacityShow {
      opacity: 1 !important;
    }
  }

}
</style>