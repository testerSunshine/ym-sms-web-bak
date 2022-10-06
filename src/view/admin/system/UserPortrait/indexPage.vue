<template>
    <list-page :data="listPageConfig">
      <template v-slot:searchForm>
        <el-form-item label="UID">
          <el-input v-model="searchForm.id" clearable maxlength="100"/>
        </el-form-item>
        <el-form-item label="nickname">
          <el-input v-model="searchForm.nickName" clearable maxlength="100"/>
        </el-form-item>
      </template>


        <template v-slot:tableColumn>
          <el-table-column align="center" label="#" type="index" width="40"/>
          <el-table-column sortable align="center" label="用户id" prop="id" show-overflow-tooltip/>
          <el-table-column align="center" label="用户名称" prop="nickName" show-overflow-tooltip/>
          <el-table-column sortable align="center" label="账号创建时间" prop="cT" width="180" show-overflow-tooltip/>
          <el-table-column sortable align="center" label="累计充值" prop="allMoney" show-overflow-tooltip/>
          <el-table-column sortable align="center" label="用户余额" prop="balances" show-overflow-tooltip/>
          <el-table-column sortable align="center" label="最近充值金额" prop="aM" show-overflow-tooltip/>
          <el-table-column align="center" label="最近充值时间" prop="aT" width="180"  show-overflow-tooltip/>
          <el-table-column sortable align="center" label="最近消费金额" prop="dM" show-overflow-tooltip/>
          <el-table-column sortable align="center" label="最近消费时间" prop="dT" width="180"  show-overflow-tooltip/>
          <el-table-column align="center" label="最近一条短信" prop="content" width="500"  show-overflow-tooltip/>
        </template>

        <edit-dialog v-model="editDialog" ref="child" :data="row" :type="type" @success="success"/>
    </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import AbstractPagination from '@/component/abstract/Pagination'
import ListPage from '@/view/_common/ListPage'
import EditDialog from './EditDialog'
import {getPersona, getUserInfo} from "@/api/statistic/index"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {elConfirm, elError, elSuccess} from "@/util/message"

export default {
    name: "UserPortraitManagement",

    mixins: [tableMixin],

    components: {ListPage, EditDialog, AbstractPagination},

    data() {
        return {
            searchForm: {
                page: 1,
                pageSize: 10,
                id:null,
                loginName: '',
                nickName: null,
                role: null,
                enable: null
            },
            temp: {ctime: []},
            editDialog: false
        }
    },

    computed: {
        ...wic({getPersona}),

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
                    on: {'current-change': this.pageChange, 'size-change': this.pageSizeChange}
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
            getPersona
                .request(this.mergeSearchForm())
                .then(resp => {
                    this.searchForm.total = resp.data.total
                    console.log(resp.data.list)
                    this.tableData = resp.data.list
                })
                .finally(() => this.config.loading = false)
        },

        sizeChange(v){
            this.searchForm.pageSize = v
            this.search();
        },


        see() {
            if (isEmpty(this.row)) return elError('请选择要查看的用户')
            getUserInfo
                .request({"uid": this.row.id})
                .then(resp => {
                    this.$refs.child.handleSetUserInfo(resp.data)
                })
                .finally(() => this.config.loading = false)
            this.type = 'see'
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
