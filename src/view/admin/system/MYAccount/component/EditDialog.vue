<template>
  <abstract-dialog :loading="loading" :title="title" :value="value" @close="cancel" @open="open">
    <abstract-form :model="form" :rules="rules" label-width="90px">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.account" :readonly="!!form.id || !canEdit" maxlength="20"/>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" :readonly="!canEdit" maxlength="100"/>
      </el-form-item>
      <el-form-item label="token" prop="token">
        <el-input v-model="form.token" :readonly="!canEdit" maxlength="100"/>
      </el-form-item>

      <el-form-item label="状 态" prop="enable">
        <el-radio-group v-model="form.type" :disabled="!canEdit">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">失效</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="账号用途" prop="enable">
        <el-radio-group v-model="form.operateType" :disabled="!canEdit">
          <el-radio :label="0">搜索</el-radio>
          <el-radio :label="1">充值</el-radio>
        </el-radio-group>
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
import DepartmentSelector from "./DepartmentSelector"
import AbstractDialog from '@/component/abstract/Dialog'
import RoleSelector from './RoleSelector'
import {add, update} from "@/api/system/MYAccount"
import {isEmpty, debounce, mergeObj} from '@/util'

export default {
  name: "EditDialog",

  mixins: [dialogMixin],

  components: {AbstractForm, DepartmentSelector, AbstractDialog, RoleSelector},

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
        account: null,
        password: null,
        token: null,
        type: null,
        operateType: null,
      },
      rules: {
        account: [
          {required: true, message: '用户名不能为空', trigger: 'change'},
        ],
        password: [{required: true, message: '密码不能为空', trigger: 'change'}],
      }
    }
  },

  computed: {
    title() {
      if (isEmpty(this.type)) return ''
      switch (this.type) {
        case 'see':
          return '用户信息'
        case 'add':
          return '添加用户'
        case 'edit':
          return '编辑用户'
      }
    },

    confirmMessage() {
      switch (this.type) {
        case 'add':
          return `确认添加新的用户【${this.form.account}】?`
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
