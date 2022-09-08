<template>
  <abstract-dialog :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <abstract-form :model="form" :rules="rules">
      <el-form-item label="反馈内容" prop="message">
        <el-input maxlength="300" show-word-limit type="textarea" :rows="2" v-model="form.message"/>
      </el-form-item>
    </abstract-form>

    <template v-slot:footer>
      <el-button plain size="small" @click="closeDialog">取 消</el-button>
      <el-button size="small" type="primary" @click="confirm">反 馈</el-button>
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
  name: "QuestionReportDialog",

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
        message: ""
      },
      rules: {
        message: [{required: true, message: '请输入反馈内容以便我们能够收到有效的反馈', trigger: 'change'}],
      }
    }
  },

  computed: {
    title() {
      return "问题反馈"
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
