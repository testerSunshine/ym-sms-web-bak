<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col v-for="i in list" :key="i.id" :xs="12" :sm="12" :lg="6">
        <div>{{ i.text }}: {{ i.value }}</div>
      </el-col>
      <el-col>
        <div>樱桃:{{this.yingtaoAccount}}</div>
        <div>流星:{{this.liuxingAccount}}</div>
      </el-col>

    </el-row>
    <p>今日验证码top10项目的名称</p>
    <el-table :data="sendSmsCodeTop10Data"
              style="width: 100%">
      <el-table-column
          prop="code"
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
          prop="userMoney"
          label="价格">
      </el-table-column>
      <el-table-column
          prop="content"
          label="描述">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间">
      </el-table-column>
    </el-table>
    <p>10条收取验证码的项目+用户</p>
    <el-table :data="sendSmsFlowLast10List"
              style="width: 100%">
      <el-table-column
          prop="code"
          label="项目id">
      </el-table-column>
      <el-table-column
          prop="projectName"
          label="项目">
      </el-table-column>
      <el-table-column
          prop="userMoney"
          label="价格">
      </el-table-column>
      <el-table-column
          prop="content"
          label="卡">
      </el-table-column>
      <el-table-column
          prop="nickName"
          label="用户">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间">
      </el-table-column>
    </el-table>
    <p>10条收取验证码的项目详情</p>
    <el-table :data="sendSmsFlowTop10List"
              style="width: 100%">
      <el-table-column
          prop="code"
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

    <p>活跃用户top10账户余额V2</p>
    <el-table :data="userWalletEntityV2"
              style="width: 100%">
      <el-table-column
          prop="uid"
          label="uid">
      </el-table-column>
      <el-table-column
          prop="nickName"
          label="用户">
      </el-table-column>
      <el-table-column
          prop="balances"
          label="余额">
      </el-table-column>
      <el-table-column
          prop="operate"
          label="变动">
      </el-table-column>
      <el-table-column
          prop="money"
          label="变动金额">
      </el-table-column>
      <el-table-column
          prop="updateTime"
          label="更新时间">
      </el-table-column>
    </el-table>


    <!--    <p>活跃用户top10账户余额</p>-->
<!--    <el-table :data="userWalletEntity"-->
<!--              style="width: 100%">-->
<!--      <el-table-column-->
<!--          prop="uid"-->
<!--          label="uid">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="balances"-->
<!--          label="余额">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--          prop="updateTime"-->
<!--          label="更新时间">-->
<!--      </el-table-column>-->
<!--    </el-table>-->
    <div id="lineChartReg" style="height: 400px"></div>
    <div id="lineChartUrlClick" style="height: 400px"></div>
    <div id="lineChartSellNum" style="height: 400px"></div>
    <div id="lineChartMoneyCost" style="height: 400px"></div>
    <div id="lineChartCodeNumSuccess" style="height: 400px"></div>
    <div id="lineChartCodeNumAll" style="height: 400px"></div>
  </div>


</template>

<script>
import PanelGroupItem from './PanelGroupItem'
import cssVar from '@/style/var.scss'
import {getFourBlock, getOneWeekData} from '@/api/statistic'
import {isEmpty} from "@/util"
import {auth} from "@/util/auth"
import {getThirdAccount} from "../../../../../api/system/ThirdAccount";

var echarts = require("echarts");

