<script>
import NotifyBell from '../NotifyBell'
import QuestionReport from "../QuestionReport";
import ApiDoc from "../ApiDoc"

export default {
    name: "HeaderRight",

    functional: true,

    props: {default: Array},

    render(h, context) {
        const custom = [
            <ApiDoc class="header-item"/>,
            // <el-link class="header-item" type="warning" href="https://ptcc.in/ymsms" target="_blank">加入土豆群</el-link>,
            <QuestionReport class="header-item"></QuestionReport>,
            <NotifyBell class="header-item"/>,
            // <div
            //     class="setting-btn header-item"
            //     title="个性设置"
            //     on-click={context.parent.openSettingDrawer}
            // >
            //     <i class="el-icon-s-operation header-icon"/>
            // </div>
        ]
        return custom.concat(context.props.default)
    }
}
</script>
