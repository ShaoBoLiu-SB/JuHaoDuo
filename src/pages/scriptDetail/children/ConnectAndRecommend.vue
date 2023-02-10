<template>
  <div class="ConnectAndRecommend" v-if="recommendScript">
    <!-- 联系经纪人 -->
    <div class="connect">
      <div class="jingjiren">
        <div class="leftText">联系经纪人</div>
        <div class="rightMessage">(在线时间: 9:00-18:00)</div>
      </div>
      <div class="qrCode">
        <div class="leftText">微信二维码:</div>
        <div class="rightCode"><img v-if="qrCodeUrl" :src="qrCodeUrl" alt=""></div>
      </div>
      <div class="qq">
        <div class="leftText">QQ:</div>
        <div class="rightQQ">115412312312</div>
      </div>
      <div class="tel">
        <div class="leftText">手机:</div>
        <div class="rightTel">189-8249-4370</div>
      </div>
    </div>
    <!-- 推荐剧本 -->
    <div class="recommend">
      <div class="recTitle">为您推荐以下剧本</div>
      <div class="recScript" v-for="(item, index) in recommendScript" :key="index"
        @click="toScriptDetail(item.book_id)">
        <div class="leftImg">
          <img :src="item.thumb" alt="">
        </div>
        <div class="rightText">
          <div class="scriptTitle">《{{ item.book_name }}》</div>
          <div class="desc">{{ item.intro.trim() }}</div>
          <div class="tag">{{ item.sort_name }}</div>
          <div class="price">￥ 12000</div>
        </div>
      </div>
    </div>
    <!-- 回到剧本列表 -->
    <div class="backScriptList" @click="$router.push('/script')">
      <img src="@/assets/icons/leftArrow.png" alt="">
      <span>返回剧本列表</span>
    </div>
  </div>
</template>

<script>
import { serveQRCode } from '@/requests/scriptDetail'
export default {
  props: ['recommendScript'],
  data() {
    return {
      qrCodeUrl: '',
    }
  },

  methods: {
    // 点击推荐的图书跳转到剧本详情页面
    toScriptDetail(book_id) {
      this.$router.replace({
        path: '/scriptdetail',
        query: {
          book_id
        }
      })
    }
  },
  mounted() {
    // 因为重新刷新页面了, 控制导航栏那个橙色高亮条的vuex数据就被初始化了,所以这里要控制一下
    this.$store.commit('changeActiveIndex', 1)
    // 获取客服微信二维码
    serveQRCode().then(
      res => {
        if (res.data.code == 0) {
          this.qrCodeUrl = res.data.url
        }
      }
    )
  },
  watch: {
    $route() {
      // 因为点击跳转当前路由页面,是不会相应的
      // 这里检测到路由的变化(参数变化),就重新刷新页面
      location.reload();
    }
  }
}
</script>

<style lang="less" scoped>
.ConnectAndRecommend {
  width: 296px;

  .connect {
    width: 296px;
    height: 260px;
    background-color: white;
    padding: 24px 16px;
    box-sizing: border-box;

    .jingjiren {
      display: flex;
      align-items: center;

      .leftText {
        width: 90px;
        font-size: 14px;
        color: #333;
      }

      .rightMessage {
        color: #999;
        font-size: 14px;
      }
    }

    .qrCode {
      display: flex;
      margin-top: 24px;

      .leftText {
        font-size: 14px;
        color: #333;
        width: 90px;
      }

      .rightCode {
        width: 96px;
        height: 96px;
        // background-color: cadetblue;

        img {
          width: 100%;
        }
      }
    }

    .qq {
      color: #333;
      font-size: 14px;
      display: flex;
      margin-top: 20px;

      .leftText {
        width: 90px;
      }
    }

    .tel {
      color: #333;
      font-size: 14px;
      display: flex;
      margin-top: 14px;

      .leftText {
        width: 90px;
      }
    }
  }

  .recommend {
    width: 296px;
    // height: 596px;
    background-color: white;
    margin: 16px 0 8px;
    padding: 24px 16px;
    box-sizing: border-box;

    .recTitle {
      color: #333;
      font-size: 14px;
    }

    .recScript {
      height: 120px;
      display: flex;
      margin: 12px 0;
      cursor: pointer;

      .leftImg {
        width: 90px;
        height: 120px;
        // background-color: cadetblue;
        overflow: hidden;
        border-radius: 4px;
        margin-right: 14px;
        display: flex;
        justify-content: center;

        img {
          // height: 100%;
          width:100%;
        }
      }

      .rightText {
        width: 160px;

        .scriptTitle {
          font-size: 14px;
          color: #333;
          transform: translateX(-5px);
        }

        .desc {
          margin-top: 8px;
          color: #9E9E9E;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2; //2行
          -webkit-box-orient: vertical;
        }

        .tag {
          display: inline-block;
          padding: 1px 6px;
          font-size: 12px;
          border-radius: 2px;
          margin-top: 6px;
          background-color: #feecd9;
          color: #F87D00;
        }

        .price {
          font-size: 12px;
          color: #333;
          margin-top: 8px;
        }
      }
    }


  }

  .backScriptList {
    width: 296px;
    height: 40px;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      margin-right: 3px;
    }

    span {
      margin-left: 3px;
      color: #333;
      font-size: 14px;
    }
  }
}
</style>