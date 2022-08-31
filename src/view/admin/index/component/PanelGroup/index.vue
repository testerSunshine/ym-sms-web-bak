<template>
    <el-row :gutter="40" class="panel-group">
        <el-col v-for="i in list" :key="i.id" :xs="12" :sm="12" :lg="6">
            <panel-group-item v-bind="i" @click.native="jump(i)"/>
        </el-col>
    </el-row>
</template>

<script>
import PanelGroupItem from './PanelGroupItem'
import cssVar from '@/style/var.scss'
import {getFourBlock} from '@/api/statistic'
import {isEmpty} from "@/util"
import {auth} from "@/util/auth"

export default {
    name: 'panelGroup',

    components: {PanelGroupItem},

    data() {
        return {
            loading: false,
            list: [
                {
                    id: 'online',
                    path: '/system/user',
                    icon: 'svg-user',
                    color: cssVar.info,
                    value: 0,
                    text: '在线用户'
                },
                {
                    id: 'registerCount',
                    path: '/system/source',
                    icon: 'svg-shopping',
                    color: cssVar.primary,
                    value: 0,
                    text: '今日转化率'
                },
                {
                    id: 'sell',
                    path: '/sell/order',
                    icon: 'svg-sell',
                    color: cssVar.warning,
                    value: 0,
                    text: '今日售卡'
                },
                {
                    id: 'sourceCount',
                    path: '/system/user',
                    icon: 'svg-money',
                    color: cssVar.success,
                    value: 0,
                    text: '今日注册'
                },
            ]
        }
    },

    methods: {
        init() {
            if (this.loading) return
            this.loading = true
            getFourBlock
                .request()
                .then(({data}) => {
                    this.list.forEach(i => {
                        if (i.id in data) i.value = data[i.id]
                    })
                })
                .finally(() => this.loading = false)
        },

        jump({path}) {
            if (!isEmpty(path) && auth(path)) this.$router.push(path)
        }
    },

    mounted() {
        this.init()
    }
}
</script>

<style>
.panel-group > .el-col {
    margin-bottom: 32px;
}
</style>
