<template>
  <div class="chapterAdmain">
    <!-- 返回按钮 -->
    <div class="backTitle" @click="$router.push('/author/worksadmain')">
      <img src="@/assets/icons/leftArrow.png" alt="" />
      <span>章节管理</span>
    </div>

    <!-- 栏bar -->
    <div class="titleBar">
      <span>剧集管理</span>
      <button @click="addNewChapter">新增剧集</button>
    </div>

    <!-- 章节内容 -->
    <div class="chapterBar">
      <div class="name">名称</div>
      <div class="fontNum">字数</div>
      <div class="editTime">修改时间</div>
      <div class="auditStatus">审核状态</div>
      <div class="control">操作</div>
    </div>
    <!-- 章节列表 -->
    <div class="chapterSection" v-if="scriptList">
      <div class="chapterList" v-for="(item, index) in scriptList" :key="index">
        <div class="name">
          <span v-if="item.chapter_name">{{ item.chapter_name }}</span>
          <span v-else>未命名</span>
        </div>
        <div class="fontNum">{{ item.word_count }}</div>
        <div class="editTime">{{ item.update_time }}</div>
        <div class="auditStatus">
          <div
            class="dot"
            :class="[
              { wait: item.checked_text == '待审' },
              { pass: item.status_name == '已通过' },
              { notpass: item.status_name == '未通过' },
            ]"
          ></div>
          {{ item.checked_text }}
        </div>
        <div class="control">
          <div class="edit" @click="toEditScript(item.chapter_id)"></div>
          <div class="delete"></div>
        </div>
      </div>
    </div>
    <div class="noList" v-if="!scriptList.length">暂无剧本章节,</div>

    <!-- 分页器 -->
    <div class="pageControl" v-if="totalPage">
      <div
        class="arrowBox"
        @click="leftArrow"
        :class="{ forbitArrow: leftForbit }"
      >
        <img src="@/assets/icons/leftArrow.png" alt="" />
      </div>
      {{ curPage }} / {{ totalPage }}
      <div
        class="arrowBox"
        @click="rightArrow"
        :class="{ forbitArrow: rightForbit }"
      >
        <img src="@/assets/icons/rightArrow.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  myScriptPassed,
  editScript,
  chapter_control_list,
} from "@/requests/author";
export default {
  data() {
    return {
      scriptList: [],
      bookid: null,
      totalPage: null,
      curPage: 1,
      leftForbit: true,
      rightForbit: false,
    };
  },
  methods: {
    // 点击编辑, 去编辑器中修改.
    async toEditScript(chapter_id) {
      let result = await editScript(this.bookid, chapter_id);
      localStorage.setItem("curChapterId", chapter_id);
      localStorage.setItem("createStatus", true);
      if (result.data.code == 0) {
        // console.log(result.data.data);
        // 这个章节如果有内容, 先把内容存在vuex里面, 因为当前组件和编辑器是兄弟级
        this.$store.commit("sendToEditor", result.data.data);
        // 然后跳转到编辑器, 顺便把参数带过去:1.这个书的id, 当前章节id,(编辑的话就不用带了, 因为存到vuex里面的数据都有了)
        this.$router.push({
          name: "editor",
          params: {
            id: this.bookid,
          },
        });
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          message: result.data.msg,
          type: "error",
        });
      }
    },

    // 新增剧集
    addNewChapter() {
      // 点击新增剧集,把vuex之前可能保存的章节内容清空掉.
      this.$store.commit("sendToEditor", {});
      // 然后再跳转到编辑器
      this.$router.push({
        name: "editor",
        params: {
          id: this.$route.params.id,
          isCreate: true,
        },
      });
    },

    // 点击左右箭头
    leftArrow() {
      if (this.curPage <= 1) {
        this.leftForbit = true;
        return;
      } else {
        this.curPage -= 1;
        this.rightForbit = false;
        this.leftForbit = false;
        this.getChapterList();
      }
    },
    rightArrow() {
      if (this.curPage >= this.totalPage) {
        this.rightForbit = true;
        return;
      } else {
        this.leftForbit = false;
        this.rightForbit = false;
        this.curPage += 1;
        this.getChapterList();
      }
    },

    // 请求章节列表
    getChapterList() {
      chapter_control_list(this.bookid, this.curPage).then((res) => {
        console.log(res, "!");
        if (res.status == 200) {
          this.scriptList = res.data.BookList.data;
          this.totalPage = res.data.BookList.last_page;
        }
      });
    },
  },
  mounted() {
    // 挂载好就从本地获取bookid
    this.bookid = localStorage.getItem("curBookId");

    this.getChapterList();
  },
};
</script>

<style lang="less" scoped>
.chapterAdmain {
  width: 100%;

  .backTitle {
    color: #333;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;

    &:hover span {
      text-decoration: underline;
    }

    span {
      margin-left: 10px;
    }
  }

  .titleBar {
    height: 32px;
    line-height: 32px;
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    span {
      font-size: 14px;
      color: #333;
    }

    button {
      width: 88px;
      height: 32px;
      border-radius: 100px;
      color: white;
      background-color: #fe7d1c;
      cursor: pointer;
    }
  }

  .chapterBar,
  .chapterList {
    padding: 0 16px;
    width: 100%;
    height: 51px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;

    .name {
      width: 238px;
    }

    .fontNum {
      width: 238px;
    }

    .editTime {
      width: 250px;
    }

    .auditStatus {
      width: 250px;
    }

    .control {
      width: 66px;
    }
  }

  .chapterBar {
    background-color: #fafafa;
    margin-top: 13px;
    color: #9e9e9e;
  }

  .chapterList {
    color: #333;
    font-size: 14px;

    .fontNum {
      transform: translateX(6px);
    }

    .auditStatus {
      display: flex;
      align-items: center;

      .dot {
        width: 8px;
        height: 8px;
        border-radius: 4px;
        margin-right: 6px;
      }

      .pass {
        background-color: #fa7e02;
      }

      .wait {
        background-color: #bebebe;
      }

      .notpass {
        background-color: red;
      }
    }

    .control {
      display: flex;
      align-items: center;

      .edit,
      .delete {
        width: 24px;
        height: 24px;
        margin-left: 3px;
        cursor: pointer;
      }

      .edit {
        background: url("@/assets/icons/edit.png") 100% 100%;

        &:hover {
          background: url("@/assets/icons/edit-act.png") 100% 100%;
        }
      }

      .delete {
        background: url("@/assets/icons/delete.png") 100% 100%;

        &:hover {
          background: url("@/assets/icons/delete-act.png") 100% 100%;
        }
      }
    }
  }

  .pageControl {
    margin-top: 20px;
    text-align: right;
    display: flex;
    align-items: center;
    user-select: none;
    .arrowBox {
      width: 32px;
      height: 32px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f6f6f6;
      border-radius: 200px;
      cursor: pointer;
    }
    .forbitArrow {
      background-color: transparent;
      cursor: not-allowed;
    }
  }
}
</style>