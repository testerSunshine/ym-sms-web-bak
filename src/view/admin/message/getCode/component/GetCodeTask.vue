<template>
  <div>

    <el-button @click="handleGetPhone" type="primary" size="mini" :loading="getPhoneLoading">获取号码</el-button>
    <el-button @click="handleCopyAllPhone" type="primary" size="mini">复制所有号码</el-button>
    <el-button @click="handleClearAllTask" type="danger" size="mini">清空所有任务</el-button>
    <el-table
        :data="smsTaskData"
        style="width: 100%">
      <el-table-column
          type="index"
          label="序号"
          width="50">
      </el-table-column>
      <el-table-column
          prop="channelId"
          label="channelId"
          width="180">
      </el-table-column>
      <el-table-column
          prop="projectCode"
          label="对接码"
          width="120">
      </el-table-column>
      <el-table-column
          prop="phone"
          label="手机号"
          width="150">
        <template slot-scope="scope">
          <span >{{ scope.row.phone }}</span>
          <i style="margin-left: 5px; color: #606266"
             v-clipboard:copy="scope.row.phone"
             v-clipboard:success="copy" class="el-icon-copy-document"></i>
        </template>
      </el-table-column>
      <el-table-column
          prop="code"
          label="验证码"
          width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.code }}</span>
          <i v-if="scope.row.code !== ''" style="margin-left: 5px; color: #606266"
             v-clipboard:copy="scope.row.code"
             v-clipboard:success="copy" class="el-icon-copy-document"></i>
        </template>
      </el-table-column>
      <el-table-column
          prop="codeContent"
          label="短信内容">
      </el-table-column>
      <el-table-column
          prop="taskStatus"
          label="状态"
          width="80">
      </el-table-column>
      <el-table-column
          label="操作">
        <template slot-scope="scope">
<!--          <el-button-->
<!--              type="warning"-->
<!--              size="mini"-->
<!--              @click="stopGetCode(scope.row)">停止任务-->
<!--          </el-button>-->
          <el-button
              type="danger"
              size="mini"
              @click="banPhone(scope.row)">拉黑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {addPhone, getPhone} from "@/api/message/getPhone";
