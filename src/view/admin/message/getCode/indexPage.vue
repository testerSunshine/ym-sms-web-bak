<template>
    <div>
        <el-alert
                :title="this.notice"
                type="error"
                v-show="noticeBoolen"

        >
        </el-alert>
        <div style="display: flex">
            <div style="font-size: 25px">金币余额: {{ this.wallet }}</div>
            <el-button style="margin-left: 5px" @click="handleSupplier" type="danger" size="mini">立即充值</el-button>
        </div>
        <el-card class="get-phone-page" shadow="never">
            <el-form ref="getPhoneForm" :model="getPhoneForm" label-width="120px" size="mini">
                <el-form-item label="关键字：">
                    <el-input v-model="keyWord"
                              style="width: 70%"
                              placeholder="输入短信关键字搜索，不知道啥关键字的，先用自己手机接一条看看"
                    ></el-input>

                    <el-button :loading="projectSearchLoading" type="primary" @click="handleGetProjectEnterSearch">搜索
                    </el-button>
                </el-form-item>

                <el-form-item label="当前渠道：">
                    <el-tag type="primary" size="medium" effect="dark">{{getPhoneForm.projectName}}</el-tag>
                    <el-button type="success" size="mini"
                               @click="()=>{ projectListData.length !==0 ? this.dialogTableVisible=true:this.error()}">
                        快捷切换渠道
                    </el-button>
                    （如果渠道有变更请重新搜索项目）
                    <br>
                    <el-button type="success" size="mini" v-clipboard:copy="JSON.stringify(this.getPhoneForm)"
                               v-clipboard:success="copy">一键复制api请求所需参数
                    </el-button>
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

                        <el-form-item label="指定号段：">
                            <el-input v-model="getPhoneForm.scope"
                                      placeholder="指定号段查询 (譬如:137开头的号段或者1371开头的号段)"></el-input>
                        </el-form-item>

                        <el-form-item label="排除号段：">
                            <el-input v-model="getPhoneForm.scope_black"
                                      placeholder="排除号段最长支持4位且可以支持多个,最多支持20个号段。用逗号分隔 比如184,1841"></el-input>
                        </el-form-item>

                        <el-form-item label="归属地：">
                            <el-input v-model="getPhoneForm.address" placeholder="归属地选择 例如 北京 不需要带省、市字样"></el-input>
                        </el-form-item>

                    </el-collapse-item>
                </el-collapse>
                <br>

            </el-form>
        </el-card>

        <el-card>
            <GetCodeTask ref="getCodeTaskRef" :get-phone-form=this.getPhoneForm></GetCodeTask>
        </el-card>
        <el-dialog title="项目列表" :visible.sync="dialogProjectVisible" width="40%" center>
            <el-button type="success" size="small" @click="()=>{this.dialogApplyProjectVisible=true}">没有该项目？点击申请
            </el-button>
            <p style="color: red">如果项目不存在，可能是服务抖动，不要急着立马申请，多搜索几次看看</p>
            <el-table v-loading="loading" :data="projectList" stripe style="width: 100%">
                <!--        <el-table-column property="id" label="id" width="100"></el-table-column>-->
                <el-table-column property="name" label="项目名称" width="250"></el-table-column>
                <el-table-column
                        fixed="right"
                        label="操作"
                >
                    <template slot-scope="scope">
                        <el-button @click="handleGetProjectEnterSearch(scope.row)" type="text" size="small">查看渠道
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="新项目申请单" :visible.sync="dialogApplyProjectVisible" center>
            <p style="color: red">填写收到的短信内容。例如:"[京东] 您的验证码为XXxxXX."</p>
            <el-form ref="form" :model="applyNewProjectNotChannelForm" label-width="80px" size="mini">
                <el-form-item label="短信模版">
                    <el-input v-model="applyNewProjectNotChannelForm.content"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="applyNewProjectNotChannel" :loading="applyProjectButtonWait">
                        立即申请
                    </el-button>
                    <el-button @click="()=>{this.dialogApplyProjectVisible=false}">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="可选渠道列表" :visible.sync="dialogTableVisible" width="50%" center>
            <el-button type="success" size="small" @click="()=>{this.dialogApplyVisible=true}"
                       v-if="this.applyNewProjectForm.supplier === '2'">没有合适渠道？点击申请
            </el-button>
            <p style="color: red">部分项目没有最近来码时间，请不必担心</p>
            <el-table v-loading="loading" :data="projectListData" stripe style="width: 100%">

                <el-table-column property="code" label="项目id" width="100"></el-table-column>
                <el-table-column property="projectName" label="项目名称" width="150"></el-table-column>
                <el-table-column property="userMoney" label="价格" width="70"></el-table-column>
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

        <el-dialog title="新渠道申请单" :visible.sync="dialogApplyVisible" center>
            <p style='color: red;'>说明：该申请会直接通知卡商，如果卡商愿意对接，就会有站内信通知你成功的渠道信息，但渠道都是公开的，有消息请及时使用</p>
            <p style='color: red;'>为了避免被滥用，申请逻辑调整为钱包需要有当前项目（每条短信的金额*数量）*20%作为申请资格</p>
            <el-form ref="form" :model="applyNewProjectForm" label-width="80px" size="mini">
                <el-form-item label="项目名称">
                    <el-input v-model="applyNewProjectForm.projectName" disabled=true></el-input>
                </el-form-item>
                <el-form-item label="预期价格">
                    <el-input-number v-model="applyNewProjectForm.price" :precision="2" :step="0.01"
                                     :max="50"></el-input-number>
                </el-form-item>
                <el-form-item label="预期数量">
                    <!--          <el-input v-model.number="applyNewProjectForm.count"></el-input>-->
                    <el-input-number v-model="applyNewProjectForm.count" @change="handleChange" :min="1" :max="10000"
                                     label=""></el-input-number>
                </el-form-item>
                <el-form-item label="卡类型">
                    <el-select v-model="applyNewProjectForm.cardOperator" placeholder="请选择">
                        <el-option label="不限" value="0"></el-option>
                        <el-option label="实卡" value="4"></el-option>
                        <el-option label="虚卡" value="5"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否首次">
                    <el-select v-model="applyNewProjectForm.first" placeholder="请选择">
                        <el-option label="不限" value="0"></el-option>
                        <el-option label="首次" value="1"></el-option>
                        <el-option label="非首次" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <!--        <el-form-item label="联系方式">-->
                <!--          <el-input v-model="applyNewProjectForm.contact"></el-input>-->
                <!--        </el-form-item>-->
                <el-form-item label="备注">
                    <el-input v-model="applyNewProjectForm.remark"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="applyNewProject" :loading="applyNewProjectButtonWait">立即申请
                    </el-button>
                    <el-button @click="()=>{this.dialogApplyVisible=false}">取消</el-button>
                </el-form-item>
            </el-form>
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
    import {bpSend} from "@/api/bp";
    import {applyProject} from "@/api/apply";
    import {applyProjectNotChannel} from "../../../../api/apply";

    export default {
        name: "getCode",
        components: {RechargeDialog, GetCodeTask},
        data() {
            return {
                keyWord: "",
                projectSearchLoading: false,
                projectInputLoading: false,
                activeNames: [],
                getPhoneForm: {
                    projectName: '暂未选择渠道，请搜索关键字获取渠道，不知道啥关键字的，先用自己手机接一条看看',
                    operator: '0',
                    phone_num: '',
                    scope: '',
                    scope_black: '',
                    code: '',
                    projectId: 0,
                    address: '',
                    channelId: '',
                },
                // projectSearchOptions: [],
                wallet: "0.00",
                editDialog: false,
                // remoteSearchQuery: '',

                dialogTableVisible: false,
                dialogProjectVisible: false,
                dialogApplyVisible: false,
                dialogApplyProjectVisible: false,
                projectListData: [],
                projectList: [],
                channelIdList: [],
                loading: true,
                notice: "",
                noticeBoolen: false,

                taskRole: {
                    hasNext: true,
                    nextLevel: 0,
                    nextTaskMoney: 0,
                    nextUserCanTaskNum: 0,
                    userCanTaskNum: 0
                },

                taskList: [false, false, false, false],

                taskData: {
                    id: 0,
                    leftSeconds: 300,
                    phoneNo: "",
                    projectId: "",
                    projectName: "",
                    projectCode: "",
                    projectContent: "",
                    userMoney: "",
                    status: "",
                    channelId: "",
                    refreshTime: 5000
                },

                taskDataList: [null, null, null, null],

                applyNewProjectForm: {
                    projectName: "",
                    projectId: "",
                    cardOperator: "",
                    count: "",
                    price: 1.00,
                    first: null,
                    isApi: 0,
                    contact: "",
                    remark: "",
                    supplier: "",
                },
                applyNewProjectNotChannelForm: {
                    content: "",
                },

                applyProjectButtonWait: false,
                applyNewProjectButtonWait: false,


            }
        },
        computed: {},


        created() {
            bpSend.request({
                "action_code": "000001",
                "action_name": "打开/刷新页面"
            })

            this.handleGetWallet()
            getLastOne.request({}).then(resp => {
                if (resp.msg === null || resp.msg === "" || resp.msg.trim() === "关闭") {
                    this.noticeBoolen = false
                } else {
                    this.notice = "公告：" + resp.msg
                    this.noticeBoolen = true
                }

            })

            //初始化任务内容
            getTask.request({}).then(
                resp => {
                    // console.log(resp.data)
                    if (resp.data.length <= 0) {
                        console.log("null data")
                    } else {
                        for (let i = 0; i < resp.data.length; i++) {
                            let taskData = {
                                projectId: resp.data[i].bizSmsProjectDetailInfo.projectId,
                                phone: resp.data[i].phoneNo,
                                lastMsgTime: resp.data.lastMsgTime,
                                projectCode: resp.data[i].bizSmsProjectDetailInfo.code,
                                code: "",
                                codeContent: "",
                                channelId: resp.data[i].bizSmsProjectDetailInfo.channelId,
                                phoneId: resp.data.phoneId,
                                taskStatus: "获取中",
                                taskId: resp.data[i].id,
                                refreshTime: 5000,
                                leftSeconds: resp.data[i].leftSeconds,
                                countDownTime: resp.data[i].leftSeconds,
                            }
                            if (resp.data[i].refreshTime != null || resp.data[i].refreshTime !== "") {
                                taskData.refreshTime = resp.data[i].refreshTime
                            }
                            this.$refs.getCodeTaskRef.smsTaskData.push(taskData)
                            this.$refs.getCodeTaskRef.startGetCode(taskData)
                        }
                    }
                    // console.log(this.taskDataList)


                }
            )

            //获取用户任务池子上限
            getTaskRole.request({}).then(
                resp => {
                    this.taskRole = resp.data;
                    for (let i = 0; i < resp.data.userCanTaskNum; i++) {
                        this.$set(this.taskList, i, true);
                        // this.taskList[i] = true 非响应式
                    }
                }
            )


        },

        methods: {
            //搜索项目
            loadProjectList() {
                bpSend.request({
                    "action_code": "000002",
                    "action_name": "搜索项目" + this.keyWord
                })
                this.projectInputLoading = true
                this.projectSearchLoading = true
                searchProject
                    .request({"search": this.keyWord})
                    .then(resp => {
                        if (resp.data !== null) {
                            this.dialogProjectVisible = true
                            this.loading = false
                            this.projectList = resp.data.list
                        }
                    }).finally(
                    () => {
                        this.projectInputLoading = false
                        this.projectSearchLoading = false
                        this.loading = false
                    }
                )

            },

            //查看渠道
            handleGetProjectEnterSearch() {
                bpSend.request({
                    "action_code": "000002",
                    "action_name": "查看渠道"
                })
                this.projectInputLoading = true
                this.projectSearchLoading = true
                // this.applyNewProjectForm.projectName = row.name;
                // this.applyNewProjectForm.projectId = row.id;
                // this.applyNewProjectForm.supplier = row.supplier
                const channelIdList = [{
                    "supplier": 1,
                    "projectName": this.keyWord
                }]
                search
                    .request({"keyword": this.keyWord, "channelIdList": channelIdList})
                    .then(resp => {
                        this.loading = false
                        this.projectListData = resp.data.list
                        this.dialogTableVisible = true
                    })
                    .finally(() => this.projectInputLoading = false,
                        this.projectSearchLoading = false,
                        this.loading = true
                    )
            },

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
            error() {
                elError("请先选择项目");
            },
            handleSupplier() {
                this.editDialog = true
            },

            handleProjectSelect(row) {
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
                    this.getPhoneForm.channelId = resp.data.channelId
                    this.getPhoneForm.projectId = resp.data.id
                    this.dialogTableVisible = false
                    this.getPhoneForm.code = row.code
                    this.getPhoneForm.projectName = row.projectName + "（金币：" + row.userMoney + ")" + "（可用：" + row.content + "）" + "projectId: " + this.getPhoneForm.code
                    this.dialogProjectVisible = false

                    bpSend.request({
                        "action_code": "000020",
                        "action_name": "选择渠道：" + this.getPhoneForm.projectName
                    })

                })


            },

            //申请新渠道
            applyNewProject() {
                this.applyNewProjectButtonWait = true
                applyProject.request(this.applyNewProjectForm).then(
                    resp => {
                        if (resp.msg === "操作成功") {
                            elSuccess("申请成功，请耐心等待处理");
                            this.dialogApplyVisible = false
                        } else {
                            elError("申请失败");
                        }
                    }
                ).finally(() => {
                    this.applyNewProjectButtonWait = false
                })
            },

            applyNewProjectNotChannel() {
                this.applyProjectButtonWait = true
                applyProjectNotChannel.request(this.applyNewProjectNotChannelForm).then(
                    resp => {
                        if (resp.msg === "操作成功") {
                            elSuccess("申请成功，请耐心等待处理");
                            this.dialogApplyProjectVisible = false
                        } else {
                            elError("申请失败");
                        }
                    }
                ).finally(() => {
                    this.applyProjectButtonWait = false
                })
            },

            copy() {
                elSuccess("复制成功")
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

    .el-alert__title {
        font-size: 20px;
        line-height: 18px;
    }
</style>
