<template>
  <abstract-dialog :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <h3>欢迎光临</h3>
    <h4>业务来自第三方，本站无任何自营业务</h4>
    <p>
      本网站坚决抵动机不纯人员,疑似风险的项目已全部屏蔽,仅限正常玩家使用!<br>
      本平台对注册来的小号不保证是否为新号,收到验证码则订单服务完成!<br>
      所有业务均来对接第三方平台！本站无自营业务 <br>
      <br>
      自动屏蔽以下类型项目,例如交友,银行,政务,出行,阿里,腾讯,薅羊毛及政府项目,仅限于邮箱注册,游戏小号换绑等！<br>
      <br>
      如您无视平台公告所造成的后果由您自负,本站不承担责任<br>
      <br>
    </p>
    <template v-slot:footer>
      <el-button size="small" type="primary" @click="confirm">我已知晓并同意</el-button>
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

export default {
  name: "WaningDialog",

  mixins: [dialogMixin],

  components: {AbstractForm, AbstractDialog},

  props: {
    value: Boolean,

  },

  data() {
    return {
      loading: false,
    }
  },

  computed: {
    title() {
      return "易码平台公告"
    },

  },

  methods: {
    cancel() {
      this.closeDialog()
    },

    confirm() {
      this.$emit('success', '')
    }
  }
}
</script>
