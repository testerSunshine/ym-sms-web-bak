/*路由表：消息中心*/

const router = {
    path: 'message',
    meta: {title: '验证码管理', icon: 'svg-message'},
    children: [
        {
            path: 'getCode',
            name: 'getCodeManagement',
            component: 'admin/message/getCode/',
            meta: {title: '短信接码', noCache: true}
        },
        {
            path: 'codeHistory',
            name: 'codeHistoryMessage',
            component: 'admin/message/codeHistory/',
            meta: {title: '接码记录', noCache: true}
        },
        {
            path: 'publicJoin',
            name: 'publicJoinManagement',
            component: 'admin/message/publicJoin/',
            meta: {title: '公开接码列表', noCache: true}
        },
        {
            path: 'smsCollect',
            name: 'smsCollectManagements',
            component: 'admin/message/smsCollect/',
            meta: {title: '我的对接项目', noCache: true}
        }
    ]
}

export default router
