<template>
  <el-card class="get-code-task" style="margin: 20px" shadow="never">
    <el-form ref="form" :model="form" label-width="80px" size="mini">
      <el-form-item label="任务id:">
        <el-input v-model="form.taskId" disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="状态:">
        <el-button v-model="form.status" type="success" icon="el-icon-check" circle></el-button>
      </el-form-item>

      <el-button style="margin: 10px" type="primary" size="mini" @click="submitGetPhoneForm()">获取手机号</el-button>
      <el-button style="margin: 10px"
                 size="mini"
                 v-clipboard:copy="this.form.phone"
                 v-clipboard:success="copy">复制手机号</el-button>
      <el-button style="margin: 10px" type="danger" size="mini" @click="banPhone()">拉黑该号码</el-button>

      <el-form-item label="项目信息:">
        <el-input v-model="form.projectName" disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="手机号:">
        <el-input v-model="form.phone" disabled="true"></el-input>
      </el-form-item>

      <el-form-item label="最近来码:">
        <el-input v-model="form.lastMsgTime" disabled="true">time</el-input>
      </el-form-item>

      <el-button style="margin: 10px" type="primary" size="mini" @click="startGetCode()">获取验证码</el-button>
      <el-button style="margin: 10px"
                 size="mini"
                 v-clipboard:copy="this.form.code"
                 v-clipboard:success="copy">复制验证码</el-button>
      <el-button style="margin: 10px" type="danger" size="mini" @click="stopGetCode()">终止任务</el-button>
      <el-tag  style="margin: 10px" type="primary" size="medium" effect="dark" >300s</el-tag>

      <el-form-item label="验证码:">
        <el-input v-model="form.code">code</el-input>
      </el-form-item>

      <el-form-item label="短信内容:">
        <el-input type="textarea" :rows="2" v-model="form.codeContent" placeholder="如果验证码提取有错，请自取短信内容里的验证码"></el-input>
      </el-form-item>

    </el-form>


  </el-card>
</template>

<script>
import {getPhone} from "@/api/message/getPhone";
import {getCode} from "@/api/message/getCode";
import {elConfirm, elError, elSuccess} from "@/util/message"
import {addPhone} from "@/api/message/getPhone";
import {search, add} from "@/api/message/publicJoin"



export default {
  name: "GetCodeTask",

  props: {
    "status": String,
    "taskId": String,

    "getPhoneForm": Object,
    "taskData": Object,

    // "projectName": String,
    // "money":Number,
    // "code": String,
    //
    // "phone": String,
    // "lastCodeTime": String,
    //
    // "smsCode": String,
    // "smsContent": String,
    // "countDownTime": Number,
  },

  data() {
    return {
      form:{
        taskId:"",
        status:"",
        projectName:"",
        phone:"",
        lastMsgTime:"",
        projectCode:"",
        code:"",
        codeContent:"",
      }
    }

  },

  methods:{
    copy() {
      elSuccess("复制成功")
    },

    submitGetPhoneForm() {
      if (this.getPhoneForm.projectId === '') {
        elError("请先选择项目，如果没有项目请先对接项目之后再尝试")
        return
      }
      this.form.projectName = this.getPhoneForm.projectName
      getPhone.request(this.getPhoneForm).then(resp => {
        if (resp.data.mobile === "") {
          elError("没找到符合条件的号码，请检查搜索条件再试")
          return
        }
        this.form.phone = resp.data.mobile
        this.form.lastMsgTime = resp.data.lastMsgTime
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
      this.count = 300
      this.getCodeStatus = "获取验证码中..."
      // 定时获取验证码
      elSuccess("开始获取验证码")
      this.form.code = "等待获取"
      this.form.codeContent = ""
      this.form.lastMsgTime = ""
      this.timer = setInterval(this.handleGetCode, 2000);

    },

    stopGetCode() {
      clearInterval(this.timer)
      this.timer = null
      this.count = 300
      this.getCodeStatus = "已停止获取验证码"
      elSuccess("已停止获取验证码")
    },

  }
}
</script>

<style scoped>

</style>