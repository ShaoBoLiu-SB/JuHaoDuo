<template>
  <div class="userMessage">
    <div class="personalMessage">
      <div class="titleBar">
        <h2>个人信息</h2>
      </div>

      <div class="message">
        <div class="row">
          <div class="item">我的昵称: {{ userName }}</div>
          <div class="item">我的手机: {{ userTel }}</div>
        </div>
        <div class="row">
          <div class="item">我的邮箱: {{ userMail }}</div>
          <!-- <div class="item">绑定微信: </div> -->
        </div>
      </div>
    </div>

    <div class="myScript">
      <div class="titleBar">
        <h2>我的剧本 ({{ scriptNumber }})</h2>
      </div>
      <div class="scriptContainer" v-if="myScriptList">
        <div
          class="scriptBox"
          v-for="(item, index) in myScriptList"
          :key="index"
          @click="toscriptDetail(item.id)"
        >
          <div class="imgBox"><img :src="item.thumb" alt="" /></div>
          <span>《{{ item.book_name }}》</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { myScript } from "@/requests/mine";
export default {
  data() {
    return {
      myScriptList: [],
    };
  },
  methods: {
    // 通过网络请求 获取我购买的剧本
    getMyScript(page) {
      myScript(page)
        .then((res) => {
          // console.log(res);
          if (res.data.msg == "success") {
            this.myScriptList = res.data.data.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 点击我购买的剧本, 跳转到剧本页面
    toscriptDetail(book_id) {
      this.$router.push({
        path: "/scriptdetail",
        query: {
          book_id,
        },
      });
    },
  },
  mounted() {
    // 挂载完, 就调用获取我购买剧本的请求
    this.getMyScript();
  },
  computed: {
    scriptNumber() {
      return this.myScriptList.length;
    },
    userName() {
      return localStorage.getItem("userName");
    },
    userTel() {
      return localStorage.getItem("userTel");
    },
    userMail() {
      let uMail = localStorage.getItem("userMail");
      if (uMail) {
        return uMail;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.userMessage {
  width: 970px;

  .personalMessage {
    .message {
      margin-top: 20px;

      .row {
        width: 100%;
        display: flex;
        margin-bottom: 20px;
        color: #666666;
        font-size: 14px;

        .item {
          flex: 1;
        }
      }
    }
  }

  .myScript {
    .scriptContainer {
      display: flex;
      flex-wrap: wrap;
      margin-top: 16px;

      .scriptBox {
        width: 124px;
        margin-right: 17px;
        margin-bottom: 20px;
        cursor: pointer;

        &:nth-child(7n) {
          margin-right: 0;
        }

        .imgBox {
          width: 100%;
          height: 160px;
          // background-color: cadetblue;
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          border: 1px solid rgb(238, 238, 238);

          img {
            // height: 100%;
            width: 100%;
          }
        }

        span {
          display: inline-block;
          color: #666666;
          font-size: 14px;
          margin-top: 8px;
        }
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