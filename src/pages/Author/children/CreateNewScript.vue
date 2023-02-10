<template>
  <div class="createNewScript">
    <!-- 标题 -->
    <div class="titleBar">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/icons/leftArrow.png" alt="" />
        <span>创建剧本</span>
      </div>
      <div class="right">
        <span>审核规则</span>
        <img src="@/assets/icons/moreInformation..png" alt="" />
      </div>
    </div>
    <div class="contentSection">
      <div class="leftCover">
        <div class="coverBox">
          <el-upload
            class="upload-demo"
            drag
            :action="uploadCover"
            name="img"
            list-type="picture"
            :on-success="handleAvatarSuccess"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将图片拖到此处，或<em>点击上传</em>
            </div>
          </el-upload>
        </div>
        <!-- <div class="uploadButton">上传封面</div> -->
      </div>
      <div class="rightForm">
        <!-- 剧本标题 -->
        <div class="inputRow">
          <div class="inputTitle">剧本名称</div>
          <el-input
            type="text"
            placeholder="请输入剧本名称"
            v-model.lazy="scriptTitle"
            maxlength="15"
            show-word-limit
          >
          </el-input>
        </div>
        <!-- 剧本标签 -->
        <div class="inputRow">
          <div class="inputTitle">剧本分类</div>
          <el-select v-model="scriptTag" clearable placeholder="请选择剧本分类">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.id"
            >
              {{ item.value }}
            </el-option>
          </el-select>
        </div>
        <!-- 剧本简介 -->
        <div class="inputRow">
          <div class="inputTitle" style="margin-right: 8px">作品简介</div>
          <el-input
            type="textarea"
            resize="none"
            placeholder="请输入剧本简介"
            v-model.lazy="scriptShortcut"
            maxlength="500"
            show-word-limit
          >
          </el-input>
        </div>

        <!-- 上传txt内容 -->
        <div class="inputRow">
          <div class="inputTitle notMust">上传剧本</div>
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :on-change="onChange"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
            :limit="1"
            accept=".txt"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选取文件</el-button
            >
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
            <div slot="tip" class="el-upload__tip">只能上传txt文件，</div>
          </el-upload>
        </div>

        <!-- 剧本价格 -->
        <div class="inputRow priceInput">
          <div class="inputTitle">价格</div>
          <span class="moneyIcon">￥</span>
          <input
            type="number"
            v-model="scriptPrice"
            placeholder="填写价格"
            min="0"
          />
          <span class="yuan">元</span>
        </div>
        <!-- 创建剧本两个按钮 -->
        <div class="inputRow twoBtn">
          <button class="createRightNow" @click="submit">立即创建</button>
          <button @click="$router.go(-1)">取消</button>
        </div>
      </div>
      <!-- 输入价格 -->
    </div>
  </div>
</template>

<script>
import { createNewScript, createCenter } from "@/requests/author";
export default {
  data() {
    return {
      scriptTitle: "", //剧本标题
      imageUrl: "", //封面图片
      scriptShortcut: "", //剧本简介
      fileList: [], //剧本文件
      scriptPrice: null, //剧本价格
      params: {}, //要上传的数据
      // 剧本标签选项
      options: [
        {
          value: "二次元",
          label: "二次元",
          id: 0,
        },
        {
          value: "玄幻",
          label: "玄幻",
          id: 1,
        },
        {
          value: "奇幻",
          label: "奇幻",
          id: 2,
        },
        {
          value: "武侠",
          label: "武侠",
          id: 3,
        },
        {
          value: "仙侠",
          label: "仙侠",
          id: 4,
        },
        {
          value: "都市",
          label: "都市",
          id: 5,
        },
      ],
      scriptTag: "",
    };
  },
  methods: {
    // 这里要做的提示太多了, 把这个消息提示封装起来
    msgTip(msgTip, type) {
      this.$message({
        showClose: true,
        duration: 2000,
        message: msgTip,
        type: type,
      });
    },

    onChange(file, fileList) {
      // console.log(file, fileList, "fileList!!!");
      this.fileList = fileList;
    },
    // 上传超出限制的操作
    handleExceed() {},
    handleRemove() {},
    handlePreview() {},

    // 上传剧本封面结果
    handleAvatarSuccess(e) {
      // console.log(e);
      if (e.msg == "上传成功") {
        this.imageUrl = e.url;
      }
    },
    submit() {
      // let params = {};
      // params.thumb = this.imageUrl;
      // params.drama = this.fileList[0].raw;
      // params.book_name = this.scriptTitle;
      // params.intro = this.scriptShortcut;
      // params.price = this.scriptPrice;
      // params.sort_id = this.scriptTag;
      // params.scene_id = 2;
      // params.keyword = []
      // params.keyword.push('种田')
      // params.keyword.push('都市')
      // params.keyword.push('南桐')

      let params = new FormData();
      params.append("thumb", this.imageUrl);
      // 注意: 没有上传文件, 这里就不往form-data加剧本文件, 不然会报错!
      if (this.fileList.length) {
        params.append("drama", this.fileList[0].raw);
      }
      params.append("book_name", this.scriptTitle);
      params.append("intro", this.scriptShortcut);
      params.append("price", this.scriptPrice);
      params.append("sort_id", this.scriptTitle);
      params.append("scene_id", 2);
      // params.keyword("keyword", ["种田", "都市", "南桐"]);

      // console.log(params);

      createNewScript(params).then(
        (res) => {
          // console.log(res);
          if (res.data.code == 2001) {
            this.msgTip(res.data.msg, 'info');
          }
          if (res.data.status == 2000) {
            this.msgTip(res.data.msg, "info");
          }
          if (res.data.status == 0) {
            this.msgTip(res.data.msg, "info");
            this.$router.push("/author/worksadmain");
          }
        },
        (err) => {
          console.log(err, "错误!");
        }
      );
    },
  },
  computed: {
    uploadUrl() {
      let token = localStorage.getItem("userToken");
      return `http://dj.huashengbook.cn/api/writer/createDrama?token=${token}`;
    },
    uploadCover() {
      let token = localStorage.getItem("userToken");
      return `http://dj.huashengbook.cn/api/writer/reviseimg?token=${token}`;
    },
  },
  mounted() {
    // 这里是创建剧本页面, 有这么个情况
    // 用户登录了但是还没有注册成为作者, 这里却可以进来, 这不行!
    // 要判断一下:
    // 1. 登录了,但是没有注册作者
    // 2. 登录了,注册作者正在审核

    //发送作者专区的请求, 看看用户的作者信息情况, 根据这个判断怎么跳
    createCenter().then((res) => {
      if (res.data.code == -5) {
        // 没有就跳转到注册页
        this.$router.push("/beauthor");
        return;
      } else if (res.data.msg == "该作者正在审核中") {
        // 在审核就跳到提示审核页
        this.$router.push("/audit");
        return;
      }
    });
  },
};
</script>

