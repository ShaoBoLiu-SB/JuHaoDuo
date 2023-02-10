<template>
  <div class="footerBar">
    <div class="content">
      <div class="links">
        <a @click="$router.push('/home')">首页</a>
        <a @click="$router.push('/script')">剧本</a>
        <a @click="$router.push('/mine')">个人中心</a>
        <a @click="$router.push('/about')">关于我们</a>
        <a>新手帮助</a>
      </div>
      <p>上饶市云上中文信息技术有限公司&nbsp; 版权所有</p>
      <p>网站备案号：赣ICP备2021007645号-1 网络文化经营许可证：赣网文〔2021〕0428-010号 增值电信业务经营许可证：赣B2-20220124</p>
      <div class="beianNumber">
        <img src="@/assets/icons/beian.png" alt="">
        <p>赣公网安备 36110202000351号</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
@import url("@/assets/font.less");

.footerBar {
  width: 100%;
  height: 167px;
  background-color: #fafafa;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9e9e9e;
  padding-top:20px;
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .links {
      color:#666;
      a {
        cursor: pointer;
        border-right: 1px solid #d8d8d8;
        padding-right: 24px;
        margin-left: 24px;
        &:last-child {
          border: none;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
    p {
      margin-top: 10px;
    }
    .beianNumber {
      display: flex;
      align-items: center;
      margin-top:10px;
      img {
        width: 20px;
        height: 20px;
      }
      p {
        margin:0;
      }
    }
  }
}
</style>