<template>
  <div class="altAvatar">
    <div class="titleBar">
      <h2>修改头像</h2>
    </div>

    <section class="inputSection">

      <el-upload class="upload-demo" drag :action="uploadUrl" :on-success="altAvatarReq" name="img" list-type="picture">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>

      <img src="@/assets/icons/uploadAvatar.png" alt="">
      <p>点击或拖拽图片到此处上传</p>
    </section>
    <p>仅支持jpg、jpeg、png图片文件</p>
    <!-- <button>保存提交</button> -->
  </div>
</template>

<script>
import { altAvatar } from '@/requests/mine'
export default {
  methods: {
    altAvatarReq(e) {
      // console.log(e);
      if (e.msg == '修改成功') {
        this.$message({
          message: e.msg,
          type: 'success'
        });
        window.location.reload();
      }
      localStorage.setItem('avatarUrl', e.url)
    }
  },
  computed: {
    uploadUrl() {
      let userToken = localStorage.getItem('userToken')
      return `http://dj.huashengbook.cn/api/user/reviseheadimg?token=${userToken}`
    }
  }
}
</script>

<style lang="less" scoped>
.titleBar {
  h2 {
    border-bottom: 1px solid #d8d8d8;
    color: #333;
    font-size: 18px;
    font-weight: bold;
    padding-bottom: 10px;
  }
}

.altAvatar {
  width: 950px;

  .inputSection {
    width: 208px;
    height: 208px;
    border-radius: 10px;
    outline: 2px dashed #D8D8D8;
    margin: 56px auto;
    position: relative;
    user-select: none;

    /deep/ .upload-demo {
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 9;
    }

    img {
      position: absolute;
      left: 50%;
      top: 40%;
      transform: translateX(-50%);
    }

    p {
      position: absolute;
      left: 50%;
      top: 60%;
      font-size: 14px;
      white-space: nowrap;
      color: #9E9E9E;
      transform: translateX(-50%);
    }
  }

  p {
    margin: 0 auto 10px;
    text-align: center;
    color: #9E9E9E;
    font-size: 14px;
    transform: translateY(-40px);
  }

  button {
    display: block;
    margin: 10px auto;
    width: 88px;
    height: 32px;
    border-radius: 20px;
    background-color: #fcbb8b;
    color: white;
    cursor: pointer;
  }
}
</style>