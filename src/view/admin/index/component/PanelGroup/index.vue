<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col v-for="i in list" :key="i.id" :xs="12" :sm="12" :lg="6">
        <div>{{ i.text }}: {{ i.value }}</div>
      </el-col>

    </el-row>
    <p>今日验证码top10项目的名称</p>
    <el-table :data="sendSmsCodeTop10Data"
              style="width: 100%">
      <el-table-column
          prop="projectId"
          label="项目id">
      </el-table-column>
      <el-table-column
          prop="projectName"
          label="项目名">
      </el-table-column>
      <el-table-column
          prop="count"
          label="发送数量">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间">
      </el-table-column>
    </el-table>
    <p>10条收取验证码的项目名称</p>
    <el-table :data="sendSmsFlowTop10List"
              style="width: 100%">
      <el-table-column
          prop="projectId"
          label="项目id">
      </el-table-column>
      <el-table-column
          prop="smsCode"
          label="验证码">
      </el-table-column>
      <el-table-column
          prop="phoneNo"
          label="手机号">
      </el-table-column>
      <el-table-column
          prop="content"
          label="内容">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间">
      </el-table-column>
    </el-table>
    <p>活跃用户top10账户余额</p>
    <el-table :data="userWalletEntity"
              style="width: 100%">
      <el-table-column
          prop="uid"
          label="uid">
      </el-table-column>
      <el-table-column
          prop="balances"
          label="余额">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间">
      </el-table-column>
    </el-table>
  </div>

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
          id: 'sourceCount',
          path: '/system/source',
          icon: 'svg-shopping',
          color: cssVar.primary,
          value: 0,
          text: '今日外链点击量'
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
          id: 'registerCount',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '今日注册'
        },
        {
          id: 'miyunMoney',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '米云余额'
        },
        {
          id: 'sendSmsSuccessCount',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '今日发送验证码'
        },
      ],
      sendSmsCodeTop10Data: [],
      sendSmsFlowTop10List: [],
      userWalletEntit: [],
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
            this.sendSmsCodeTop10Data = data.bizSendSmsTop10EntityList
            this.sendSmsFlowTop10List = data.statisticSendSmsFlowTop10List
            this.userWalletEntity = data.sysUserWalletEntityList
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