import {getCode} from "@/api/message/getCode";
import {elError, elSuccess} from "@/util/message"
import {stopAllTask, updateTask} from "@/api/message/smsTask";
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
      timerLine: null,
      endFlag: false,
      countDownTime: 300,
      taskId: "",
      refreshTime: 5000,
      getCodeStatus: "等待获取验证码",
      getCodeFlag: false,
      // 表格获取
      smsTaskData: [],
      form: {
        projectId: "",
        projectName: "",
        phone: "等待获取",
        lastMsgTime: "",
        projectCode: "",
        code: "",
        codeContent: "",
        channelId: "",
        phoneId: ""
      },
      percentage: 100,
      getPhoneLoading: false
    }

  },

  watch: {
    taskData: {
      handler(n, o) {
        this.form.phone = n.phoneNo
        this.countDownTime = n.leftSeconds
        this.percentage = Math.round(n.leftSeconds / 3)
        this.form.projectName = n.projectName + "(金币：" + n.userMoney + ")" + "（可用：" + n.projectContent + "）" + "projectId:" + n.projectCode

        this.form.projectId = n.projectId
        this.form.projectCode = n.projectCode
        this.form.channelId = n.channelId

        this.taskId = n.id
        this.getPhoneForm.code = n.projectCode
        this.getPhoneForm.projectId = n.projectId

        this.refreshTime = n.refreshTime
      }
    }
  },

  deactivated() {
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.timerLine)
    this.timerLine = null
  },


  methods: {
    handleGetPhone() {
      this.submitGetPhoneForm()
    },
    handleClearAllTask() {
      let smsData = this.smsTaskData
      if (smsData.length === 0) {
        return
      }
      stopAllTask.request({}).then(() => {
        for (const s of smsData) {
          if (s.taskStatus === "获取中")
            s.taskStatus = "已停止"
          s.countDown = null
        }
      })
      this.smsTaskData = []
    },
    handleCopyAllPhone() {
      let smsData = this.smsTaskData
      if (smsData.length === 0) {
        return
      }
      let phoneList = [];
      for (const v of smsData) {
        phoneList.push(v.phone)
      }
      let message = phoneList.join("\n");
      this.$copyText(message).then(function (e) {
        elSuccess('复制成功')
      }, function (e) {
        elError('复制失败')
      })
    },
    copy() {
      bpSend.request({
        "action_code": "100020",
        "action_name": "使用复制按钮"
      })
      elSuccess("复制成功")
    },
    submitGetPhoneForm() {
      if (this.getPhoneForm.code === '' || this.getPhoneForm.code == null) {
        elError("请先选择项目，如果没有项目请先对接项目之后再尝试")
        return
      }
      this.form.code = null
      this.endFlag = false
      this.countDownTime = 300
      this.percentage = 100

      this.getPhoneLoading = true
      getPhone.request(this.getPhoneForm).then(resp => {
        if (resp.data.mobile === "") {
          elError("没找到符合条件的号码，请检查搜索条件再试")
          return
        }
        let phoneFrom = {
          projectId: this.getPhoneForm.projectId,
          phone: resp.data.mobile,
          lastMsgTime: resp.data.lastMsgTime,
          projectCode: this.getPhoneForm.code,
          code: "",
          codeContent: "",
          channelId: this.getPhoneForm.channelId,
          phoneId: resp.data.phoneId,
          taskStatus: "获取中",
          taskId: resp.data.smsTask.id,
          refreshTime: resp.data.refreshTime,
          countDownTime: 300
        }
        if (resp.data.refreshTime != null || resp.data.refreshTime !== "") {
          phoneFrom.refreshTime = resp.data.refreshTime
        }
        this.smsTaskData.unshift(phoneFrom)
        // 超过20个任务，就删掉最后一个
        if (this.smsTaskData.length > 20) {
          this.smsTaskData.length = 20
        }
        elSuccess("获取手机号成功")
        this.startGetCode(phoneFrom)

      }).finally(() => {
        this.getPhoneLoading = false
      })
    },

    banPhone(rowData) {
      bpSend.request({
        "action_code": "100100",
        "action_name": "拉黑手机号：" + rowData.phone
      })

      if (rowData.projectCode === "") {
        elError("请先获取渠道和正确的手机号再试")
        return
      }
      addPhone.request({
        "channelId": rowData.channelId,
        "code": rowData.projectCode,
        "phoneNo": rowData.phone,
        "type": 0
      }).then(
          resp => {
            if (resp.data === true) {
              elSuccess("拉黑成功")
            } else {
              elError("拉黑失败，可能之前已经拉黑过了")
            }
            rowData.taskStatus = "拉黑"
            rowData.countDown = null
          }

      )
    },

    startGetCode(rowData) {
      this.getCodeFlag = true
      clearInterval(rowData.countDown)
      if (this.getPhoneForm.code === 0) {
        elError("请选择渠道再获取验证码")
        clearInterval(rowData.countDown)
        rowData.taskStatus = "验证码获取错误，请更改手机号或者渠道再重试"
        this.getCodeFlag = false
        return
      }
      this.getCodeStatus = "获取验证码中..."
      // 定时获取验证码
      elSuccess("开始获取验证码")
      rowData.countDown = setInterval(this.handleGetCode, this.refreshTime, rowData);
    },

    handleGetCode(rowData) {
      if (rowData.countDownTime < Math.round(rowData.refreshTime / 1000)) {
        clearInterval(rowData.countDown)
        this.getCodeFlag = false
        rowData.taskStatus = "获取超时"
        return
      }
      getCode.request({
        "code": rowData.projectCode,
        "projectId": rowData.projectId,
        "phoneNum": rowData.phone,
        "channelId": rowData.channelId,
        "phoneId": rowData.phoneId
      }).then(resp => {
        if (resp === undefined) {
          this.stopAuto(rowData)
          return
        }
        if (resp.data.message === "ok" && resp.data.code !== "") {
          rowData.code = resp.data.code
          rowData.codeContent = resp.data.modle
          rowData.lastMsgTime = timeFormat("yyyy-MM-dd HH:mm:ss")
          rowData.taskStatus = "获取成功"
          clearInterval(rowData.countDown)
          // 获取短信成功就更新用户余额
          elSuccess("获取验证码成功")
          this.getCodeStatus = "验证码获取成功"
          this.$emit("handleGetWallet")
          bpSend.request({
            "action_code": "100200",
            "action_name": "获取验证码成功"
          })
        }
      }).finally(
          () => rowData.countDownTime = rowData.countDownTime - 5)
    },

    stopAuto(rowData) {
      bpSend.request({
        "action_code": "100004",
        "action_name": "系统停止获取验证码"
      })
      if (rowData.taskId == null || rowData.taskId === "") {
        elError("任务不存在")
      } else {
        this.endFlag = true
        updateTask.request({"id": rowData.taskId, "status": 2}).then(
            resp => {
              // console.log(resp)
              if (resp.data) {
                clearInterval(rowData.countDown)
                rowData.countDown = null
                if (rowData.taskStatus !== "获取成功") {
                  rowData.taskStatus = "已停止"
                }

                elSuccess("已停止获取验证码")
              } else {
                elError("停止失败")
              }

            }
        )
      }
    },

    stopGetCode(rowData) {
      if (rowData.taskId == null || rowData.taskId === "") {
        elError("任务不存在")
      } else {
        this.endFlag = true
        updateTask.request({"id": rowData.taskId, "status": 2}).then(
            resp => {
              // console.log(resp)
              if (resp.data) {
                clearInterval(rowData.countDown)
                rowData.taskStatus = "手动停止"
                elSuccess("已停止获取验证码")
              } else {
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