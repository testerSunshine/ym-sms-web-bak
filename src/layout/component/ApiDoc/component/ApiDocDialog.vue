<template xmlns="http://www.w3.org/1999/html">
  <abstract-dialog width="70%" :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <h3>详细说明</h3>
    <p>域名地址为: https://www.ymsms.xyz</p>
    <p>统一编码格式：UTF-8</p>
    <p>header中需要带入X-Token(登录态)，注意维护好自己的token不可透露给其他人 <el-button
        size="mini"
        type="success"
        v-clipboard:copy="this.$store.state.user.token"
        v-clipboard:success="copy">获取token</el-button></p>
    <pre>
    {"Content-Type":"application/json","X-Token":"xxxx"}
    </pre>
    <p></p>
    <h3>注意事项</h3>
    <p>所有api调用时均需加休眠1S以上，如果疯狂请求将做封号处理，如果接入过程中遇到问题请及时反馈，我们收到后第一时间处理</p>
    <p>获取验证码建议最多获取100次，没获取到就可能真的没有了</p>
    <br>
    <h3>获取手机号</h3>
    <p>调用方式：POST</p>
    <p>调用地址: https://www.ymsms.xyz/api/phone/getPhone</p>
    <p>提交参数:</p>
    <el-table
            :data="getPhoneData"
            style="width: 100%">
      <el-table-column
              prop="params"
              label="参数名"
              width="180">
      </el-table-column>
      <el-table-column
              prop="isMust"
              label="必传"
              width="180">
      </el-table-column>
      <el-table-column
              prop="default"
              label="默认值">
      </el-table-column>
      <el-table-column
              prop="desc"
              label="描述">
      </el-table-column>
    </el-table>
    <p>请求实例</p>
    <pre>
      {"projectName":"","operator":"0","phone_num":"","scope":"","scope_black":"","code":"22833-L5teSLiV","projectId":null,"address":"","channelId":"1171909953355517964"}
    </pre>
    <p>返回实例</p>
    <pre>
      {"data":{"code":0,"desc":null,"lastMsgTime":null,"message":"success","minute":null,"mobile":"16215794469","phoneId":null,"smsTask":{"createTime":null,"endTime":null,"id":12117,"phoneNo":"16215794469","projectId":14102,"startTime":"2022-11-08 20:32:45","status":0,"uid":146,"updateTime":null}},"msg":"操作成功","status":200,"success":true}
    </pre>
    <h3>获取验证码</h3>
    <p></p>
    <p>调用方式：POST</p>
    <p>调用地址: https://www.ymsms.xyz/api/code/getCode</p>
    <p>提交参数:</p>
    <el-table
        :data="getCodeData"
        style="width: 100%">
      <el-table-column
          prop="params"
          label="参数名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="isMust"
          label="必传"
          width="180">
      </el-table-column>
      <el-table-column
          prop="default"
          label="默认值">
      </el-table-column>
      <el-table-column
          prop="desc"
          label="描述">
      </el-table-column>
    </el-table>
    <p>请求实例</p>
    <pre>
      {"code":"22833-L5teSLiV","projectId":null,"phoneNum":"16215794469","channelId":"1171909953355517964","phoneId":null}
    </pre>
    <p>返回实例</p>
    <pre>
      {"data":{"message":"ok","code":"123411","modle":"【雪球】您的验证码为111111，有效期30分钟"},"msg":"操作成功","status":200,"success":true}
    </pre>

    <h3>拉黑手机号码</h3>
    <p></p>
    <p>调用方式：POST</p>
    <p>调用地址: https://www.ymsms.xyz/api/phoneCollect/add</p>
    <p>提交参数:</p>
    <el-table
        :data="phoneCollectData"
        style="width: 100%">
      <el-table-column
          prop="params"
          label="参数名"
          width="180">
      </el-table-column>
      <el-table-column
          prop="isMust"
          label="必传"
          width="180">
      </el-table-column>
      <el-table-column
          prop="default"
          label="默认值">
      </el-table-column>
      <el-table-column
          prop="desc"
          label="描述">
      </el-table-column>
    </el-table>
    <p>返回参数:</p>
    <pre>
      {
          "data": true,
          "msg": "操作成功",
          "status": 200,
          "success": true
      }
    </pre>
    <p></p>
    <h3>一个基于python开箱即用的demo:</h3>
    <pre>
import hashlib
import json
import time

import requests

"""
当前python脚本2.x,3.x均可
域名地址为: https://www.ymsms.xyz

统一编码格式：UTF-8

header中需要带入X-Token(登录态)，注意维护好自己的token不可透露给其他人

  {"Content-Type":"application/json","X-Token":"xxxx"}

注意事项
所有api调用时均需加休眠1S以上，如果疯狂请求将做封号处理，如果接入过程中遇到问题请及时反馈，我们收到后第一时间处理

获取验证码建议最多获取100次，没获取到就可能真的没有了
"""


