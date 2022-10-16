<template>
  <el-card class="get-code-task" style="margin: 5px" shadow="never">
    <el-form ref="form" :model="form" label-width="80px" size="mini">

      任务状态：<el-tag type="success" size="mini" effect="dark" v-if="this.taskStatus">可用</el-tag>
      <el-tag type="danger" size="mini" effect="dark" v-if="!this.taskStatus">禁用</el-tag>
      <br>

      <el-button style="margin: 10px" type="primary" size="mini" @click="submitGetPhoneForm()" v-if="this.taskStatus">获取手机号</el-button>
      <el-button style="margin: 10px"
                 size="mini"
                 v-clipboard:copy="this.form.phone"
                 v-clipboard:success="copy" v-if="this.taskStatus">复制手机号</el-button>
      <el-button style="margin: 10px" type="danger" size="mini" @click="banPhone()" v-if="this.taskStatus">拉黑该号码</el-button>

      <el-form-item label="项目信息:">
        <el-input v-model="form.projectName" :disabled=true></el-input>
      </el-form-item>

      <el-form-item label="手机号:">
        <el-input v-model="form.phone" :disabled=true></el-input>
      </el-form-item>

      <el-form-item label="最近来码:">
        <el-input v-model="form.lastMsgTime" :disabled=true>time</el-input>
      </el-form-item>

      <el-button style="margin-right: 10px" type="primary" size="mini" @click="startGetCode()" v-if="this.taskStatus">获取验证码</el-button>
      <el-button style="margin-right: 10px"
                 size="mini"
                 v-clipboard:copy="this.form.code"
                 v-clipboard:success="copy" v-if="this.taskStatus">复制验证码</el-button>
      <el-button style="margin-right: 10px" type="danger" size="mini" @click="stopGetCode()" v-if="this.taskStatus">清空该任务</el-button>
      <br>
      <el-tag  style="margin: 10px" type="primary" size="medium"  >{{this.getCodeStatus}}</el-tag>
      <el-tag  style="margin: 10px" type="primary" size="medium"  >倒计时：{{this.countDownTime}}s</el-tag>

      <el-form-item label="验证码:">
        <el-input v-model="form.code" :disabled=!this.taskStatus>code</el-input>
      </el-form-item>

      <el-form-item label="短信内容:">
        <el-input type="textarea" :disabled=!this.taskStatus :rows="2" v-model="form.codeContent" placeholder="如果验证码提取有错，请自取短信内容里的验证码"></el-input>
      </el-form-item>

    </el-form>


  </el-card>
</template>

<script>
import {addPhone, getPhone} from "@/api/message/getPhone";
import {getCode} from "@/api/message/getCode";
import {elError, elSuccess} from "@/util/message"
import {updateTask} from "@/api/message/smsTask";
import {timeFormat} from "@/util"


