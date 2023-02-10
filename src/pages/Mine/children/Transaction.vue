<template>
  <div class="transaction">
    <div class="row">
      <div class="record" style="font-weight: bold">交易记录</div>
      <div class="orderId">订单号</div>
      <div class="transDate">日期</div>
      <div class="totalMoney">总金额</div>
      <div class="payType">支付类型</div>
      <div class="status">状态</div>
    </div>
    <div class="transArray" v-if="transArray">
      <div class="transItem" v-for="(item, index) in transArray" :key="index">
        <div class="record">{{ item.book_name }} - ￥ {{ item.money }}</div>
        <div class="orderId">{{ item.out_trade_no }}</div>
        <div class="transDate">{{ item.create_time }}</div>
        <div class="totalMoney">¥ {{ item.money }}</div>
        <div class="payType">{{ item.paytype }}</div>
        <div class="status">{{ item.status }}</div>
      </div>
    </div>
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
import { transaction } from "@/requests/mine";
export default {
  data() {
    return {
      transArray: [],
      curPage: 1,
      totalPage: null,
      leftForbit: true, //判断page是不是=1 是的话不能点左箭头
      rightForbit: false, //判断page是不是等于最大值, 是的话不能点右箭头
    };
  },

  mounted() {
    this.getTransaction();
  },

  computed: {},

  methods: {
    // 获取交易记录的请求(封装成方法)
    getTransaction(page) {
      transaction(page).then(
        (res) => {
          // console.log(res);
          if (res.data.msg == "success") {
            this.transArray = res.data.data.data;
            this.totalPage = res.data.data.last_page;
          }
        },
        (err) => {
          console.log(err, "错误!");
        }
      );
    },

    leftArrow() {
      if (this.curPage <= 1) {
        this.leftForbit = true;
        return;
      } else {
        this.curPage -= 1;
        this.rightForbit = false;
        this.leftForbit = false;
        this.getTransaction(this.curPage);
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
        this.getTransaction(this.curPage);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.transaction {
  .row,
  .transItem {
    display: flex;
    color: #666;
    font-size: 14px;

    .record {
      width: 300px;
      color: #333;
    }

    .orderId {
      width: 222px;
    }

    .transDate {
      width: 170px;
    }

    .totalMoney {
      margin: 0 30px;
    }

    .payType {
      margin: 0 30px;
    }

    .status {
      flex: 1;
    }
  }

  .row {
    border-bottom: 1px solid #d8d8d8;
    padding-bottom: 10px;
    .payType {
      transform: translateX(6px);
    }
    .status {
      text-align: center;
    }
  }

  .transItem {
    border-bottom: 1px solid #f0f0f0;
    padding: 21px 0 12px;

    .status {
      width: 64px;
      height: 28px;
      text-align: center;
      line-height: 28px;
      border-radius: 20px;
      color: white;
      background-color: #619be1;
      user-select: none;
      font-size: 14px;
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