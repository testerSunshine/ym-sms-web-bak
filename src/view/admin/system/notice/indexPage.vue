<template>
  <list-page :data="listPageConfig">
    <template v-slot:tableColumn>
      <el-table-column align="center" label="#" type="index" width="80"/>
      <el-table-column align="center" label="公告" prop="content" show-overflow-tooltip/>
      <el-table-column align="center" label="更新时间" prop="updateTime" show-overflow-tooltip/>
    </template>

    <edit-dialog v-model="editDialog" :data="row" :type="type" @success="success"/>
  </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import ListPage from '@/view/_common/ListPage'
import EditDialog from './component/EditDialog'
import {search, add, update, del} from "@/api/system/notice"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {autoCompleteUrl} from "@/util/file"
import {elConfirm, elError, elSuccess} from "@/util/message"

export default {
  name: "NoticeManagement",

  mixins: [tableMixin],

  components: {ListPage, EditDialog},

  data() {
    return {
      searchForm: {
        loginName: '',
        nickName: '',
        role: null,
        enable: null,
        onlineStatus: true, //默认查看在线用户
      },
      temp: {ctime: []},
      editDialog: false
    }
  },

  computed: {
    ...wic({add, update, del, search}),

    listPageConfig() {
      return {
        pageLoading: this.config.operating,
        buttons: [
          this.canAdd && {icon: 'el-icon-plus', e: this.add, content: '添 加'},
          {icon: 'el-icon-view', e: this.see, content: '查 看'},
          this.canUpdate && {icon: 'el-icon-edit', e: this.edit, content: '编 辑'},
          this.canDel && {icon: 'el-icon-delete', e: this.del, content: '删 除'},
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

    add() {
      this.type = 'add'
      this.editDialog = true
    },

    see() {
      if (isEmpty(this.row)) return elError('请选择要查看的公告')
      this.type = 'see'
      this.editDialog = true
    },

    edit() {
      if (isEmpty(this.row)) return elError('请选择要编辑的公告')
      this.type = 'edit'
      this.editDialog = true
    },


    del() {
      if (isEmpty(this.row)) return elError('请选择要删除的公告')
      if (this.config.operating) return
      elConfirm(`确定删除公告【${this.row.loginName}】？`)
          .then(() => {
            this.config.operating = true
            return del.request({id: this.row.id, LoginName: this.row.loginName})
          })
          .then(({msg}) => {
            elSuccess(msg)
            this.search()
          })
          .finally(() => this.config.operating = false)
    },


    success(msg) {
      elSuccess(msg)
      this.editDialog = false
      this.search()
    },

    previewAvatar(src) {
      this.$image({index: 0, urlList: [src]})
    }
  }
}
</script>