export default {
  name: "GetCodeTask",

  props: {
    "taskStatus": {
      type: Boolean,
      default: false
    },

    "getPhoneForm": Object,
    "taskData": Object,

  },


  data() {
    return {
      timer: null,
      endFlag: false,
      countDownTime: 300,
      taskId:"",
      getCodeStatus:"等待获取验证码",
      form:{
        projectId:"",
        projectName:"",
        phone:"",
        lastMsgTime:"",
        projectCode:"",
        code:"",
        codeContent:"",
      }
    }

  },

  // mounted() {
  //   if(this.form.phoneNo != null && this.form.projectId != null && this.taskData.status === 1){
  //     this.startGetCode();
  //   }
  // },

  watch:{
    taskData:{
      handler(n,o){
        this.form.phone = n.phoneNo
        this.countDownTime = n.leftSeconds
        this.form.projectName = n.projectName + "("+n.userMoney+")"+ n.projectContent + "projectId"  + n.projectId
        this.form.projectId = n.projectId
        this.form.projectCode = n.projectCode
        this.taskId = n.id

        this.getPhoneForm.code = n.projectCode
        this.getPhoneForm.projectId = n.projectId

        // console.log("ssdsada")
        // console.log(this.form.projectName)

      }
    }
  },

  deactivated() {
    clearInterval(this.timer)
    this.timer = null
  },


  methods:{
    copy() {
      elSuccess("复制成功")
    },

    submitGetPhoneForm() {
      if (this.getPhoneForm.projectId === '' || this.getPhoneForm.projectId == null) {
        elError("请先选择项目，如果没有项目请先对接项目之后再尝试")
        return
      }
      this.endFlag = false
      this.countDownTime = 300
      this.form.projectName = this.getPhoneForm.projectName
      this.form.projectId = this.getPhoneForm.projectId
      this.form.projectCode = this.getPhoneForm.code

      getPhone.request(this.getPhoneForm).then(resp => {
        if (resp.data.mobile === "") {
          elError("没找到符合条件的号码，请检查搜索条件再试")
          return
        }
        this.form.phone = resp.data.mobile
        this.form.lastMsgTime = resp.data.lastMsgTime
        this.taskId = resp.data.smsTask.id
        clearInterval(this.timer)
        elSuccess("获取手机号成功，点击获取验证码即可获取验证码")

      })
    },

    banPhone(){
      if(this.form.projectCode === ""){
        elError("请先获取渠道和正确的手机号再试")
        return
      }
      if(this.form.phone === "等待获取"){
        elError("请先获取渠道和正确的手机号再试")
        return
      }
      addPhone.request({
        "code":this.form.projectCode,
        "phoneNo":this.form.phone,
        "type":0
      }).then(
          resp => {
            if(resp.data === true){
              elSuccess("拉黑成功")
            }else{
              elError("拉黑失败，可能之前已经拉黑过了")
            }
          }
      )
    },

    startGetCode() {
      clearInterval(this.timer)
      if (this.getPhoneForm.projectId === 0) {
        elError("请选择渠道再获取验证码")
        this.getCodeStatus = "验证码获取错误，请更改手机号或者渠道再重试"
        clearInterval(this.timer)
        return
      }
      // this.countDownTime = 300
      this.getCodeStatus = "获取验证码中..."
      // 定时获取验证码
      elSuccess("开始获取验证码")
      this.form.code = "等待获取"
      this.form.codeContent = ""
      this.form.lastMsgTime = ""
      this.timer = setInterval(this.handleGetCode, 2000);

    },

    handleGetCode() {
      if (this.countDownTime < 2 || this.endFlag) {
        clearInterval(this.timer)
        this.getCodeStatus = "获取验证码任务结束"
        return
      }
      getCode.request({
        projectId: this.form.projectId,
        phoneNum: this.form.phone,
      }).then(resp => {
        if (resp === undefined) {
          this.stopAuto()
          return
        }
        if (resp.data.message === "ok") {
          this.form.code = resp.data.code
          this.form.codeContent = resp.data.modle
          this.form.lastMsgTime = timeFormat("yyyy-MM-dd HH:mm:ss")
          clearInterval(this.timer)
          // 获取短信成功就更新用户余额
          elSuccess("获取验证码成功")
          this.getCodeStatus = "验证码获取成功！！！"
          this.$emit("handleGetWallet")
        }
      }).finally(
          () => this.countDownTime = this.countDownTime - 2)

    },

    stopAuto(){
      if(this.taskId == null || this.taskId ===""){
        elError("任务不存在")
      }else{
        this.endFlag = true
        updateTask.request({"id":this.taskId, "status":2}).then(
            resp =>{
              // console.log(resp)
              if(resp.data){
                clearInterval(this.timer)
                this.timer = null
                this.countDownTime = 300
                this.getCodeStatus = "已停止获取验证码"
                // this.form.phone = null
                // this.form.projectName = null
                // this.form.projectCode = null
                // this.form.lastMsgTime = null

                elSuccess("已停止获取验证码")
              }else{
                elError("停止失败")
              }

            }
        )
      }
    },

    stopGetCode() {
      if(this.taskId == null || this.taskId ===""){
        elError("任务不存在")
      }else{
        this.endFlag = true
        updateTask.request({"id":this.taskId, "status":2}).then(
            resp =>{
              // console.log(resp)
              if(resp.data){
                clearInterval(this.timer)
                this.timer = null
                this.countDownTime = 300
                this.getCodeStatus = "已停止获取验证码"
                this.form.phone = null
                this.form.projectName = null
                this.form.projectCode = null
                this.form.lastMsgTime = null
                this.form.code = null
                this.form.codeContent = null

                elSuccess("已停止获取验证码")
              }else{
                elError("停止失败")
              }

            }
        )
      }

    },

  },

}
</script>

<style scoped>

</style>