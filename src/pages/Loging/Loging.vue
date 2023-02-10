<template>
  <div class="loging" v-if="state">
    <img src="@/assets/icons/greenSuccess.png" alt="" />
    <p>登录成功, <a @click="backLink">点击</a>返回</p>
  </div>
</template>

<script>
import { qrcodeLoginCheck } from "@/requests/login";
export default {
  data() {
    return {
      state: null,
    };
  },
  methods: {
    // 点击跳转回扫码页面
    backLink() {
      let toRouter = localStorage.getItem("beforeUrl").toString();
      // 莫名拼接了一个state, 那就裁切一下 保留state之前的数据
      toRouter = toRouter.split("state")[0];
      window.location.href = toRouter;
    },
  },
  mounted() {
    // 扫码之后到loging这个中间页, 先拿到state这个确认用户的参数
    var url = location.href;
    let strs = url.split("=");
    let state = strs[1];
    this.state = state;
    let toRouter = localStorage.getItem("beforeUrl").toString();
    toRouter = toRouter.split("state")[0];

    qrcodeLoginCheck(state).then(
      (res) => {
        // console.log(res);
        if (res.data.msg == "success") {
          localStorage.setItem("userToken", res.data.data.token);
          localStorage.setItem("userName", res.data.data.username);
          localStorage.setItem("uid", res.data.data.uid);
          // 修改vuex里面的登录状态
          this.$store.commit("changeLogin", true);
        } else if (res.data.msg == "请重新获取二维码") {
          this.$router.push("/home");

          // alert("请重新获取二维码");
          
          // window.location.href = toRouter;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  },
};
</script>

<style lang="less" scoped>
.loging {
  width: 100%;
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    margin-top: 15px;
  }
  a {
    color: #fa7e02;
    cursor: pointer;
  }
}
</style>