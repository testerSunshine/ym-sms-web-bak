<template>
    <list-page :data="listPageConfig">

        <template v-slot:tableColumn>
            <el-table-column align="center" label="#" type="index" width="80"/>
            <el-table-column sortable align="center" label="累计充值" prop="allMoney" show-overflow-tooltip/>
            <el-table-column sortable align="center" label="用户余额" prop="balances" show-overflow-tooltip/>
            <el-table-column align="center" label="最近一条短信" prop="content" show-overflow-tooltip/>
            <el-table-column sortable align="center" label="最近消费金额" prop="dM" show-overflow-tooltip/>
            <el-table-column sortable align="center" label="最近消费时间" prop="dT" show-overflow-tooltip/>
<!--            <el-table-column sortable align="center" label="用户id" prop="id" show-overflow-tooltip/>-->
            <el-table-column sortable align="center" label="最近充值金额" prop="money" show-overflow-tooltip/>
            <el-table-column align="center" label="用户名称" prop="nickName" show-overflow-tooltip/>
<!--            <el-table-column align="center" label="更新时间" prop="updateTime" show-overflow-tooltip/>-->
        </template>

    </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import ListPage from '@/view/_common/ListPage'
import {getPersona} from "@/api/statistic/index"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {elConfirm, elError, elSuccess} from "@/util/message"

export default {
    name: "UserPortraitManagement",

    mixins: [tableMixin],

    components: {ListPage},

    data() {
        return {
            searchForm: {
                loginName: '',
                nickName: '',
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
                    // {icon: 'el-icon-view', e: this.see, content: '查 看'},
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
            getPersona
                .request(this.mergeSearchForm())
                .then(resp => {
                    this.searchForm.total = resp.data.length
                    console.log(resp.data)
                    this.tableData = resp.data
                })
                .finally(() => this.config.loading = false)
        },


        see() {
            if (isEmpty(this.row)) return elError('请选择要查看的用户')
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