export default {
  name: 'panelGroup',

  components: {PanelGroupItem},

  data() {
    return {
      loading: false,
      list: [
        // {
        //   id: 'online',
        //   path: '/system/user',
        //   icon: 'svg-user',
        //   color: cssVar.info,
        //   value: 0,
        //   text: '在线用户'
        // },
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
          id: 'dailyNewUserBuyNum',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '今日新用户充值人数'
        },
        {
          id: 'dailyNewUserBuyMoney',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '今日新用户累计充值金币数'
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
          id: 'allUserMoney',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '用户存量金币'
        },
        {
          id: 'sendSmsSuccessCount',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '今日发送验证码'
        },
        {
          id: 'lastThreeDaysActiveUserNum',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '最近三天活跃用户数量'
        },
        {
          id: 'lastFiveMinutesActiveUserNum',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '5分钟活跃人数'
        },
        {
          id: 'lastFiveMinutesSmsNum',
          path: '/system/user',
          icon: 'svg-money',
          color: cssVar.success,
          value: 0,
          text: '5分钟sms量级'
        },

      ],
      sendSmsCodeTop10Data: [],
      sendSmsFlowTop10List: [],
      sendSmsFlowLast10List: [],
      userWalletEntity: [],
      userWalletEntityV2:[],
      regOneWeek:[],
      urlClickOneWeek:[],
      sellNumOneWeek:[],
      moneyCost:[],
      smsCodeNumSuccessOneWeek:[],
      smsCodeNumAllOneWeek:[],
      yingtaoAccount:"",
      liuxingAccount:"",
    }
  },

  methods: {
    init() {
      if (this.loading) return
      this.loading = true

      getOneWeekData.request().then(
          resp => {
            this.regOneWeek = resp.data.reg
            this.urlClickOneWeek = resp.data.urlClick
            this.sellNumOneWeek = resp.data.sellNum
            this.moneyCost = resp.data.moneyCost
            this.smsCodeNumSuccessOneWeek = resp.data.smsCodeNumSuccess
            this.smsCodeNumAllOneWeek = resp.data.smsCodeNumAll

            this.drawLineChart("lineChartReg", this.regOneWeek, "注册");
            this.drawLineChart("lineChartUrlClick", this.urlClickOneWeek, "外链点击");
            this.drawLineChart("lineChartSellNum", this.sellNumOneWeek, "每日金币充值");
            this.drawLineChart("lineChartMoneyCost", this.moneyCost, "每日金币消耗");
            this.drawLineChart("lineChartCodeNumSuccess", this.smsCodeNumSuccessOneWeek, "成功验证码");
            this.drawLineChart("lineChartCodeNumAll", this.smsCodeNumAllOneWeek, "全部验证码");
          }
      )

      getFourBlock
          .request()
          .then(({data}) => {
            this.list.forEach(i => {
              if (i.id in data) i.value = data[i.id]
            })
            this.sendSmsCodeTop10Data = data.bizSendSmsTop10EntityList

            this.sendSmsFlowTop10List = data.statisticSendSmsFlowTop10List
            this.sendSmsFlowLast10List = data.bizSendSmsLast10EntityList
            // this.userWalletEntity = data.sysUserWalletEntityList
            this.userWalletEntityV2 = data.sysUserWalletActiveLast10EntityList
          })
          .finally(() => this.loading = false)

      // getThirdAccount.request({"code":"1"}).then(
      //     resp => {
      //       console.log(resp)
      //     }
      // )

      getThirdAccount.request({"code":"2"}).then(
          resp => {
            this.liuxingAccount = resp.data.data.money
          }
      )

      getThirdAccount.request({"code":"3"}).then(
          resp => {
            this.yingtaoAccount = resp.data.data.money
          }
      )


      // getThirdAccount.request({"code":"4"}).then(
      //     resp => {
      //       console.log(resp)
      //     }
      // )
    },

    jump({path}) {
      if (!isEmpty(path) && auth(path)) this.$router.push(path)
    },

    drawLineChart(id, data, text){
      this.$nextTick(()=>{
        this.$echarts.init(document.getElementById(id)).dispose(); //初始化echarts之前先手动销毁之前的echarts图，防止显示错乱
        let lineChart = this.$echarts.init(document.getElementById(id)); //初始化echarts
        console.log(this.regOneWeek);
        // 添加配置项
        lineChart.setOption(
            {
              title: { text: text },
              tooltip: {
                trigger: 'axis'
              },
              xAxis: {
                type: 'category',
                data: data.map(item => item.days.split(" ")[0]).reverse()

              },
              yAxis: {
                type: 'value',
              },

              series: [
                {
                  type: 'line',
                  data: data.map(item => parseInt(item.count)).reverse()
                }
              ]
            }
        );

      })

    }
  },


  mounted(){
    this.init();

  }
}
</script>

<style scoped>
.panel-group > .el-col {
  margin-bottom: 32px;
}
</style>
