<template>
  <div class="banner">
    <div class="bannerBox">
      <img src="@/assets/imgs/banner.png" alt="" class="bg" />
      <!-- 渐变遮罩(黑色) -->
      <div class="linearMask"></div>
      <!-- 我要创作 -->
      <div class="createScript">
        <h2>剧本创作后台</h2>
        <p>辅助写手持续产出优质内容</p>
        <button @click="toCreate">我要创作</button>
      </div>
      <!-- 挑选剧本 -->
      <div class="selectScript">
        <p>14类题材剧集结构分析与提升</p>
        <button @click="$router.push('/script')">挑选剧本</button>
      </div>
    </div>

    <!-- 平台优势 三个特点 -->
    <div class="plantformAdvantage">
      <div class="advantages">
        <div class="advantageItem">
          <img src="@/assets/icons/camera.png" alt="" />
          <div class="text">
            <h3>剧本交易</h3>
            <p>自由交易可以砍价</p>
          </div>
        </div>
        <div class="advantageItem">
          <img src="@/assets/icons/money.png" alt="" />
          <div class="text">
            <h3>创作赚钱</h3>
            <p>发布剧本自由定价</p>
          </div>
        </div>
        <div class="advantageItem">
          <img src="@/assets/icons/copyright.png" alt="" />
          <div class="text">
            <h3>版权保护</h3>
            <p>剧本一次性买断</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 点击我要创作, 应该去跳转到创作剧本页面
    // 但是还是要进行判断的,
    // 这里只是简单判断一下有没有登录做个提示就好了
    // 进入创作页面已经写好了判断逻辑
    toCreate() {
      let token = localStorage.getItem("userToken");
      if (token) {
        this.$router.push("/author/createnewscript");
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: "请先登录",
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.banner {
  margin: 0 auto;
  // width: 1915px;
  width: 100%;

  .bannerBox {
    width: 100%;
    position: relative;

    .bg {
      // position:absolute;
      // left:0;
      // top:0;
      width: 100%;
      z-index: -1;
    }

    .linearMask {
      position: absolute;
      left: 0;
      top: 0;
      width: 360px;
      height: calc(100% - 10px);
      // height:30px;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.6) 0%,
        rgba(0, 0, 0, 0) 100%
      );
    }

    .createScript {
      position: absolute;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      left: 360px;
      top: 10px;

      h2 {
        color: white;
        font-weight: 700;
        font-size: 36px;
        margin: 0;
      }

      p {
        margin-top: 8px;
        margin-bottom: 18px;
        color: white;
      }

      button {
        background-color: #22222280;
        width: 148px;
        height: 40px;
        color: white;
        font-size: 18px;
        font-weight: 700;
        border-radius: 8px;
        cursor: pointer;
      }
    }

    .selectScript {
      position: absolute;
      right: 360px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      top: 10px;

      p {
        color: white;
        width: 162px;
        font-size: 22px;
      }

      button {
        width: 148px;
        height: 40px;
        background-color: #fe7e1ccc;
        border-radius: 28px;
        color: white;
        font-size: 18px;
        cursor: pointer;
        margin-top: 40px;
      }
    }
  }

  .plantformAdvantage {
    width: 100%;
    height: 80px;
    background-color: #fee5cc;
    transform: translateY(-5px);

    .advantages {
      width: 1200px;
      height: 100%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .advantageItem {
        width: 176px;
        height: 48px;
        display: flex;
        align-items: center;

        .text {
          margin-left: 16px;

          h3 {
            font-weight: 500;
            font-size: 18px;
            color: #333333;
            font-weight: 500;
          }

          p {
            font-size: 14px;
            font-weight: 350;
            color: rgba(102, 102, 102, 0.8);
          }
        }
      }
    }
  }
}
</style>