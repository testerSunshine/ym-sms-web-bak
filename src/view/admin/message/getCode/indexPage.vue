<template>
  <div>
    <el-alert
        :title="this.notice"
        type="error"
        v-show="noticeBoolen"
    >
    </el-alert>
    <br>
    <el-row :gutter="20">
      <el-col :span="16" :xs="24">
        <div class="grid-content bg-purple">
          <div class="user-info-tip">
            <p>
              <span style='color: red;'>大部分问题都能在最底下问题解释找到答案！价格搜索后显示！！！</span>
              <br>
              操作说明：<br>
              1. 搜索短信内容关键字，不知道关键字？用自己手机接一条，看看短信内容抬头叫啥<br>
              2. 选择渠道，点击获取手机号，项目对不对齐关键字靠自己尝试<br>
              3. 去刷的项目里填入获取到的手机号，点击发送验证码<br>
              4. 回到平台点击获取验证码<br>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="8" :xs="24">
          <div class="grid-content bg-purple-light" style="margin-bottom: 10px">
            <el-card class="box-card" style="background-color: #FAECD8">
            <div slot="header" class="clearfix">
               <el-col :span="16">
                  <p style="font-style: italic; font-weight: bold; color: #88949d">金币余额</p>
              </el-col>
              <el-col :span="8">
                  <el-button @click="handleSupplier" type="danger" size="mini">立即充值</el-button>
              </el-col>
              <!--        <el-button style="float: right; padding: 3px 0" type="text">充值</el-button>-->
            </div>
            <div style="height: 50px">
              <p style="font-style: italic; font-size: 3em; margin: 0px; color: darkslategray">${{ this.wallet }}</p>
            </div>
          </el-card>
          </div>
      </el-col>
    </el-row>



    <el-card class="get-phone-page" shadow="never">
      <el-form ref="getPhoneForm" :model="getPhoneForm" label-width="120px" size="mini">
        <el-form-item label="关键字：">
          <el-input v-model="keyWord"
                    style="width: 70%"
                    placeholder="输入短信关键字搜索，不知道啥关键字的，先用自己手机接一条看看"
          ></el-input>

          <el-button :loading="projectSearchLoading" type="primary" @click="loadProjectList">搜索</el-button>
        </el-form-item>

        <el-form-item label="当前渠道：">
          <el-tag type="primary" size="medium" effect="dark">{{getPhoneForm.projectName}}</el-tag>
        </el-form-item>

        <el-form-item label="运营商：">
          <el-select v-model="getPhoneForm.operator" placeholder="请选择运营商">
            <el-option label="不限" value="0"></el-option>
            <el-option label="虚卡" value="5"></el-option>
            <el-option label="实卡" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="其他非必选项(可展开)" name="1">

            <el-form-item label="指定号码：">
              <el-input v-model="getPhoneForm.phone_num" placeholder="填要取的手机号, 可以获得指定号码"></el-input>
            </el-form-item>

            <el-form-item label="指定号段：" >
              <el-input v-model="getPhoneForm.scope" placeholder="指定号段查询 (譬如:137开头的号段或者1371开头的号段)"></el-input>
            </el-form-item>

            <el-form-item label="排除号段：" >
              <el-input v-model="getPhoneForm.scope_black" placeholder="排除号段最长支持4位且可以支持多个,最多支持20个号段。用逗号分隔 比如184,1841"></el-input>
            </el-form-item>

            <el-form-item label="归属地：" >
              <el-input v-model="getPhoneForm.address" placeholder="归属地选择 例如 北京 不需要带省、市字样"></el-input>
            </el-form-item>

          </el-collapse-item>
        </el-collapse>
        <br>

<!--        <el-form-item>-->
<!--          <el-button type="primary" @click="submitGetPhoneForm('getPhoneForm')">获取手机号</el-button>-->
<!--          <br>-->
<!--        </el-form-item>-->
      </el-form>
    </el-card>
