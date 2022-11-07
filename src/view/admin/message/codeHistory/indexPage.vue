<template>
  <list-page :data="listPageConfig">
    <template v-slot:searchForm>
      <el-form-item label="项目Id">
        <el-input v-model="searchForm.projectId" clearable maxlength="100"/>
      </el-form-item>
      <el-form-item label="验证码内容">
        <el-input v-model="searchForm.content" clearable maxlength="100"/>
      </el-form-item>
    </template>

    <template v-slot:tableColumn>
      <el-table-column align="center" label="#" type="index" width="80"/>
      <el-table-column align="center" label="项目ID" prop="code" width="120"/>
      <el-table-column align="center" label="金额" prop="userMoney" width="120"/>
      <el-table-column align="center" label="手机号" prop="phoneNo" width="120"/>
      <el-table-column align="center" label="验证码" prop="smsCode" width="120"/>
      <el-table-column align="center" label="时间" prop="updateTime" width="420"/>
      <el-table-column align="center" label="详情" prop="content"/>
    </template>

  </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import ListPage from '@/view/_common/ListPage'
import {search} from "@/api/message/smsFlow"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {elConfirm, elError, elSuccess} from "@/util/message"
import {bpSend} from "@/api/bp";

export default {
  name: "codeHistoryMessage",

  mixins: [tableMixin],

  components: {ListPage},

  data() {
    return {
      searchForm: {
        projectId: "",
        content: "",
      },
      type: 'add',
      editDialog: false,
      regionDialog: false
    }
  },

  computed: {
    ...wic({search}),

    listPageConfig() {
      return {
        pageLoading: this.config.operating,
        buttons: [
        ],
        dataLoading: this.config.loading,
        search: {
          props: {model: this.searchForm},
          on: {search: this.search}
        },
        table: {
          props: {data: this.tableData},
          on: {'row-click': this.rowClick}
        },
        pagination: {
          props: {model: this.searchForm},
          on: {'current-change': this.pageChange}
        }
      }
    }
  },

  methods: {
    search() {
      bpSend.request({
        "action_code":"010000",
        "action_name":"查看短信记录"
      })
      if (this.config.loading) return
      this.config.loading = true
      this.row = null
      this.type = 'see'
      search
          .request(this.searchForm)
          .then(({data: {list, total}}) => {
            this.searchForm.total = total
            this.tableData = list
          })
          .finally(() => this.config.loading = false)
    },
  }
}
</script>