<style lang="less" scoped>
.createNewScript {
  width: 1033px;

  .titleBar {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #d8d8d8;
    padding-bottom: 10pxw;

    .left,
    .right {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .left {
      font-size: 18px;
      color: #333;

      span {
        margin-left: 8px;
      }
    }

    .right {
      font-size: 14px;
      color: #9e9e9e;

      span {
        margin-right: 8px;
      }
    }
  }

  .contentSection {
    margin-top: 32px;
    display: flex;

    .leftCover {
      display: flex;
      flex-direction: column;
      align-items: center;

      .coverBox {
        width: 108px;
        height: 156px;
        border-radius: 8px;
        // background-color: cadetblue;

        img {
          width: 100%;
        }
      }

      .uploadButton {
        width: 88px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 20px;
        color: #999999;
        background-color: #f6f6f6;
        margin-top: 12px;
        font-size: 14px;
        cursor: pointer;
        position: relative;

        input {
          position: absolute;
          left: 0;
          opacity: 0;
        }
      }
    }

    .rightForm {
      flex: 1;
      // background-color: red;
      padding-left: 36px;
      box-sizing: border-box;

      .inputRow {
        display: flex;
        align-items: center;
        margin-bottom: 22px;

        .inputTitle {
          width: 80px;
          white-space: nowrap;
          position: relative;
          font-size: 14px;
          color: #333;

          &::before {
            content: "*";
            color: red;
            position: absolute;
            left: -15px;
            top: 4px;
          }
        }

        input {
          text-indent: 1em;
          width: 797px;
          height: 38px;
          outline: 1px solid #cdaf9b;
          border-radius: 30px;
        }

        .uploadBox {
          cursor: pointer;
          width: 300px;
          height: 64px;
          border-radius: 8px;
          outline: 1px solid #cdaf9b;
          padding: 10px 24px 8px 10px;
          box-sizing: border-box;
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          position: relative;

          .left {
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            span {
              &:first-child {
                font-size: 14px;
                color: #333;
              }

              &:last-child {
                color: #999;
              }
            }
          }

          .right {
            display: flex;
            align-items: center;
            color: #fe7d1c;
            transform: translateX(80px);
          }
        }
      }

      .priceInput {
        width: 400px;
        padding-top: 20px;
        position: relative;

        input {
          width: 300px;
          height: 38px;
          border-radius: 19px;
          text-indent: 3em;
        }

        .moneyIcon {
          position: absolute;
          left: 23%;
        }

        .yuan {
          position: absolute;
          right: 8%;
        }
      }

      .twoBtn {
        button {
          width: 88px;
          height: 34px;
          border-radius: 100px;
          cursor: pointer;
        }

        .createRightNow {
          background-color: #fe7d1c;
          color: white;
          margin-left: 80px;
          margin-right: 20px;
        }

        .cancelBtn {
          background-color: #f0f0f0;
          color: #999999;
        }
      }
    }
  }
}

// 把必选的标去掉, 上传剧本不是必选
.notMust {
  &::before {
    content: "" !important;
  }
}

/deep/ .el-input__inner {
  border-radius: 100px;
  border-color: #cdaf9b !important;
}

/deep/ .is-focus .el-input__inner {
  border-color: #cdaf9b;
}

/deep/ .el-input {
  width: 797px;
}

/deep/ .el-textarea__inner {
  border-color: #cdaf9b;
  height: 240px;
  border-radius: 8px !important;
}

/deep/ .avatar-uploader .el-upload {
  width: 108px;
  height: 156px;
  border-radius: 6px;
  border: 1px dashed gray;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/deep/ .uplod-demo {
  opacity: 0;
  width: 108px;
  height: 156px;
}

/deep/ .el-upload-dragger {
  width: 108px;
  height: 156px;
}

/deep/ .el-upload-list {
  position: relative;
  // left: 150px;
  // top: -50px;
  // width: 0;
  height: 0;
}

/deep/ .el-upload-list__item {
  border-radius: 8px;
  border: 1px solid #cdaf9b;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 108px;
  height: 156px;
  line-height: 156px;
  text-align: center;
}

.avatar {
  width: 108px;
  height: 156px;
  display: block;
}
</style>