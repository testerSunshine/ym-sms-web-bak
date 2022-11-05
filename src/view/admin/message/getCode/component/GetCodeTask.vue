<template>
  <el-card class="get-code-task" style="margin: 5px; border-color: #4AB7BD" shadow="never">
    <el-form ref="form" :model="form" label-width="80px" size="mini">

      任务状态：<el-tag type="success" size="mini" effect="dark" v-if="this.taskStatus">可用</el-tag>
      <el-tag type="danger" size="mini" effect="dark" v-if="!this.taskStatus">禁用</el-tag>
      <el-button style="margin: 10px" type="primary" size="mini" @click="submitGetPhoneForm()" v-if="this.taskStatus">获取手机号</el-button>

      <br>
      <el-form-item label="项目信息:">
        <el-tag type="success" size="mini" effect="dark" >{{ this.form.projectName }}</el-tag>
      </el-form-item>
      <el-form-item label="手机号:">
        <el-tag type="primary"  size="mini" effect="dark" >{{form.phone}}</el-tag>
        <el-button style="margin-left: 10px" size="mini"
                   v-clipboard:copy="this.form.phone"
                   v-clipboard:success="copy" v-if="this.taskStatus">复制手机号</el-button>
        <el-button style="margin-left: 10px" type="danger" size="mini" @click="banPhone()" v-if="this.taskStatus">拉黑该号码</el-button>
      </el-form-item>

      <el-form-item label="最近来码:">
        <el-input v-model="form.lastMsgTime" :disabled=true>time</el-input>
      </el-form-item>

      <el-button style="margin-left: 10px; margin-right: 10px" type="primary" size="mini" @click="startGetCode()" v-if="this.taskStatus" disabled=this.getCodeFlag>获取验证码</el-button>
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
import {bpSend} from "@/api/bp";


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
      getCodeFlag:true,
      form:{
        projectId:"",
        projectName:"",
        phone:"等待获取",
        lastMsgTime:"",
        projectCode:"",
        code:"",
        codeContent:"",
        channelId:"",
        phoneId:""
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
        this.form.channelId = n.channelId

        this.taskId = n.id
        this.getPhoneForm.code = n.projectCode
        this.getPhoneForm.projectId = n.projectId

        // console.log("ssdsada")
        // console.log(this.form.projectName)

      }
    }
  },

  deactivated() {
    bpSend.request({
      "action_code":"100000",
      "action_name":"任务组件被刷新"
    })
    clearInterval(this.timer)
    this.timer = null
  },


  methods:{
    copy() {
      bpSend.request({
        "action_code":"100020",
        "action_name":"使用复制按钮"
      })
      elSuccess("复制成功")
    },

    submitGetPhoneForm() {
      bpSend.request({
        "action_code":"100001",
        "action_name":"获取手机号"
      })

      if (this.getPhoneForm.code === '' || this.getPhoneForm.code == null) {
        elError("请先选择项目，如果没有项目请先对接项目之后再尝试")
        return
      }
      if(this.form.phone != null && this.form.phone.startsWith("1") && !this.form.code){
        elError("该任务已被占用，请先清空任务，或者使用其他任务池")
        return
      }
      this.form.code = null
      this.endFlag = false
      this.countDownTime = 300
      this.form.projectName = this.getPhoneForm.projectName
      this.form.projectId = this.getPhoneForm.projectId
      this.form.projectCode = this.getPhoneForm.code
      this.form.channelId = this.getPhoneForm.channelId



      getPhone.request(this.getPhoneForm).then(resp => {
        if (resp.data.mobile === "") {
          elError("没找到符合条件的号码，请检查搜索条件再试")
          return
        }
        this.form.phone = resp.data.mobile
        this.form.lastMsgTime = resp.data.lastMsgTime
        this.form.phoneId = resp.data.phoneId
        this.taskId = resp.data.smsTask.id
        clearInterval(this.timer)
        elSuccess("获取手机号成功，请先去【"+ this.form.projectName.split("（")[0] +"】发送验证码，再点击获取验证码")

      })
    },

    banPhone(){
      bpSend.request({
        "action_code":"100100",
        "action_name":"拉黑手机号"
      })

      if(this.form.projectCode === ""){
        elError("请先获取渠道和正确的手机号再试")
        return
      }
      if(this.form.phone === "等待获取"){
        elError("请先获取渠道和正确的手机号再试")
        return
      }
      addPhone.request({
        "channelId":this.form.channelId,
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
      this.getCodeFlag = false
      bpSend.request({
        "action_code":"100003",
        "action_name":"开始获取验证码"
      })

      clearInterval(this.timer)
      if (this.getPhoneForm.code === 0) {
        elError("请选择渠道再获取验证码")
        this.getCodeStatus = "验证码获取错误，请更改手机号或者渠道再重试"
        clearInterval(this.timer)
        return
      }
      if (this.form.phone === "等待获取") {
        elError("请先获取手机号再试")
        clearInterval(this.timer)
        return
      }
      // this.countDownTime = 300
      this.getCodeStatus = "获取验证码中..."
      // 定时获取验证码
      elSuccess("开始获取验证码")
      // this.form.code = "等待获取"
      this.form.codeContent = ""
      this.form.lastMsgTime = ""
      this.timer = setInterval(this.handleGetCode, 5000);

    },

    handleGetCode() {
      if (this.countDownTime < 5 || this.endFlag) {
        clearInterval(this.timer)
        this.getCodeStatus = "获取验证码任务结束"
        return
      }
      getCode.request({
        "code":this.form.projectCode,
        "projectId": this.form.projectId,
        "phoneNum": this.form.phone,
        "channelId" : this.form.channelId,
        "phoneId": this.form.phoneId
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
          () => this.countDownTime = this.countDownTime - 5)

    },

    stopAuto(){
      bpSend.request({
        "action_code":"100004",
        "action_name":"系统停止获取验证码"
      })
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
                this.getCodeFlag = true
              }else{
                elError("停止失败")
              }

            }
        )
      }
    },

    stopGetCode() {
      bpSend.request({
        "action_code":"100005",
        "action_name":"用户停止获取验证码"
      })
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
                this.form.phoneId = null
                this.form.projectName = null
                this.form.projectCode = null
                this.form.lastMsgTime = null
                this.form.code = null
                this.form.codeContent = null
                this.form.channelId = null

                this.getCodeFlag = true
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

<style ang="scss">
  .get-code-task .el-card__body {
    padding: 10px;
  }
</style>