<!--    <el-card class="get-code-page" style="margin-top: 20px" shadow="never">-->
<!--      <el-form ref="getCodeForm" :model="getCodeForm" label-width="120px" size="mini">-->
<!--        <el-form-item label="手机号：">-->
<!--          <el-tag type="primary"  size="medium" effect="dark" >{{getCodeForm.phone}}</el-tag>-->
<!--          <el-input v-model="getCodeForm.phone" style="width: 90%" :disabled="true"></el-input>-->
<!--          <el-button style="margin-left: 5px ; margin-right: 5px"-->
<!--                     v-clipboard:copy="getCodeForm.phone"-->
<!--                     v-clipboard:success="copy">复制</el-button>-->
<!--          <el-button type="danger" @click="banPhone()">拉黑该号码</el-button>-->
<!--            <br>-->
<!--          <el-tag type="danger">获取过程别刷新页面，一旦您发了验证码，后台会一直拉取，如果刷新了，请去记录里找，这种情况也会扣费，所以您发现异常扣费，就是您发了验证码，但是您刷新页面了</el-tag>-->
<!--            <br>-->
<!--          <el-tag type="primary">点击"获取验证码"之前请务必保证自己发送了这个手机号的验证码，怎么发？去你刷的app里面发！！！自己都没去发验证码就来这里获取的，说收不到码的，我建议你别玩了！！！（渠道关键字务必对齐你刷的app，别张三的渠道刷李四的码</el-tag>-->
<!--&lt;!&ndash;          <el-tag type="primary">自己都没去发验证码就来这里获取的，说收不到码的，我建议你别玩了！！！（渠道关键字务必对齐你刷的app，别张三的渠道刷李四的码）</el-tag>&ndash;&gt;-->
<!--            <br>-->
<!--          <el-tag type="primary">操作没问题还收不到码的，去看下面问题解释</el-tag>-->
<!--          <br>-->
<!--          <el-button type="primary" @click="startGetCode()">获取验证码</el-button>-->
<!--          <el-button type="primary" @click="stopGetCode()">停止获取</el-button>-->
<!--        </el-form-item>-->


<!--        <el-form-item label="最近来码时间：">-->
<!--          <el-input v-model="getCodeForm.lastMsgTime" :disabled="true"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="获取倒计时:">-->
<!--          <el-tag type="primary" size="medium"  effect="dark" >{{getCodeStatus}}  {{count}}s</el-tag>-->
<!--          <span></span>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="验证码：">-->
<!--          <el-tag type="primary" size="medium" effect="dark" >{{getCodeForm.code}}</el-tag>-->
<!--          <el-button style="margin-left: 5px"-->
<!--                     v-clipboard:copy="getCodeForm.code"-->
<!--                     v-clipboard:success="copy">复制</el-button>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="短信内容：">-->
<!--          <el-input type="textarea" :rows="1" v-model="getCodeForm.codeContent"></el-input>-->
<!--        </el-form-item>-->

