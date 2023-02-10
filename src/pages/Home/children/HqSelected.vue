<template>
  <div class="hqSelected">
    <!-- 优质精选标题 -->
    <div class="title" v-if="hqSelectedData">{{ hqSelectedData.title }}</div>
    <!-- 剧本内容 -->
    <div class="scriptContent" v-if="hqSelectedData">
      <div class="script" v-for="(item, index) in hqSelectedData.bookList" :key="item.book_id"
        @click="toScriptDetail(item.book_id)">
        <div class="imgBox">
          <img :src="item.thumb" alt="">
        </div>
        <div class="textBox">
          <div class="scriptName">{{ item.book_name }}</div>
          <div class="desc">风急天高猿啸哀，渚清沙白鸟飞回。无边落木萧萧下，不尽</div>
          <div class="tag">{{ item.sort_name }}</div>
          <div class="price" v-if="index != 0">￥{{ item.chapter_count }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['hqSelectedData'],

  data() {
    return {

    };
  },

  methods: {
    toScriptDetail(book_id) {
      this.$router.push({
        path: '/scriptdetail',
        query: {
          book_id
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
@import url('@/assets/font.less');

.hqSelected {
  width: 852px;

  .title {
    border-bottom: 1px solid #E5E5E5;
    height: 50px;
    font: 22px siyuanTitlel;
    margin-bottom: 40px;
  }

  .scriptContent {
    width: 100%;
    height: 424px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;

    .script {
      cursor: pointer;

      &:first-child {
        height: 424px;
        width: 216px;
        margin-bottom: 0;
        flex-direction: column;

        .imgBox {
          width: 100%;
          height: 296px;
          background-color: cadetblue;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .textBox {
          width: 100%;
          height: 128px;
          background-color: #F4F4F4;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          padding: 12px;
          box-sizing: border-box;

          .scriptName {
            font-size: 18px;
            font-weight: 350;
            color: #333;
          }

          .author,
          .desc {
            margin-top: 8px;
            font-size: 12px;
            font-weight: 350;
            color: #9e9e9e;
          }

          .desc {
            margin-top: 4px;
          }

          .price {
            font-family: robota;
            font-size: 12px;
            font-weight: 500;
          }
        }
      }

      &:nth-child(4) {
        margin-bottom: 0;
        margin-left: 48px;
        margin-right: 48px;
      }

      &:nth-child(2),
      &:nth-child(3) {
        margin-left: 48px;
        margin-right: 48px;
      }

      &:last-child {
        margin-bottom: 0;
      }

      height:120px;
      width: 270px;
      margin-bottom:32px;
      display: flex;

      .imgBox {
        display: flex;
        width: 90px;
        height: 120px;
        margin-right: 20px;
        background-color: cadetblue;
        border-radius: 4px;
        overflow: hidden;

        img {
          width: 110%;
        }
      }

      .textBox {
        display: inline-block;
        width: 160px;
        height: 120px;

        .scriptName {
          font-weight: 350;
          font-size: 16px;
          color: #333;
        }

        .desc {
          font-size: 12px;
          font-weight: 350;
          color: #9e9e9e;
          margin: 4px 0;
          line-height: 22px;
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
          margin-bottom: 5px;
        }
      }
    }
  }
}
</style>