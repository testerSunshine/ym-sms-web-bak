<template>
    <list-page :data="listPageConfig">
        <template v-slot:searchForm>
            <el-form-item label="source">
                <el-input v-model="searchForm.source" clearable maxlength="20"/>
            </el-form-item>
            <el-form-item label="ip">
                <el-input v-model="searchForm.ip" clearable maxlength="100"/>
            </el-form-item>
            <el-form-item label="content">
              <el-input v-model="searchForm.content" clearable maxlength="100"/>
            </el-form-item>
        </template>

        <template v-slot:tableColumn>
            <el-table-column align="center" label="#" type="index" width="80"/>
            <el-table-column align="center" label="source" prop="source" show-overflow-tooltip/>
            <el-table-column align="center" label="ip" prop="ip" show-overflow-tooltip/>
            <el-table-column align="center" label="content" prop="content" show-overflow-tooltip/>
        </template>

    </list-page>
</template>

<script>
import tableMixin from '@/mixin/tablePageMixin'
import ListPage from '@/view/_common/ListPage'
import {search} from "@/api/system/SysSource"
import {isEmpty} from '@/util'
import {wic} from "@/util/auth"
import {autoCompleteUrl} from "@/util/file"
import {elConfirm, elError, elSuccess} from "@/util/message"

export default {
    name: "sourceManagement",

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
        ...wic({search}),

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
            search
                .request(this.mergeSearchForm())
                .then(({data: {list, total}}) => {
                    list.forEach(u => u.avatar = autoCompleteUrl(u.avatar))
                    this.searchForm.total = total
                    this.tableData = list
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
