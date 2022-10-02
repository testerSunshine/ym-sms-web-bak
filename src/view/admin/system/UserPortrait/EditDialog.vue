<template>
  <abstract-dialog :loading="loading" :title="title" :value="value" width="70%" @close="cancel" @open="open">
    <el-row :gutter="40" class="panel-group">
      <el-col v-for="i in list" :key="i.id" :xs="12" :sm="12" :lg="6">
        <div>{{ i.text }}: {{ i.value }}</div>
      </el-col>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="充值记录" name="first">
        <el-table
                :data="this.userInfo.walletFlow"
                style="width: 100%">
          <el-table-column
                  prop="money"
                  label="金额"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="createTime"
                  label="时间"
                  width="180">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="近20条短信记录" name="second">
        <el-table
                :data="this.userInfo.smsFlowInfo"
                style="width: 100%">
          <el-table-column
                  prop="projectId"
                  label="项目id"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="projectName"
                  label="项目名称"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="手机号"
                  label="phoneNo"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="userMoney"
                  label="金额"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="content"
                  label="描述"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="updateTime"
                  label="时间"
                  width="180">
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="top20短信排行榜" name="third">
        <el-table
                :data="this.userInfo.smsFlowInfoCount"
                style="width: 100%">
          <el-table-column
                  prop="projectId"
                  label="项目id"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="projectName"
                  label="项目名称"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="手机号"
                  label="phoneNo"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="count"
                  label="总数"
                  width="180">
          </el-table-column>
          <el-table-column
                  prop="userMoney"
                  label="金额"
                  width="180">
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <template v-slot:footer>
      <el-button plain size="small" @click="closeDialog">取 消</el-button>
    </template>
  </abstract-dialog>
</template>

<script>
import dialogMixin from "@/mixin/dialogMixin"
import AbstractForm from "@/component/abstract/Form"
import AbstractFormItem from "@/component/abstract/Form/item"
import AbstractDialog from '@/component/abstract/Dialog'
import RichTextEditor from "@/component/editor/RichTextEditor"
import UserSelector from '@/component/biz/UserSelector/SimpleMultipleUserSelector'
import {isEmpty, mergeObj, resetObj} from '@/util'
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {timestamp2Date} from "@/filter"

export default {
  name: "EditDialog",

  mixins: [dialogMixin],

  components: {AbstractForm, AbstractFormItem, AbstractDialog, RichTextEditor, UserSelector, quillEditor},

  props: {
    value: Boolean,
    type: {type: String, default: 'see'},
    data: {type: Object, default: () => ({})}
  },

  data() {
    return {
      loading: false,
      needSearch: false,
      form: {
        id: null,
      },
      activeName: "first",
      userInfo: null,
      list: [
        {
          id: 'id',
          value: null,
          text: '用户id'
        },
        {
          id: 'nickName',
          value: null,
          text: 'nickname'
        },
        {
          id: 'ctime',
          value: null,
          text: '创建时间'
        },
        {
          id: 'balances',
          value: null,
          text: '钱包余额'
        },
        {
          id: 'amount',
          value: null,
          text: '累计充值金币'
        },
      ]
    }
  },
  computed: {
    recipient() {
      return [this.data.uid]
    },
    title() {
      if (isEmpty(this.type)) return ''
      switch (this.type) {
        case 'see':
          return '查看用户信息'
      }
    },

    canSave() {
      return false
    },
    canPublish() {
      return false
    },
    canWithdraw() {
      return false
    },
  },

  methods: {
    /**
     * 设置用户信息
     */
    handleSetUserInfo(info) {
      this.userInfo = info
      this.list.forEach(i => {
        if (i.id in this.userInfo.sysUser) i.value = this.userInfo.sysUser[i.id]
        if (i.id in this.userInfo.wallet) i.value = this.userInfo.wallet[i.id]
        //格式化时间戳
        if (i.id === "ctime") {
          console.log(timestamp2Date(i.value))
          i.value = timestamp2Date(i.value)
        }
      })
    },

    open() {
      if (this.type === 'add') return
      const recipient = (this.data.recipient || '').split(',').filter(Boolean).map(i => parseInt(i))
      mergeObj(this.form, {...this.data, recipient})
    },

    cancel() {
      this.closeDialog()
      this.needSearch && this.$emit('search')
    },

    transformForm() {
      const recipient =
          Array.isArray(this.form.recipient) && this.form.recipient.length > 0
              ? this.form.recipient.join(',')
              : null
      return {...this.form, recipient}
    }
  }
}
</script>
