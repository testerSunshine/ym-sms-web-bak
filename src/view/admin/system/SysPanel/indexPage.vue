<template>
  <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="充值管理" name="first">
      <el-input v-model="num" placeholder="请输入生成卡密数量"></el-input>
      <el-button type="primary" @click="create5">生成5元卡密</el-button>
      <el-button type="primary" @click="create10">生成10元卡密（送1）</el-button>
      <el-button type="primary" @click="create50">生成50元卡密（送10）</el-button>
      <el-button type="primary" @click="create100">生成100元卡密（送30）</el-button>
      <br>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>生成卡密列表</span>
          <el-button style="float: right; padding: 3px 0" type="text"
                     v-clipboard:copy="copyContent"
                     v-clipboard:success="copy">复制</el-button>
        </div>
        <div v-for="c in cardList" :key="c" class="text item">
          {{c}}
        </div>
      </el-card>
    </el-tab-pane>
    <el-tab-pane label="黑名单管理" name="second">黑名单管理</el-tab-pane>
    <el-tab-pane label="内部账号管理" name="third">米云账号管理</el-tab-pane>
  </el-tabs>
</template>

<script>
import {generateIdCard} from "@/api/system/SysPanel";

export default {
  name: "SysPanelManagement",

  data() {
    return {
      activeName: 'first',
      num: '',
      cardList: [],
      copyContent:""
    }
  },
  methods: {
    create5(){
      this.copyContent = ""
      generateIdCard.request({
        "size": this.num,
        "cardMoney": 5,
        "cardMoneyGift": 0
      }).then(
          resp => {
            this.cardList = resp.data
            for (const key in this.cardList) {
              this.copyContent = this.copyContent + this.cardList[key] + "\n"
            }
          }
      )
    },

    create10(){
      this.copyContent = ""
      generateIdCard.request({
        "size": this.num,
        "cardMoney": 10,
        "cardMoneyGift": 1
      }).then(
          resp => {
            this.cardList = resp.data
            for (const key in this.cardList) {
              this.copyContent = this.copyContent + this.cardList[key] + "\n"
            }
          }
      )
    },

    create50(){
      this.copyContent = ""
      generateIdCard.request({
        "size": this.num,
        "cardMoney": 50,
        "cardMoneyGift": 10
      }).then(
          resp => {
            this.cardList = resp.data
            for (const key in this.cardList) {
              this.copyContent = this.copyContent + this.cardList[key] + "\n"
            }
          }
      )
    },

    create100(){
      this.copyContent = ""
      generateIdCard.request({
        "size": this.num,
        "cardMoney": 100,
        "cardMoneyGift": 30
      }).then(
          resp => {
            this.cardList = resp.data
            for (const key in this.cardList) {
              this.copyContent = this.copyContent + this.cardList[key] + "\n"
            }
          }
      )
    },

    copy() {
      elSuccess("复制成功")
    }
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

/*.box-card {*/
/*  width: 480px;*/
/*}*/
</style>