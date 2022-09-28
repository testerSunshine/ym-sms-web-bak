<template>
  <abstract-dialog :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <abstract-form :model="form" :rules="rules" label-width="90px">
      <el-form-item label="公告" prop="content">
        <el-input v-model="form.content" :readonly="!!form.id || !canEdit"/>
      </el-form-item>
    </abstract-form>

    <template v-slot:footer>
      <el-button plain size="small" @click="closeDialog">取 消</el-button>
      <el-button v-if="canEdit" size="small" type="primary" @click="confirm">确 定</el-button>
    </template>
  </abstract-dialog>
</template>

<script>
import dialogMixin from "@/mixin/dialogMixin"
import AbstractForm from "@/component/abstract/Form"
import AbstractDialog from '@/component/abstract/Dialog'
import {add, update} from "@/api/system/notice"
import {isEmpty, debounce, mergeObj} from '@/util'

export default {
  name: "EditDialog",

  mixins: [dialogMixin],

  components: {AbstractForm, AbstractDialog},

  props: {
    value: Boolean,
    type: {type: String, default: 'see'},
    data: {type: Object, default: () => ({})},
  },

  data() {
    return {
      loading: false,
      form: {
        id: null,
        content: null
      },
      rules: {
        content: [
          {required: true, message: '公告不能为空', trigger: 'change'},
        ],
      }
    }
  },

  computed: {
    title() {
      if (isEmpty(this.type)) return ''
      switch (this.type) {
        case 'see':
          return '公告信息'
        case 'add':
          return '添加公告'
        case 'edit':
          return '编辑公告'
      }
    },

    confirmMessage() {
      switch (this.type) {
        case 'add':
          return `确认添加新的公告【${this.form.account}】?`
        case 'edit':
          return `确认提交对【${this.data.account}】作出的修改？`
        default:
          return ''
      }
    },

    canEdit() {
      return ['add', 'edit'].includes(this.type)
    }
  },

  methods: {
    open() {
      this.$nextTick(() => {
        if (this.type !== 'add') {
          mergeObj(this.form, this.data)
        }
      })
    },

    clearForm() {
      this.form.id = null
      this.form.account = null
      this.form.nickName = null
      this.form.role = null
      this.form.roleName = null
      this.form.dept = null
      this.form.deptName = null
      this.form.enable = false
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
        this.loading = true
        const promise = this.type === 'add' ? add.request(this.form) : update.request(this.form)
        promise
            .then(({msg}) => this.$emit('success', msg))
            .finally(() => this.loading = false)
      })
    }
  }
}
</script>
