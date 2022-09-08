<script>
import NotifyBell from '../NotifyBell'
import QuestionReport from "../QuestionReport";

export default {
    name: "HeaderRight",

    functional: true,

    props: {default: Array},

    render(h, context) {
        const custom = [
            <QuestionReport class="header-item"></QuestionReport>,
            <NotifyBell class="header-item"/>,
            <div
                class="setting-btn header-item"
                title="个性设置"
                on-click={context.parent.openSettingDrawer}
            >
                <i class="el-icon-s-operation header-icon"/>
            </div>
        ]
        return custom.concat(context.props.default)
    }
}
</script>