class GetCodeApiScript:
    def __init__(self, username, password, channelId, code):
        self.code = code
        self.channelId = channelId
        self.password = password
        self.username = username
        self.token = ""
        self.headers = {
            'content-type': 'application/json',
        }

    # 登录
    def login(self):
        md5hash = hashlib.md5(self.password.encode())
        md5 = md5hash.hexdigest()
        payload = json.dumps({
            "username": self.username,
            "password": md5
        })
        url = "https://www.ymsms.xyz/api/account/login"
        response = requests.request("POST", url, headers=self.headers, data=payload)
        print(response.text)
        resp = response.json()
        if resp["status"] != 200:
            raise Exception(response.text)
        self.headers["x-token"] = resp["data"]["token"]

    # 获取手机号
    def get_phone(self):
        payload = json.dumps({
            "projectName": "",
            "operator": "0",
            "phone_num": "",
            "scope": "",
            "scope_black": "",
            "code": self.code,
            "projectId": None,
            "address": "",
            "channelId": self.channelId
        })
        url = "https://www.ymsms.xyz/api/phone/getPhone"
        response = requests.request("POST", url, headers=self.headers, data=payload)
        print(response.text)
        resp = response.json()
        if resp["status"] != 200:
            raise Exception(response.text)
        return resp["data"]

    # 获取验证码
    def get_code(self, phone_data):
        payload = json.dumps({
            "code": self.code,
            "projectId": phone_data.get("projectId"),
            "phoneNum": phone_data.get("phone"),
            "channelId": self.channelId,
            "phoneId": phone_data.get("phoneId")
        })
        url = "https://www.ymsms.xyz/api/code/getCode"
        response = requests.request("POST", url, headers=self.headers, data=payload)
        print(response.text)
        resp = response.json()
        # 如果状态没有返回200，禁止再获取
        if resp["status"] != 200:
            raise Exception(response.text)
        return resp["data"]["code"]

    # 拉黑手机号
    def collect(self, phone):
        url = "https://www.ymsms.xyz/api/phoneCollect/add"
        payload = json.dumps({
            "channelId": self.channelId,
            "code": self.code,
            "phoneNo": phone,
            "type": 0
        })
        response = requests.request("POST", url, headers=self.headers, data=payload)
        print(response.text)


if __name__ == '__main__':
    # 渠道id，你选择渠道的时候的接口会返回
    channelId = "1172497457804742660"
    # 对接码，你选择渠道的时候的接口会返回
    code = "20095-MhgUfSWm"
    # 账号
    username = ""
    # 密码
    password = ""
    script = GetCodeApiScript(username=username, password=password, channelId=channelId, code=code)
    script.login()
    phone_data = script.get_phone()
    for i in range(60):
        time.sleep(5)
        code = script.get_code(phone_data)
        if code != "":
            print("获取验证码成功：{}".format(code))
            break

    </pre>

    <template v-slot:footer>
      <el-button plain size="small" @click="closeDialog">取 消</el-button>
    </template>
  </abstract-dialog>
</template>

<script>
import dialogMixin from "@/mixin/dialogMixin"
import AbstractForm from "@/component/abstract/Form"
import AbstractDialog from '@/component/abstract/Dialog'
import {add} from "@/api/system/MessageReport"
import {isEmpty, mergeObj, resetObj} from '@/util'
import {elConfirm, elSuccess} from "@/util/message"
import store from "@/store";

export default {
  name: "ApiDocDialog",

  mixins: [dialogMixin],

  components: {AbstractForm, AbstractDialog},

  props: {
    value: Boolean,
    type: {type: String, default: 'see'},
    data: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      loading: false,
      getPhoneData: [
        {params: "operator", isMust: "true", default: '0', desc: "0=全部，5=虚拟，4=非虚拟"},
        {params: "channelId", isMust: "true", default: '空', desc: "渠道id，你选择渠道的时候的接口会返回"},
        // {params: "code", isMust: "true", default: '空', desc: "对接码，你选择渠道的时候的接口会返回"},
        // {params: "supplierId", isMust: "false", default: '空', desc: "供应商id，你选择渠道的时候如果有返回则必须填上，否则可以为空"},
        {params: "phone_num", isMust: "false", default: '空', desc: "是否指定手机号码"},
        // {params: "projectId", isMust: "false", default: '空', desc: "项目id，你选择渠道的时候如果有返回则必须填上，否则可以为空"},
        {params: "scope", isMust: "false", default: '空', desc: "指定号段，多个号段排除已逗号隔开"},
        {params: "scope_black", isMust: "false", default: '空', desc: "排除号段，多个号段排除已逗号隔开"},
      ],
      getCodeData: [
        // {params: "projectId", isMust: "false", default: '空', desc: "项目id，你选择渠道的时候如果有返回则必须填上，否则可以为空"},
        {params: "phoneId", isMust: "false", default: '空', desc: "手机id，获取手机号的是如果有返回则必须填上，否则可以为空"},
        {params: "channelId", isMust: "true", default: '空', desc: "渠道id，你选择渠道的时候的接口会返回"},
        // {params: "code", isMust: "true", default: '空', desc: "对接码，你选择渠道的时候的接口会返回"},
        {params: "phone_num", isMust: "true", default: '空', desc: "是否指定手机号码"},
      ],
      phoneCollectData: [
        {params: "code", isMust: "true", default: '空', desc: "当前渠道的code参数"},
        {params: "phone_num", isMust: "true", default: '空', desc: "手机号码"},
        {params: "type", isMust: "true", default: '空', desc: "0=拉黑"},
      ]
    }
  },

  computed: {
    title() {
      return "API接入文档"
    },
  },

  methods: {
    copy() {
      elSuccess("复制成功")
    },
    getToken() {
      console.log(store.state.user.token)
    },

    open() {
      if (this.type !== 'add') mergeObj(this.form, this.data)
    },

    clearForm() {
      resetObj(this.form)
      this.$nextTick(() => this.$refs.form.clearValidate())
    },

    cancel() {
      this.closeDialog()
      this.clearForm()
    },

    confirm() {
      if (this.loading) return
      this.$refs.form.validate(v => {
        if (!v) return
        elConfirm()
            .then(() => {
              this.loading = true
              return add.request(this.form)
            })
            .then(({msg}) => this.$emit('success', msg))
            .finally(() => this.loading = false)
      })
    }
  }
}
</script>
<style>

  pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }

  .string { color: green; }

  .number { color: darkorange; }

  .boolean { color: blue; }

  .null { color: magenta; }

  .key { color: red; }

</style>
