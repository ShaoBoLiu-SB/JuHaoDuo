<template>
  <div class="recommendAuthor">
    <!-- 标题栏 和 方向箭头 -->
    <div class="titleBar">
      <!-- 标题 -->
      <div class="title" v-if="recommendAuthorData">{{ recommendAuthorData.title }}</div>
      <!-- 方向箭头 -->
      <div class="controlArrowBox">
        <!-- 更多按钮 -->
        <!-- <div class="moreBtn">
          <span>更多</span>
          <img src="@/assets/icons/rightArrow.png" alt="">
        </div> -->
        <div class="leftArrow" @click="leftArrow" :class="{ activeArrow: this.scrollIndex < 0 }">
          <img src="@/assets/icons/leftArrow.png" alt="" />
        </div>
        <div class="rightArrow" @click="rightArrow" :class="{ activeArrow: this.scrollIndex > -2 }">
          <img src="@/assets/icons/rightArrow.png" alt="" />
        </div>
      </div>
    </div>

    <!-- 下方的推荐作者 -->
    <div class="authors" v-if="recommendAuthorData">
      <div class="authorsContainer" ref="container">
        <div class="authorItem" v-for="(item, index) in recommendAuthorData.writerList" :key="index">
          <div class="authorAvata">
            <img src="@/assets/imgs/author.png" alt="">
          </div>
          <div class="authorMessage">
            <div class="name">{{ item.author_name }}</div>
            <div class="tag">{{ item.sort_name }}</div>
            <div class="numAndScore">
              <div class="scriptNumber">剧本: {{ item.chapter_count }}</div>
              <div class="score">评分: {{ item.score }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['recommendAuthorData'],
  data() {
    return {
      scrollIndex: 0,
    };
  },
  methods: {
    leftArrow() {
      // 判断一下,如果滚到最左边了,那么就不能再滚了
      if (this.scrollIndex < 0) {
        this.scrollIndex += 1;
      }
      let container = this.$refs.container;
      container.style.transform = `translateX(${407 * this.scrollIndex}px)`;
    },
    rightArrow() {
      if (this.recommendAuthorData.writerList.length / 2 < 3) {
        this.scrollIndex = -1;
      }
      // 根据数据的长度, 限制滚动
      // 一行展示3 * 2个剧本,所以这里是3
      // 这里一行是两个 数据是20个, 所以这里的10是(20/2)
      // 所以到时候这里的10应该是(arr.length / 2)
      else if (this.scrollIndex > 3 - (this.recommendAuthorData.writerList.length) / 2) {
        this.scrollIndex -= 1;
      }

      let container = this.$refs.container;
      container.style.transform = `translateX(${407 * this.scrollIndex}px)`;
    },
  },
  computed: {

  }
};
</script>

<style lang="less" scoped>
@import url('@/assets/font.less');

.recommendAuthor {
  width: 1200px;
  margin: 50px auto;
  margin-top: 50px;

  // transform:translateX()
  // 标题栏和方向箭头
  .titleBar {
    display: flex;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid #E5E5E5;

    .title {
      font-size: 22px;
      color: #333333;
      font-weight: 500;
      font: 22px siyuanTitlel;
    }

    .controlArrowBox {
      display: flex;

      .moreBtn {
        width: 76px;
        height: 30px;
        border-radius: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #F6F6F6;
        margin-right: 30px;
        cursor: pointer;

        span {
          color: #333;
          margin-right: 3px;
          font-size: 1px;
        }

        img {
          margin-left: 3px;
          width: 5px;
        }
      }

      .leftArrow,
      .rightArrow {
        cursor: not-allowed;
        margin: 0 5px;
        width: 32px;
        height: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;

        img {
          width: 7px;
        }
      }

      .activeArrow {
        background-color: #e8e8e8;
        border-radius: 100px;
        cursor: pointer;
      }
    }
  }

  // 下方剧本
  .authors {
    width: 1200px;

    // background-color: pink;
    overflow-x: hidden;

    .authorsContainer {
      height: 232px;
      // height: 332px;
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      transition: all 0.5s;

      .authorItem {
        width: 383px;
        height: 104px;
        margin: 0 12px;
        margin-bottom: 12px;
        transition: all 0.3s;
        background-color: #f6f6f6;
        border-radius: 6px;
        display: flex;
        // justify-content: space-between;
        align-items: center;
        padding: 16px;
        box-sizing: border-box;

        &:nth-child(-n+2) {
          margin-left: 0;
        }

        .authorMessage {
          flex: 1;
          margin-left: 23px;
          height: 72px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .name {
            font-size: 14px;
            color: #333;
          }

          .tag {
            width: 44px;
            height: 22px;
            border-radius: 11px;
            background-color: #222;
            line-height: 22px;
            text-align: center;
            color: white;
            font-size: 14px;
            font-weight: 100;
          }

          .numAndScore {
            display: flex;

            .scriptNumber,
            .score {
              color: #333;
              font-size: 14px;
              color: #333;
              margin-right: 16px;
            }
          }
        }
      }
    }
  }
}
</style>