<!--      </el-form>-->
<!--    </el-card>-->

    <el-card class="get-code-pool" style="margin-top: 10px" shadow="never">
      <el-tag type="danger" size="medium" effect="dark" v-if="taskRole.hasNext">当前可用多开任务池数量【{{this.taskRole.userCanTaskNum}}】个，开启下一个还差充值【{{this.taskRole.nextTaskMoney}}】金币</el-tag>
      <el-tag type="success" size="medium" effect="dark" v-if="!taskRole.hasNext">恭喜您！多开任务池数量已经开满！</el-tag>
      <el-button @click="handleSupplier" type="danger" size="mini">立即充值</el-button>
      <el-row>
        <el-col :span="12" :xs="24">
          <GetCodeTask ref="GetCodeTask1" :get-phone-form=this.getPhoneForm :task-status=this.taskList[0] :task-data=this.taskDataList[0]></GetCodeTask>
        </el-col>
        <el-col :span="12" :xs="24">
          <GetCodeTask ref="GetCodeTask2" :get-phone-form=this.getPhoneForm :task-status=this.taskList[1] :task-data=this.taskDataList[1]></GetCodeTask>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :xs="24">
          <GetCodeTask ref="GetCodeTask3" :get-phone-form=this.getPhoneForm :task-status=this.taskList[2] :task-data=this.taskDataList[2]></GetCodeTask>
        </el-col>
        <el-col :span="12" :xs="24">
          <GetCodeTask ref="GetCodeTask4" :get-phone-form=this.getPhoneForm :task-status=this.taskList[3] :task-data=this.taskDataList[3]></GetCodeTask>
        </el-col>
      </el-row>

    </el-card>

    <el-card style="margin-top: 10px" shadow="never">
      <div style="margin: 20px">问题解释Q&A</div>
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item title="为什么我收不到验证码" name="1">
          <div>1.确认已经在对应项目的app/web等端给获取到的手机号发送了验证码，不发平台怎么接？</div>
          <div>2.手机号被项目风控了，请切换手机号或者切换渠道再试，建议多换手机号试试，不要轻易放弃渠道</div>
          <div>3.手机号被用过了，注册相关的项目收不到，登录可能可以收到</div>
          <div>4.项目不支持虚拟号，请切换实卡再试</div>
          <div>5.相对来说，价格高的渠道优质一点</div>
          <div>6.大热门很难找到首次资源，比如抖音-米哈游等等，基本走注册是收不到的</div>
          <div>说明：各个渠道的卡质量不一，与平台无关，收不到短信不扣费！！！</div>
        </el-collapse-item>
        <el-collapse-item title="为什么莫名其妙扣钱了" name="2">
          <div>在短信倒计时结束前均有可能收到验证码，即使点击停止获取也有可能获取到；</div>
          <div>如果您在这个时间段刷新了页面，后台依然会获取手机号，毕竟您已经发送了；</div>
          <div>所以您需要耐心等待，如果刷新了，需要去记录里面寻找验证码</div>
        </el-collapse-item>
        <el-collapse-item title="我怎么指定手机号？" name="3">
          <div>1.项目选择那有一个"其他非必选项(可展开)"，展开可以指定手机号</div>
        </el-collapse-item>
        <el-collapse-item title="为什么找不到指定手机号了？" name="4">
          <div>1.找不到手机号第一是你选择的项目池子不对</div>
          <div>2.如果确认池子没错，那就是池子里的卡已经被替换成新卡了，无法再找到</div>
          <div>温馨提示：做好账号维护，做好账号密码登录，不要指望卡能保持很久</div>
        </el-collapse-item>
        <el-collapse-item title="手机号能保存多久" name="5">
          <div>上游供应商决定，平台无法确定时效</div>
        </el-collapse-item>
        <el-collapse-item title="为什么我搜不到项目" name="6">
          <div>高危不做，搜不到就是没得玩</div>
          <div>搜索是模糊搜索</div>
        </el-collapse-item>
        <el-collapse-item title="有国外卡吗？" name="7">
          <div>没有，只有国内卡</div>
        </el-collapse-item>
        <el-collapse-item title="能发短信吗？能接语音短信吗？" name="8">
          <div>都不能，只能接</div>
        </el-collapse-item>
        <el-collapse-item title="有其他问题？" name="9">
          <div>点击右上角问题反馈，会有人回复</div>
        </el-collapse-item>
      </el-collapse>
    </el-card>

    <el-dialog title="项目列表" :visible.sync="dialogProjectVisible" width="40%" center>
      <el-table v-loading="loading" :data="projectList" stripe style="width: 100%">
        <el-table-column property="id" label="id" width="100"></el-table-column>
        <el-table-column property="name" label="项目名称" width="250"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
        >
          <template slot-scope="scope">
            <el-button @click="handleGetProjectEnterSearch(scope.row.id)" type="text" size="small">查看渠道</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>



    <el-dialog title="可选渠道列表" :visible.sync="dialogTableVisible" width="40%" center>
      <el-table v-loading="loading" :data="projectListData" stripe style="width: 100%">
        <el-table-column property="code" label="项目id" width="100"></el-table-column>
        <el-table-column property="userMoney" label="价格" width="70"></el-table-column>
<!--        <el-table-column property="canUseMum" label="可用" width="50"></el-table-column>-->
        <el-table-column property="content" label="详情" width="100"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            >
          <template slot-scope="scope">
            <el-button @click="handleProjectSelect(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <recharge-dialog v-model="editDialog" type="recharge" @success="success"/>
  </div>
</template>

<script>
import {add, search} from "@/api/message/publicJoin"
import {getWallet} from "@/api/system/SysUserWallet"
import {searchProject} from "@/api/message/getCode";
import RechargeDialog from "./component/RechargeDialog"
import GetCodeTask from "./component/GetCodeTask"
import {elError, elSuccess} from "@/util/message"
import {getLastOne} from "@/api/system/notice";
import {getTask, getTaskRole} from "@/api/message/smsTask";


