<template>
  <abstract-dialog :loading="loading" :title="title" :value="value" width="40%" @close="cancel" @open="open">
    <abstract-form :model="form" :rules="rules">
      <el-form-item label="用戶id" prop="uid">
        <el-input v-model="form.uid" />
      </el-form-item>
      <el-form-item label="反馈消息" prop="message">
        <el-input type="textarea" :rows="2" v-model="form.message"/>
      </el-form-item>
    </abstract-form>

    <template v-slot:footer>
      <el-button plain size="small" @click="closeDialog">取 消</el-button>
      <el-button  v-if="canEdit" size="small" type="primary" @click="confirm">确 定</el-button>
    </template>
  </abstract-dialog>
</template>

<script>
import dialogMixin from "@/mixin/dialogMixin"
import AbstractForm from "@/component/abstract/Form"
import AbstractDialog from '@/component/abstract/Dialog'
import {isEmpty, mergeObj} from '@/util'
import {expandControl} from "@/util/element-ui/elTree"

export default {
  name: "EditDialog",

  mixins: [dialogMixin],

  components: {AbstractForm, AbstractDialog},

  props: {
    value: Boolean,
    type: {type: String, default: 'add'},
    data: {type: Object, default: () => ({})},
  },

  data() {
    return {
      loading: false,
      form: {
        id: null,
        message: "",
        uid: null,
      },
      rules: {
        message: [{required: true, message: '消息不能为空', trigger: 'change'}],
        uid: [{required: true, message: '用户id不能为空', trigger: 'change'}],
      },
      departments: []
    }
  },

  computed: {
    title() {
      if (isEmpty(this.type)) return ''
      switch (this.type) {
        case 'add':
          return '添加消息'
        case 'edit':
          return '编辑消息'
      }
    },

    confirmMessage() {
      switch (this.type) {
        case 'add':
          return `确认添加新的消息【${this.form.message}】?`
        case 'edit':
          return `确认提交对【${this.data.message}】作出的修改？`
        default:
          return ''
      }
    },

    resourceTree() {
      return this.$store.state.resource.resourceTree
    },

    canEdit() {
      return ['add', 'edit'].includes(this.type)
    }
  },

  methods: {
    treeCommand({action, level}) {
      expandControl(this.$refs.perm, action, level)
    },
    open() {
      if (this.type === 'add') return
      this.$nextTick(() => {
        mergeObj(this.form, this.data)
      })
    },

    clearForm() {
      this.form.id = null
      this.form.name = null
      this.form.enable = false
      this.form.scope = 1
      this.form.departmentId = []
      this.form.resourceId = []
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
        const data = {
          ...this.form,
        }
        const promise = this.type === 'add' ? add.request(data) : update.request(data)
        promise
            .then(({msg}) => this.$emit('success', msg))
            .finally(() => this.loading = false)
      })
    },

  },

}
</script>
