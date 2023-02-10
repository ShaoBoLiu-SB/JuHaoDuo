<template>
  <div class="history">
    <div class="titleBar">
      <h2>我的收藏</h2>
    </div>

    <div class="scriptContainer" v-if="recentRead">
      <div class="scriptBox" v-for="(item, index) in recentRead" :key="index">
        <div class="imgBox">
          <img :src="item.thumb" alt="">
        </div>
        <span>《{{item.book_name}}》</span>
      </div>
    </div>
  </div>
</template>

<script>
import { recentRead } from '@/requests/mine'
export default {
  data() {
    return {
      recentRead: null,
    }
  },

  async mounted() {
    let result = await recentRead();
    // console.log(result.data.data.data);
    if (result) {
      this.recentRead = result.data.data.data;
    }
  }
}
</script>

<style lang="less" scoped>
.history {
  width: 970px;

  .scriptContainer {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;

    .scriptBox {
      width: 124px;
      margin-right: 17px;
      margin-bottom: 20px;

      &:nth-child(7n) {
        margin-right: 0;
      }

      .imgBox {
        width: 100%;
        height: 160px;
        // background-color: cadetblue;
        border:1px solid rgb(238, 238, 238);
        border-radius: 4px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        img {
          height:100%;
        }
      }

      span {
        display: inline-block;
        color: #666666;
        font-size: 14px;
        margin-top: 8px;
        white-space: nowrap;

      }
    }
  }
}

.titleBar {
  h2 {
    border-bottom: 1px solid #d8d8d8;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 10px;
  }
}
</style>