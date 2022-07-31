<template>
  <list-page :data="listPageConfig">
    <template v-slot:searchForm>
      <el-form-item label="项目Id">
        <el-input v-model="searchForm.projectId" clearable maxlength="100"/>
      </el-form-item>
    </template>

    <template v-slot:tableColumn>
      <el-table-column align="center" label="#" type="index" width="80"/>
      <el-table-column align="center" label="对接码" prop="code" width="120"/>
      <el-table-column align="center" label="项目ID" prop="projectId" width="120"/>
      <el-table-column align="center" label="项目名称" prop="projectName" width="300"/>
      <el-table-column align="center" label="价格" prop="userMoney" width="120"/>
      <el-table-column align="center" label="可用">
        <template v-slot="{row}">
          <span>在线:{{ row.onlineMum }}|可用:{{ row.canUseMum }}|{{ row.content }} </span>
        </template>
      </el-table-column>
      <el-table-column
          align="center"
          fixed="right"
          label="操作"
          width="100">
        <template slot-scope="scope">
          <el-button @click="handleCancelCollect(scope.row)" type="text" size="small">取消对接</el-button>
        </template>
      </el-table-column>
    </template>

  </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import ListPage from '@/view/_common/ListPage'
import {search, updateSelective} from "@/api/message/smsCollect"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {elConfirm, elError, elSuccess} from "@/util/message"

export default {
  name: "smsCollectManagement",

  mixins: [tableMixin],

  components: {ListPage},

  data() {
    return {
      searchForm: {
        projectId: ""
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

    handleCancelCollect(row) {
      row.type = 0
      updateSelective
          .request(row)
          .then(resp => {
            elSuccess(resp.msg)
            this.search()
          })
    },
  }
}
</script>
