<template>
  <div class="recentUpdate">
    <!-- 标题栏 和 方向箭头 -->
    <div class="titleBar">
      <!-- 标题 -->
      <div class="title">最近更新</div>
      <!-- 方向箭头 -->
      <div class="controlArrowBox">
        <!-- 更多按钮 -->
        <div
          class="leftArrow"
          @click="leftArrow"
          :class="{ activeArrow: this.scrollIndex > 0 }"
        >
          <img src="@/assets/icons/leftArrow.png" alt="" />
        </div>
        <div class="pageIndex">{{ scrollIndex + 1 }} / {{ pageNumber }}</div>
        <div
          class="rightArrow"
          @click="rightArrow"
          :class="{ activeArrow: this.scrollIndex < pageNumber - 1 }"
        >
          <img src="@/assets/icons/rightArrow.png" alt="" />
        </div>
      </div>
    </div>

    <!-- 最近更新的剧本 -->
    <div class="updateScripts">
      <div class="scriptContainer" ref="container">
        <div
          class="scriptItem"
          v-for="(item, index) in recentUpdateList"
          :key="index"
        >
          <div class="scriptImgBox">
            <img :src="item.thumb" @click="toScriptDetail(item.book_id)" />
            <div class="tag">{{ item.sort_name }}</div>
          </div>
          <div class="scriptMessage">
            <div class="name">{{ item.book_name }}</div>
            <div class="dealTime" v-if="item.update_time">
              {{ item.update_time.slice(0, item.update_time.length - 8) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reqRecentUpdate } from "@/requests/home";
export default {
  data() {
    return {
      scrollIndex: 0,
      recentUpdateList: 32,
      transformX: 0,
      pageSize: 8,
    };
  },

  mounted() {
    this.getData();
  },
  computed: {
    // 根据最近更新剧本的数据长度,获取一下页面数量
    pageNumber() {
      return Math.ceil(this.recentUpdateList.length / 8);
    },
    // 往后滚: 确定前面几页是满额页面
    fontPageIndex() {
      if (this.recentUpdateList.length % this.pageSize == 0) {
        return this.recentUpdateList.length / this.pageSize - 1; //32条的话,就是4页,取前三页, 这就就是3
      } else {
        return Math.floor(this.recentUpdateList.length / this.pageSize); //30条的话,也是4页, 也是要前三页, 取3
      }
    },
    shortTime(time) {
      return time.slice(0, time.length - 8);
    },
  },
  methods: {
    // 获取最近更新的数据
    async getData() {
      let result = await reqRecentUpdate();
      this.recentUpdateList = result.data.data.recently;
    },

    // 点击最近更新, 跳转到详情页面
    toScriptDetail(book_id) {
      this.$router.push({
        path: "/scriptdetail",
        query: {
          book_id,
        },
      });
    },

    // 点击左右箭头的逻辑
    rightArrow() {
      // 判断一下,如果滚到最左边了,那么就不能再滚了,满足条件才能执行,不满足不执行
      if (this.scrollIndex < this.pageNumber - 1) {
        this.scrollIndex += 1;
        let container = this.$refs.container;

        // 判断一下当前是不是满额页面
        if (this.scrollIndex < this.fontPageIndex) {
          this.transformX += -153 * this.pageSize;
          // 是满额页面,就满额滚动
          container.style.transform = `translateX(${this.transformX}px)`;
        } else {
          // 这里是冗余页面
          // 算一下这里冗余了几个
          let surplusPage = this.recentUpdateList.length % this.pageSize;
          if (surplusPage == 0) {
            // 刚好冗余的是满页, 那就加上满额的滚动值
            this.transformX += -153 * this.pageSize;
          } else {
            // 根据冗余的数量, 来加上滚动值
            this.transformX += -153 * surplusPage;
          }
          container.style.transform = `translateX(${this.transformX}px)`;
        }
      } else {
        return;
      }
    },
    leftArrow() {
      // 往左滚逻辑简单
      // 只在第一页才有可能会冗余
      // 往左滚默认滚满额
      // 当滚到第一页,默认translateX = 0 即可
      if (this.scrollIndex > 0) {
        this.scrollIndex -= 1;
        let container = this.$refs.container;
        if (this.scrollIndex != 0) {
          this.transformX -= -153 * this.pageSize;
        } else {
          this.transformX = 0;
        }
        container.style.transform = `translateX(${this.transformX}px)`;
      } else {
        return;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.recentUpdate {
  width: 1200px;
  margin: 50px auto;
  margin-top: 50px;

  // transform:translateX()
  // 标题栏和方向箭头
  .titleBar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid #e5e5e5;

    .title {
      font-size: 22px;
      color: #333333;
      font-weight: 500;
    }

    .pageIndex {
      font-family: robota;
      line-height: 30px;
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
        background-color: #f6f6f6;
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
  .updateScripts {
    width: 1200px;
    overflow-x: hidden;

    .scriptContainer {
      height: 232px;
      // height: 332px;
      display: flex;
      flex-wrap: no-wrap;
      transition: all 1s ease-in-out;

      .scriptItem {
        width: 180px;
        // height: 177px;
        margin: 0 12px;
        margin-bottom: 12px;
        transition: all 0.3s;
        // background-color: #f6f6f6;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        align-items: center;
        box-sizing: border-box;

        &:first-child {
          margin-left: 0;
        }

        &:last-child {
          margin-right: 0;
        }

        .scriptImgBox {
          width: 129px;
          height: 180px;
          border-radius: 6px;
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;

          img {
            // width:100%;
            // width: 129px;
            height: 100%;
            cursor: pointer;
          }

          .tag {
            position: absolute;
            bottom: 5px;
            left: 5px;
            width: 36px;
            height: 18px;
            background-color: rgba(0, 0, 0, 0.45);
            text-align: center;
            line-height: 18px;
            font-size: 12px;
            color: white;
            border-radius: 2px;
          }
        }

        .scriptMessage {
          flex: 1;
          height: 72px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;

          .name {
            font-size: 14px;
            color: #333;
            font-weight: 500;
            margin: 6px 0;
          }

          .dealTime {
            font-family: tobota;
            font-size: 14px;
            color: #999;
          }
        }
      }
    }
  }
}
</style>