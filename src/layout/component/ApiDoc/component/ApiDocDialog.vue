<template>
  <abstract-dialog width="70%" :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <h3>详细说明</h3>
    <p>域名地址为: https://ymsms.xyz</p>
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
    <p>调用地址: https://ymsms.xyz/api/phone/getPhone</p>
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
    <p>返回实例</p>
    <pre>
    {"data":{"code":null,"desc":null,"lastMsgTime":"2022-09-14 23:12:18","message":"ok","minute":240,"mobile":"17038163996"},"msg":"操作成功","status":200,"success":true}
    </pre>
    <h3>获取验证码</h3>
    <p></p>
    <p>调用方式：POST</p>
    <p>调用地址: https://ymsms.xyz/api/code/getCode</p>
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
    <p>返回实例</p>
    <pre>
      {"data":{"message":"ok","code":"123411","modle":"【apple】您的验证码为123411，有效期30分钟"},"msg":"操作成功","status":200,"success":true}
    </pre>

    <h3>拉黑手机号码</h3>
    <p></p>
    <p>调用方式：POST</p>
    <p>调用地址: https://ymsms.xyz/api/phoneCollect/add</p>
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
    <p>返回实例</p>
    <pre>
      {
          "data": true,
          "msg": "操作成功",
          "status": 200,
          "success": true
      }
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
        {params: "phone_num", isMust: "false", default: '空', desc: "是否指定手机号码"},
        {params: "projectId", isMust: "true", default: '空', desc: "渠道id，可以从当前渠道复制"},
        {params: "scope", isMust: "false", default: '空', desc: "指定号段，多个号段排除已逗号隔开"},
        {params: "scope_black", isMust: "false", default: '空', desc: "排除号段，多个号段排除已逗号隔开"},
      ],
      getCodeData: [
        {params: "projectId", isMust: "true", default: '空', desc: "渠道id，可以从当前渠道复制"},
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
