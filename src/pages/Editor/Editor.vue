<template>
  <div class="eidtor">
    <div class="topBar">
      <div class="saveInput">
        <!-- <input type="text" v-model="chapter_name" placeholder="输入剧集标题"> -->
        <el-input
          type="text"
          placeholder="请输入标题"
          v-model="chapter_name"
          maxlength="10"
          show-word-limit
          :value="chapter_data.chapter_name"
        >
        </el-input>
      </div>

      <div class="uploadSection">
        <button @click="saveScript" class="saveBtn">保存</button>

        <!-- <div class="uploadBox" @click="uploadShow = !uploadShow">
          或者点击这里上传文件?
        </div> -->
        <!-- 上传txt内容 -->
        <div class="inputRow" v-show="uploadShow">
          <el-upload
            class="upload-demo"
            ref="upload"
            :action="uploadUrl"
            :on-change="onChange"
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
      </div>
    </div>

    <div>
      <Toolbar
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
        class="toolBar"
      />
      <Editor
        class="editor"
        v-model="html"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { createChapter, altChapter, editScript } from "@/requests/author";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { IToolbarConfig } from "@wangeditor/editor";
import { DomEditor, IEditorConfig } from "@wangeditor/editor";

export default Vue.extend({
  components: { Editor, Toolbar },
  data() {
    return {
      editor: null,
      // html: '<p>hello</p>',
      html: null,
      toolbarConfig: {
        toolbarKeys: [
          /*           'headerSelect',
                    // 分割线
                    // '|',
          
                    // 设置字号
                    'fontSize',
          
                    'undo',
                    'redo', */
        ],
      },
      editorConfig: { placeholder: "输入剧集内容" },
      mode: "simple", // or 'simple'
      chapter_data: {},
      chapter_id: null,
      chapter_name: "",
      content: "",
      fileList: [], //剧本文件
      uploadShow: false,
      bookid: null,
    };
  },
  methods: {
    // 封装element消息提示
    msgTip(type, msg) {
      this.$message({
        showClose: true,
        duration: 2000,
        type: type,
        message: msg,
      });
    },

    keepTxt() {
      const editor = createEditor({ content, mode: "simple" });
      const text = editor.getText();
      // console.log(text);
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    insertText() {
      const editor = this.editor; // 获取 editor 实例
      if (editor == null) return;

      // 调用 editor 属性和 API
      editor.insertText("一段文字");
      // console.log(editor.children);
    },

    // 保存修改(新建章节)
    saveScript() {
      // console.log(this.html);
      // 如果是从创建新剧本进来的,走创建剧本的接口
      if (this.$route.params.isCreate) {
        let chapterData = {
          bookid: this.bookid,
          content: this.html,
          chapter_name: this.chapter_name,
        };
        createChapter(chapterData).then((res) => {
          // console.log(res);
          if (res.status == 200) {
            // 创建新剧集成功提示!
            this.msgTip("success", '创建成功');
            this.$router.push("/author/chapteradmain");
          }
        });
      }
      // 不然就是编辑剧本的接口
      else {
        let chapterData = {
          chapter_name: this.chapter_name,
          content: this.html,
          bookid: this.bookid,
          chapter_id: this.chapter_id,
        };
        // console.log(chapterData);
        altChapter(chapterData).then((res) => {
          // console.log(res);
          if (res.status == 200) {
            // alert("修改成功!", res.data.msg);
            this.msgTip("success", "修改成功");
            this.$router.push({
              name: "chapteradmain",
              params: {
                id: this.bookid,
              },
            });
          }
        });
      }
    },
    onChange(file, fileList) {
      // console.log(file, fileList);
      this.fileList.file = file;
    },
  },

  async mounted() {
    // 以前的逻辑改掉了, 现在进来就发送一下请求要获取书的id和章节id, 没有的话,后台就会返回错误信息,我这里又打印出来了
    // 判断一下是不是从创建剧本过来的, 如果是,就直接return就行了

    this.bookid = Number(localStorage.getItem("curBookId"));
    this.chapter_id = localStorage.getItem("curChapterId");
    let createStatus = localStorage.getItem("createStatus");
    if (createStatus == 'false') {
      // 如果是创建新剧集
      return;
    } else {
      // 不然就是从编辑剧集里面过来的
      let result = await editScript(this.bookid, this.chapter_id);
      // localStorage.setItem("curChapterId", chapter_id);
      if (result.data.code == 0) {
        // console.log(result.data.data);
        // 这个章节如果有内容, 先把内容存在vuex里面, 因为当前组件和编辑器是兄弟级
        this.$store.commit("sendToEditor", result.data.data);
        // 然后跳转到编辑器, 顺便把参数带过去:1.这个书的id, 当前章节id,(编辑的话就不用带了, 因为存到vuex里面的数据都有了)
      } else {
        
        alert(result.data.msg);
      }

      // 模拟 ajax 请求，异步渲染编辑器
      // 进入编辑器, 如果是点击修改章节进来, 就将文字内容渲染进来,没有的话就不渲染
      setTimeout(() => {
        // 查看编辑器工具栏配置
        // const toolbar = DomEditor.getToolbar(this.editor)

        // const curToolbarConfig = toolbar.getConfig()
        // console.log(curToolbarConfig.toolbarKeys) // 当前菜单排序和分组

        // 获取剧本数据和章节id
        this.chapter_data = this.$store.state.script.sendToEditor;
        this.chapter_name = this.chapter_data.chapter_name;
        this.chapter_id = this.chapter_data.chapter_id;

        // console.log(this.chapter_data);
        // 根据查询, 如果是修改章节, 就在编辑器展示章节内容
        if (this.chapter_data.content) {
          this.html = `<p>${this.chapter_data.content}</p>`;
        } else {
          this.html = "";
        }
      }, 500);
    }
  },
  computed: {
    uploadUrl() {
      let token = localStorage.getItem("userToken");
      return `http://dj.huashengbook.cn/api/writer/createDrama?token=${token}`;
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁编辑器
  },
});
</script>
<style src="@wangeditor/editor/dist/css/style.css">
</style>


<style lang="less" scoped>
@import url(@/assets/font.less);

.saveBtn {
  width: 80px;
  margin-right: 10px;
  height: 30px;
  background-color: #fa7e02;
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.topBar {
  width: 800px;
  height: 50px;
  margin: 20px auto 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .saveInput {
    display: block;
    // align-items: center;

    input {
      background-color: #fcfcfc;
      border-bottom: 1px solid rgb(195, 195, 195);
      height: 30px;
    }
  }

  .uploadSection {
    background-color: white;
    // display: flex;
    align-items: center;
    height: 30px;
    z-index: 99;

    .uploadBox {
      background-color: #fa7e02;
      display: inline-block;
      color: white;
      padding: 5px;
      border-radius: 5px;
      font-size: 14px;
      height: 20px;
      user-select: none;
      cursor: pointer;
    }

    .inputRow {
      position: relative;
      left: 25px;
      top: 30px;
    }
  }
}

.eidtor {
  background: #fcfcfc;
}

.toolBar {
  position: absolute;
  width: 90px;
  top: 130px;
  left: 400px;
  border: none;
  background-color: #fff;

  /deep/ .w-e-bar {
    border-radius: 10px;
    // border: 1px solid #e1e1e1;
    display: flex;
    flex-direction: column;
    width: 95%;
  }
}

.editor {
  height: 797px;
  width: 800px;
  margin: 0 auto;
  overflow-y: hidden;
  box-shadow: 0px 3px 5px 0px rgba(0, 0, 0, 0.1);
  margin-top: 10px;
  border-radius: 10px;
  box-sizing: border-box;
}

// elementui的样式修改
/deep/ .uploadSection .inputRow {
  left: 90px;
}

/deep/ .el-input {
  width: 300px;
}
</style>