<template>
  <div>
    <div class="user-info-tip">
      <p>
        当前用户余额：{{ this.wallet }} <el-button @click="handleSupplier" type="danger" size="mini">立即充值</el-button>
      </p>
      <p>
        使用说明：<br>
        1. 在公开解码列表找到自己想要获取的验证码模板添加对接。<br>
        2. 在对接项目选中该项目，点击获取号码。<br>
        3. 获取验证码之后会自动将验证码反馈给您。<br>
        <el-link style="font-size: 16px"  type="danger" href="https://note.youdao.com/s/CDcaqhIl" target="_blank">还有问题？查看在线文档</el-link>
      </p>
    </div>
    <el-card class="get-phone-page" shadow="never">
      <el-form ref="getPhoneForm" :model="getPhoneForm" label-width="120px">
        <el-form-item label="对接项目：">
          <el-select v-model="getPhoneForm.projectId" placeholder="请选择项目" style="width: 90%">
            <el-option v-for="item in collectOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
          <el-button style="margin-left: 5px" @click.prevent="refreshRegion()">刷新关注的项目</el-button>
        </el-form-item>
        <el-form-item label="运营商：">
          <el-select v-model="getPhoneForm.operator" placeholder="请选择运营商">
            <el-option label="不限" value="0"></el-option>
            <el-option label="虚拟运营商" value="5"></el-option>
            <el-option label="非虚拟运营商" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指定号码：">
          <el-input v-model="getPhoneForm.phone_num" placeholder="填要取的手机号, 可以获得指定号码"></el-input>
        </el-form-item>
        <el-form-item label="指定号段：" >
          <el-input v-model="getPhoneForm.scope" placeholder="指定号段查询 (譬如:137开头的号段或者1371开头的号段)"></el-input>
        </el-form-item>
        <el-form-item label="排除号段：" >
          <el-input v-model="getPhoneForm.scope_black" placeholder="排除号段最长支持4位且可以支持多个,最多支持20个号段。用逗号分隔 比如184,1841"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitGetPhoneForm('getPhoneForm')">获取号码</el-button>
          <el-button type="primary" @click="stopGetCode()">停止获取</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="get-code-page" style="margin-top: 20px" shadow="never">
      <el-form ref="getCodeForm" :model="getCodeForm" label-width="120px">
        <el-form-item label="手机号：">
          <el-input v-model="getCodeForm.phone" style="width: 90%" :disabled="true"></el-input>
          <el-button style="margin-left: 5px"
                     v-clipboard:copy="getCodeForm.phone"
                     v-clipboard:success="copy">复制</el-button>
        </el-form-item>
        <el-form-item label="最近来码时间：">
          <el-input v-model="getCodeForm.lastMsgTime" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="获取次数：">
          <el-input v-model="count" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="验证码：">
          <el-input v-model="getCodeForm.code" style="width: 90%"></el-input>
          <el-button style="margin-left: 5px"
                     v-clipboard:copy="getCodeForm.code"
                     v-clipboard:success="copy">复制</el-button>
        </el-form-item>
        <el-form-item label="短信内容：">
          <el-input type="textarea" :rows="2" v-model="getCodeForm.codeContent"></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <recharge-dialog v-model="editDialog" type="recharge" @success="success"/>
  </div>
</template>

<script>
import {appGetters} from "el-admin-layout"
import {search} from "@/api/message/getCode"
import {getWallet} from "@/api/system/SysUserWallet"
import {wic} from "@/util/auth";
import {selectProjectByProjectIdList} from "@/api/message/smsProject";
import {list} from "@/api/message/smsCollect";
import {getPhone} from "@/api/message/getPhone";
import {getCode} from "@/api/message/getCode";
import RechargeDialog from "./component/RechargeDialog"
import {elConfirm, elError, elSuccess} from "@/util/message"
import {timeFormat} from "@/util"


export default {
  name: "getCode",
  components: {RechargeDialog},
  data() {
    return {
      getPhoneForm: {
        projectId: '',
        operator: '0',
        phone_num: '',
        scope: '',
        scope_black: '',
      },
      getCodeForm: {
        phone: '',
        lastMsgTime: '',
        code: '',
        codeContent: '',
      },
      collectOptions: [],
      wallet: "0.00",
      timer: null,
      count: 0,
      editDialog: false
    }
  },
  computed: {},
  created() {
    this.handleGetWallet()
    this.handleGetCollectProject()
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {},
  methods: {
    stopGetCode() {
      clearInterval(this.timer)
      this.timer = null
      elSuccess("已停止获取验证码")
    },
    copy() {
      elSuccess("复制成功")
    },
    refreshRegion() {
      this.handleGetCollectProject()
    },
    // submitGetPhoneForm() {
    //   if (this.getPhoneForm.projectId === '') {
    //     elError("请先选择项目，如果没有项目请先对接项目之后再尝试")
    //     return
    //   }
    //   getPhone.request(this.getPhoneForm).then(resp => {
    //     this.getCodeForm.phone = resp.data.mobile
    //     clearInterval(this.timer)
    //     this.count = 0
    //     // 定时获取验证码
    //     this.timer = setInterval(this.handleGetCode, 5000);
    //   })
    // },
    submitGetPhoneForm() {
      if (this.getPhoneForm.projectId === '') {
        elError("请先选择项目，如果没有项目请先对接项目之后再尝试")
        return
      }
      getPhone.request(this.getPhoneForm).then(resp => {
        this.getCodeForm.phone = resp.data.data.mobile
        this.getCodeForm.lastMsgTime = resp.data.data.lastMsgTime
        clearInterval(this.timer)
        this.count = 0
        // 定时获取验证码
        this.timer = setInterval(this.handleGetCode, 5000);
      })
    },

    handleGetCollectProject() {
      this.collectOptions = []
      list
          .request({size: 50})
          .then(resp => {
            let projectList = [];
            resp.data.map(function (l) {
              projectList.push(l.projectId)
            })
            let _this = this
            selectProjectByProjectIdList
                .request({projectIdList: projectList})
                .then(resp => {
                  resp.data.map(function (p) {
                    _this.collectOptions.push({
                      value: p.projectId,
                      label: '项目: ' + p.projectName + '---金额：' + p.userMoney,
                    })
                    _this.getPhoneForm.projectId = _this.collectOptions[0].value
                  })
                })
          })
    },

    handleGetCode() {
      if (this.count > 100) {
        clearInterval(this.timer)
      }
      console.log("get code num: " + this.count)
      getCode.request({projectId: this.getPhoneForm.projectId, phoneNum: this.getCodeForm.phone}).then(resp => {
        if (resp.data.message === "ok") {
          this.getCodeForm.code = resp.data.code
          this.getCodeForm.codeContent = resp.data.modle
          this.getCodeForm.lastMsgTime = timeFormat()
          clearInterval(this.timer)
          // 获取短信成功就更新用户余额
          elSuccess("获取验证码成功")
          this.handleGetWallet()
        }
      })
      this.count++
    },

    handleGetWallet() {
      getWallet.request({}).then(resp => {
        this.wallet = resp.data.balances
      })
    },
    success(msg) {
      elSuccess(msg)
      this.editDialog = false
      this.handleGetWallet()
    },
    handleSupplier() {
      this.editDialog = true
    }
  }
}
</script>

<style lang="scss">
.user-info-tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin: 20px 0;
}

a {
  color: #409eff;
  text-decoration: none;
}
</style>
