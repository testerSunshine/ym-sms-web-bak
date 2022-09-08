<template>
  <list-page :data="listPageConfig">
    <template v-slot:searchForm>
      <el-form-item label="创建时间">
        <el-date-picker
            v-model="temp.updateTime"
            format="yyyy-MM-dd"
            range-separator="-"
            type="daterange"
            value-format="timestamp"
        />
      </el-form-item>
    </template>

    <template v-slot:tableColumn>
      <el-table-column align="center" label="#" type="index" width="80"/>
      <el-table-column align="center" label="用戶id" prop="uid" show-overflow-tooltip/>
      <el-table-column align="center" label="反馈内容" prop="message" show-overflow-tooltip/>
      <el-table-column align="center" label="时间" prop="updateTime" show-overflow-tooltip/>
    </template>

    <edit-dialog v-model="editDialog" :data="row" :type="type" @success="success"/>
  </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import ListPage from '@/view/_common/ListPage'
import EditDialog from './EditDialog'
import {search} from "@/api/system/MessageReport"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {elConfirm, elError, elSuccess} from "@/util/message"

export default {
  name: "MessageReportManagement",

  mixins: [tableMixin],

  components: {ListPage, EditDialog},

  data() {
    return {
      searchForm: {
        updateTime: '',
      },
      temp: {
        ctime: []
      },
      editDialog: false
    }
  },

  computed: {
    ...wic({search}),

    listPageConfig() {
      return {
        pageLoading: this.config.operating,
        buttons: [
          {icon: 'el-icon-view', e: this.see, content: '查 看'},
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

    str2intArray(str) {
      if (isEmpty(str)) return []
      return str.split(',').map(i => parseInt(i))
    },

    search() {
      if (this.config.loading) return
      this.config.loading = true
      this.row = null
      this.type = 'see'
      search
          .request(this.mergeSearchForm())
          .then(({data: {list, total}}) => {
            this.searchForm.total = total
            this.tableData = list
          })
          .finally(() => this.config.loading = false)
    },

    see() {
      if (isEmpty(this.row)) return elError('请选择要查看的消息')
      this.type = 'see'
      this.editDialog = true
    },

    success(msg) {
      elSuccess(msg)
      this.editDialog = false
      this.search()
    }
  }
}
</script>
