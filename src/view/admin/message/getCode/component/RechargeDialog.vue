<template xmlns="http://www.w3.org/1999/html">
  <abstract-dialog :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <abstract-form :model="form" :rules="rules">
      <el-form-item label="卡密" prop="cardId">
        <el-input v-model="form.cardId" style="width: 70%"/>
        <el-link type="primary" href="https://www.51jingzan.cn/links/F7D9F4E0" target="_blank" :underline="false" @click.native="sendBp">没有卡密？点击购买(如不能访问，请关闭翻墙)</el-link>
        <br>
        <span>说明：从卡密商店购买卡密，获取一串英文+数字序列，然后在这里填入序列，充值对应卡密金币数</span>
      </el-form-item>
    </abstract-form>

    <template v-slot:footer>
      <el-button plain size="small" @click="closeDialog">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm">充 值</el-button>
    </template>
  </abstract-dialog>
</template>

<script>
import dialogMixin from "@/mixin/dialogMixin"
import AbstractForm from "@/component/abstract/Form"
import AbstractDialog from '@/component/abstract/Dialog'
import {activateCard} from "@/api/message/idCard"
import {isEmpty, mergeObj, resetObj} from '@/util'
import {elConfirm} from "@/util/message"
import {bpSend} from "@/api/bp";


export default {
  name: "RechargeDialog",

  mixins: [dialogMixin],

  components: {AbstractForm, AbstractDialog},

  props: {
    value: Boolean,
    type: {type: String, default: 'see'},
    data: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
      loading: false,
      form: {
        cardId: ""
      },
      rules: {
        cardId: [{required: true, message: '卡号不能为空', trigger: 'change'}],
      }
    }
  },

  computed: {
    title() {
      return "卡密充值"
    },

    confirmMessage() {
      return "充值之后卡密就不能再使用了，确认要进行充值吗？"
    },
  },

  methods: {

    open() {
      bpSend.request({
        "action_code":"200000",
        "action_name":"打开充值界面"
      })
      if (this.type !== 'add') mergeObj(this.form, this.data)
    },

    clearForm() {
      resetObj(this.form)
      this.$nextTick(() => this.$refs.form.clearValidate())
    },

    cancel() {
      bpSend.request({
        "action_code":"210000",
        "action_name":"关闭充值页面"
      })
      this.closeDialog()
      this.clearForm()
    },

    sendBp(){
      bpSend.request({
        "action_code":"200001",
        "action_name":"点击商店链接"
      })
    },

    confirm() {
      bpSend.request({
        "action_code":"200002",
        "action_name":"点击确认充值按钮"
      })
      if (this.loading) return
      this.$refs.form.validate(v => {
        if (!v) return
        elConfirm(this.confirmMessage)
            .then(() => {
              this.loading = true
              return activateCard.request(this.form)
            })
            .then(({msg}) => this.$emit('success', msg))
            .finally(() => this.loading = false)
      })
    }
  }
}
</script>
