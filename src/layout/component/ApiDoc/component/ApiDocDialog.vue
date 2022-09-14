<template>
  <abstract-dialog width="70%" :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <h3>详细说明</h3>
    <p>域名地址为: https://yima123.xyz</p>
    <p>统一编码格式：UTF-8</p>
    <p>header中需要带入X-Token(登录态)</p>
    <pre>
    {"Content-Type":"application/json",
    "X-Token":"1-*-1c7ee997-2770-45b5-b6ea-0a7d2e6a598c"}
    </pre>
    <p></p>
    <h3>注意事项</h3>
    <p>所有api调用时均需加休眠1S以上，如果疯狂请求将做封号处理</p>
    <p>获取验证码建议最多获取100次，没获取到就可能真的没有了</p>
    <h3>获取手机号</h3>
    <p>调用方式：POST</p>
    <p>调用地址: https://yima123.xyz/api/phone/getPhone</p>
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
import {elConfirm} from "@/util/message"

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
        {params: "operator", isMust: "true", default: '5', desc: "5=虚拟，4=非虚拟"},
        {params: "phone_num", isMust: "false", default: '空', desc: "是否指定手机号码"},
        {params: "projectId", isMust: "true", default: '空', desc: "渠道id，可以从当前渠道复制"},
        {params: "scope", isMust: "false", default: '空', desc: "指定号段，多个号段排除已逗号隔开"},
        {params: "scope_black", isMust: "false", default: '空', desc: "排除号段，多个号段排除已逗号隔开"},
      ]
    }
  },

  computed: {
    title() {
      return "API接入文档"
    },
  },

  methods: {

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