export default {
  name: "getCode",
  components: {RechargeDialog, GetCodeTask},
  data() {
    return {
      keyWord:"",
      projectSearchLoading: false,
      projectInputLoading: false,
      activeNames : [],
      getPhoneForm: {
        projectName: '暂未选择渠道，请搜索关键字获取渠道，不知道啥关键字的，先用自己手机接一条看看',
        operator: '0',
        phone_num: '',
        scope: '',
        scope_black: '',
        code: '',
        projectId: 0,
        address: '',
      },
      // getCodeForm: {
      //   phone: '等待获取',
      //   lastMsgTime: '',
      //   code: '等待获取',
      //   codeContent: '',
      // },
      projectSearchOptions: [],
      wallet: "0.00",
      // timer: null,
      // count: 300,
      // getCodeStatus:"",
      editDialog: false,
      remoteSearchQuery: '',

      dialogTableVisible:false,
      dialogProjectVisible:false,
      projectListData:[],
      projectList:[],
      loading:true,
      notice:"",
      noticeBoolen: false,

      taskRole:{
        hasNext: true,
        nextLevel: 0,
        nextTaskMoney: 0,
        nextUserCanTaskNum: 0,
        userCanTaskNum: 0
      },

      taskList:[false,false,false,false],

      taskData:{
        id:0,
        leftSeconds:300,
        phoneNo:"",
        projectId:"",
        projectName:"",
        projectCode:"",
        projectContent:"",
        userMoney:"",
        status:"",
      },

      taskDataList:[null, null, null, null]

    }
  },
  computed: {},


  created() {
    this.handleGetWallet()
    getLastOne.request({}).then(resp => {
      if(resp.msg === null || resp.msg === "" || resp.msg.trim() === "关闭"){
        this.noticeBoolen = false
      }else{
        this.notice = "公告：" + resp.msg
        this.noticeBoolen = true
      }

    })

    getTask.request({}).then(
        resp => {
          // console.log(resp.data)
          if(resp.data.length <= 0){
            console.log("null data")
          }else{
            for(let i=0; i<resp.data.length; i++){
              let taskData = {}
              taskData.id = resp.data[i].id
              taskData.leftSeconds = resp.data[i].leftSeconds
              taskData.phoneNo = resp.data[i].phoneNo
              taskData.projectName = resp.data[i].projectName
              taskData.projectId = resp.data[i].projectId
              taskData.status = resp.data[i].status

              taskData.projectCode = resp.data[i].bizSmsProjectDetailInfo.code
              taskData.projectContent = resp.data[i].bizSmsProjectDetailInfo.content
              taskData.userMoney = resp.data[i].bizSmsProjectDetailInfo.userMoney

              this.$set(this.taskDataList, i ,taskData);
              // console.log(taskData.phoneNo)
              // this.taskList[i] = true 非响应式
            }
          }
          // console.log(this.taskDataList)


        }
    )

    getTaskRole.request({}).then(
        resp => {
          this.taskRole = resp.data;
          for(let i=0; i<resp.data.userCanTaskNum; i++){
            this.$set(this.taskList, i ,true);
            // this.taskList[i] = true 非响应式
          }
        }
    )


  },

  methods: {
    loadProjectList(){
      this.projectInputLoading = true
      this.projectSearchLoading = true
      searchProject
          .request({"search": this.keyWord})
          .then(resp => {
            if (resp.data !== null) {
              this.dialogProjectVisible=true
              this.loading=false
              this.projectList = resp.data.list
            }
          }).finally(
          () => this.projectInputLoading = false,
          this.projectSearchLoading = false,
          this.loading=true
      )

    },

    handleGetProjectEnterSearch(id) {
      this.projectInputLoading = true
      this.projectSearchLoading = true
      search
          .request({"keyword": id})
          .then(resp => {
            this.loading=false
            this.projectListData = resp.data.list
            this.dialogTableVisible=true
          })
          .finally(() => this.projectInputLoading = false,
              this.projectSearchLoading = false,
              this.loading=true
          )
    },
    // projectNameChange() {
    //   this.$refs.projectNameSelect.query = ""
    // },
    // getProjectRemoteData(query) {
    //   this.remoteSearchQuery = query
    // },

    handleChange(val) {
      console.log(val);
    },

    handleGetWallet() {
      getWallet.request({}).then(resp => {
        this.wallet = resp.data.balances
      })
    },
    success(msg) {
      elSuccess(msg)
      this.editDialog = false
      this.handleGetWallet()
    },
    handleSupplier() {
      this.editDialog = true
    },

    handleProjectSelect(row){

      const loading = this.$loading({
        lock: true,
        text: '渠道切换中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      add.request(row).then(resp => {
        loading.close()
        if (resp.data.desc !== "添加成功") {
          elError("该渠道无法使用，请换一个渠道试试")
          return
        }
        this.getPhoneForm.projectId = resp.data.id
        this.dialogTableVisible=false
        this.getPhoneForm.projectName = row.projectName + "（$" + row.userMoney + ")" + "（可用：" + row.content + "）" + "projectId: " + this.getPhoneForm.projectId
        this.getPhoneForm.code = row.code
        this.dialogProjectVisible = false

      })

    },

  },
  watch: {}
}
</script>

<style lang="scss">
.user-info-tip {
  padding: 8px 16px;
  background-color: #ecf8ff;
  border-radius: 4px;
  border-left: 5px solid #50bfff;
  margin-bottom: 10px;
}

a {
  color: #409eff;
  text-decoration: none;
}
</style>
