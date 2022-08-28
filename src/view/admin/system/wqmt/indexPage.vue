<template>
  <list-page :data="listPageConfig">
    <template v-slot:searchForm>
      <el-form-item label="用户名">
        <el-input v-model="searchForm.account" clearable maxlength="20"/>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchForm.accType">
          <el-option :value="2" label="已完成"/>
          <el-option :value="101" label="已售出"/>
        </el-select>
      </el-form-item>
    </template>

    <template v-slot:tableColumn>
      <el-table-column align="center" label="#" type="index" width="80"/>
      <el-table-column align="center" label="用户名" prop="loginName" show-overflow-tooltip/>
      <el-table-column align="center" label="密码" prop="loginName" show-overflow-tooltip/>
      <el-table-column align="center" label="状态" width="120">
        <template v-slot="{row}">
          <span :class="row.enable ? 'success' : 'error'" class="dot"/>
          <span>{{ row.enable ? '启用' : '禁用' }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="身份证" prop="nickName" show-overflow-tooltip/>
      <el-table-column align="center" label="姓名" prop="nickName" show-overflow-tooltip/>
    </template>

    <edit-dialog v-model="editDialog" :data="row" :type="type" @success="success"/>
  </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import ListPage from '@/view/_common/ListPage'
import EditDialog from './component/EditDialog'
import RoleSelector from './component/RoleSelector'
import {search, updateSelective} from "@/api/system/wqmt"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {autoCompleteUrl} from "@/util/file"
import {elConfirm, elError, elSuccess} from "@/util/message"

export default {
  name: "wqmtManagement",

  mixins: [tableMixin],

  components: {ListPage, EditDialog, RoleSelector},

  data() {
    return {
      searchForm: {
        account: '',
        searchForm: '',
      },
      temp: {ctime: []},
      editDialog: false
    }
  },

  computed: {
    ...wic({add, update, del, kick, resetPwd}),

    listPageConfig() {
      return {
        pageLoading: this.config.operating,
        buttons: [
          {icon: 'el-icon-edit', e: this.edit, content: '编 辑'},
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
    mergeSearchForm() {
      return {
        ...this.searchForm,
        startTime: this.temp.ctime ? this.temp.ctime[0] : null,
        endTime: this.temp.ctime ? this.temp.ctime[1] + 86400000 : null,
      }
    },

    search() {
      if (this.config.loading) return
      this.config.loading = true
      this.row = null
      this.type = 'see'
      search
          .request(this.mergeSearchForm())
          .then(({data: {list, total}}) => {
            list.forEach(u => u.avatar = autoCompleteUrl(u.avatar))
            this.searchForm.total = total
            this.tableData = list
          })
          .finally(() => this.config.loading = false)
    },

    edit() {
      if (isEmpty(this.row)) return elError('请选择要编辑的用户')
      this.type = 'edit'
      this.editDialog = true
    },


    success(msg) {
      elSuccess(msg)
      this.editDialog = false
      this.search()
    },
  }
}
</script>
