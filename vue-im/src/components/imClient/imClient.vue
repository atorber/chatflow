<!-- im客户端 入口 -->
<template>
    <div class="imClient-wrapper">
        <div class="imClient-inner">
            <header class="imClient-header">
                <div class="name-wrapper position-v-mid">
                    <span v-if="chatInfoEn.chatState == 'robot'">Vue在线客服-访客端</span>
                    <span v-else-if="chatInfoEn.chatState == 'agent'">您正在与客服{{serverChatEn.serverChatName}}对话</span>
                </div>
                <div class="opr-wrapper position-v-mid">
                    <el-tooltip content="评分" placement="bottom" effect="light">
                        <i class="fa fa-star-half-full" @click="showRateDialog()"></i>
                    </el-tooltip>
                    <el-tooltip content="留言" placement="bottom" effect="light">
                        <i class="fa fa-envelope-o" @click="showLeaveDialog()"></i>
                    </el-tooltip>
                    <el-tooltip content="结束会话" placement="bottom" effect="light">
                        <i class="fa fa-close" @click="closeChat()"></i>
                    </el-tooltip>
                </div>
            </header>
            <main class="imClient-main">
                <!-- 聊天框 -->
                <div class="item imClientChat-wrapper">
                    <!-- 聊天记录 -->
                    <common-chat ref="common_chat" :chatInfoEn="chatInfoEn" :oprRoleName=" 'client'" @sendMsg="sendMsg" @chatCallback="chatCallback"></common-chat>
                </div>
                <!-- 信息区域 -->
                <div class="item imClientInfo-wrapper">
                    <article class="imClientInfo-notice-wrapper">
                        <header class="imClientInfo-item-header">
                            公告
                        </header>
                        <main class="imClientInfo-notice-main">
                            <p class="link">github：
                                <a href="https://github.com/polk6/vue-im" target="_blank">github.com/polk6/vue-im</a>
                            </p>
                            <p class="link">blog：
                                <a href="https://www.cnblogs.com/polk6/p/vue-im.html" target="_blank">cnblogs.com/polk6/p/vue-im.html</a>
                            </p>
                        </main>
                    </article>
                    <!-- 常见问题 -->
                    <article class="imClientInfo-faq-wrapper">
                        <header class="imClientInfo-item-header">
                            常见问题
                        </header>
                        <main class="imClientInfo-faq-main">
                            <el-collapse v-model="faqSelected" accordion>
                                <el-collapse-item v-for="(faqItem, index) in faqList" :key="index" :name="index" :title="faqItem.title">
                                    <div v-html="faqItem.content"></div>
                                </el-collapse-item>
                            </el-collapse>
                        </main>
                    </article>
                </div>
            </main>
        </div>
        <!-- 转接客服dialog -->
        <el-dialog title="请选择客服" :visible.sync="transferDialogVisible" :close-on-press-escape="false">
            <im-transfer ref="im_transfer" @submit="transferDialog_submit"></im-transfer>
        </el-dialog>
        <!-- 满意度dialog -->
        <el-dialog :visible.sync="rateDialogVisible" :close-on-press-escape="false">
            <im-rate ref="im_rate"></im-rate>
        </el-dialog>
        <!-- 离线留言dialog -->
        <el-dialog :visible.sync="leaveDialogVisible" :close-on-press-escape="false">
            <im-leave ref="im_leave"></im-leave>
        </el-dialog>
        <!-- 结束会话dialog -->
        <el-dialog :visible.sync="logoutDialogVisible" :close-on-press-escape="false">
            <p class="title">结束本次会话？</p>
            <div class="footer">
                <el-button type="primary" @click="logoutDialog_cancel">取消</el-button>
                <el-button type="primary" @click="logoutDialog_submit">结束会话</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script >
import commonChat from '@/components/common/common_chat.vue';
import imRate from './imRate.vue';
import imLeave from './imLeave.vue';
import imTransfer from './imTransfer.vue';

export default {
    components: {
        commonChat: commonChat,
        imRate: imRate,
        imLeave: imLeave,
        imTransfer: imTransfer
    },
    data() {
        return {
            socket: null,
            chatInfoEn: {
                chatState: 'robot', // chat状态；robot 机器人、agent 客服
                inputContent: '', // 输入框内容
                msgList: [], // 消息列表
                state: 'on', // 连接状态;on ：在线；off：离线
                lastMsgShowTime: null // 最后一个消息的显示时间
            }, // 会话信息，包括聊天记录、状态
            clientChatEn: {
                clientChatId: '',
                clientChatName: '',
                avatarUrl: 'static/image/im_client_avatar.png'
            }, // 当前账号的信息
            serverChatEn: {
                serverChatName: '',
                avatarUrl: ''
            }, // 服务端chat信息
            robotEn: {
                robotName: '小旺',
                avatarUrl: 'static/image/im_robot_avatar.png'
            }, // 机器人信息
            faqList: [
                { title: '今天周几', content: '今天周一' },
                { title: '今天周几', content: '今天周二' },
                { title: '今天周几', content: '今天周三' },
                { title: '今天周几', content: '今天周四' },
                { title: '今天周几', content: '今天周五' }
            ],
            faqSelected: '-1',
            inputContent_setTimeout: null, // 输入文字时在输入结束才修改具体内容
            selectionRange: null, // 输入框选中的区域
            shortcutMsgList: [], // 聊天区域的快捷回复列表
            logoutDialogVisible: false, // 结束会话显示
            transferDialogVisible: false, // 转接人工dialog
            rateDialogVisible: false, // 评价dialog
            leaveDialogVisible: false // 留言dialog
        };
    },
    computed: {},
    watch: {},
    methods: {
        /**
         * 注册账号信息
         */
        regClientChatEn: function() {
            this.$data.clientChatEn.clientChatId = Number.parseInt(Date.now() + Math.random());
            // 名称格式：姓+6位数字
            var userName = '';
            switch (this.$data.clientChatEn.clientChatId % 5) {
                case 0:
                    userName = '张';
                    break;
                case 1:
                    userName = '李';
                    break;
                case 2:
                    userName = '王';
                    break;
                case 3:
                    userName = '赵';
                    break;
                case 4:
                    userName = '孙';
                    break;
            }
            var tmpId = this.$data.clientChatEn.clientChatId.toString();
            userName += tmpId.substr(tmpId.length - 6, 6);
            this.$data.clientChatEn.clientChatName = userName;

            // 模拟消息
            this.addChatMsg({
                role: 'robot',
                avatarUrl: this.$data.robotEn.avatarUrl,
                contentType: 'transformServer'
            });
        },

        /**
         * 注册socket
         * @param {String} serverChatId 服务端chatId
         */
        regSocket: function(serverChatId) {
            this.$data.socket = require('socket.io-client')('http://localhost:3001');
            this.$data.socket.on('connect', () => {
                // 客户端上线
                this.$data.socket.emit('CLIENT_ON', {
                    clientChatEn: this.$data.clientChatEn,
                    serverChatId: serverChatId
                });

                // 服务端链接
                this.$data.socket.on('SERVER_CONNECTED', (data) => {
                    // 1)获取客服消息
                    this.$data.serverChatEn = data.serverChatEn;

                    // 2)添加消息
                    this.addChatMsg({
                        role: 'sys',
                        contentType: 'text',
                        content: '客服 ' + data.serverChatEn.serverChatName + ' 为你服务'
                    });
                });

                // 接受服务端信息
                this.$data.socket.on('SERVER_SEND_MSG', (data) => {
                    data.msg.avatarUrl = this.$data.serverChatEn.avatarUrl;
                    this.addChatMsg(data.msg, () => {
                        this.$refs.common_chat.goEnd();
                    });
                });

                // 离开
                window.addEventListener('beforeunload', () => {
                    this.closeChat();
                });
            });
        },

        /**
         * 结束会话
         */
        closeChat: function() {
            if (this.$data.chatInfoEn.chatState == 'agent') {
                this.$data.socket.emit('CLIENT_OFF', {
                    clientChatEn: this.$data.clientChatEn,
                    serverChatId: this.$data.serverChatEn.serverChatId
                });
                this.$data.socket.close();
                this.$data.chatInfoEn.state = 'off';
            }
        },

        /**
         * 添加chat对象的msg
         * @param {Object} msg 消息对象；eg：{role:'sys',content:'含有新的消息'}
         * @param {String} msg.role 消息所有者身份；eg：'sys'系统消息；
         * @param {String} msg.contentType 消息类型；text:文本(默认)；image:图片
         * @param {String} msg.content 消息内容
         * @param {Function} successCallback 添加消息后的回调
         */
        addChatMsg: function(msg, successCallback) {
            // 1.设定默认值
            msg.role = msg.role == undefined ? 'sys' : msg.role;
            msg.contentType = msg.contentType == undefined ? 'text' : msg.contentType;
            msg.createTime = msg.createTime == undefined ? new Date() : msg.createTime;

            var msgList = this.$data.chatInfoEn.msgList ? this.$data.chatInfoEn.msgList : [];

            // 2.插入消息
            // 1)插入日期
            // 实际场景中，在消息上方是否显示时间是由后台传递给前台的消息中附加上的，可参考 微信Web版
            // 此处进行手动设置，5分钟之内的消息，只显示一次消息
            msg.createTime = new Date(msg.createTime);
            if (this.$data.chatInfoEn.lastMsgShowTime == null || msg.createTime.getTime() - this.$data.chatInfoEn.lastMsgShowTime.getTime() > 1000 * 60 * 5) {
                msgList.push({
                    role: 'sys',
                    contentType: 'text',
                    content: this.$ak.Utils.getDateTimeStr(msg.createTime, 'Y-m-d H:i:s')
                });
                this.$data.chatInfoEn.lastMsgShowTime = msg.createTime;
            }

            // 2)插入消息
            msgList.push(msg);

            // 3.设置chat对象相关属性
            this.$data.chatInfoEn.msgList = msgList;

            // 4.回调
            successCallback && successCallback();
        },

        /**
         * 发送消息
         * @param {Object} rs 回调对象
         */
        sendMsg: function(rs) {
            var msg = rs.msg;
            msg.role = 'client';
            msg.avatarUrl = this.$data.clientChatEn.avatarUrl;
            if (this.$data.chatInfoEn.chatState == 'robot') {
                // 机器人发送接口
            } else if (this.$data.chatInfoEn.chatState == 'agent') {
                // 客服接口
                this.$data.socket.emit('CLIENT_SEND_MSG', {
                    serverChatId: this.$data.serverChatEn.serverChatId,
                    clientChatEn: this.$data.clientChatEn,
                    msg: msg
                });
            }
            // 2.添加到消息集合李
            var self = this;
            this.addChatMsg(msg, function() {
                self.goEnd();
            });
        },

        /**
         * 显示转接客服Dialog
         */
        transferDialog_show: function() {
            this.$data.transferDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.im_transfer.init();
            });
        },

        /**
         * 转接客服dialog_提交
         */
        transferDialog_submit: function(rs) {
            this.$data.transferDialogVisible = false;
            this.$data.chatInfoEn.chatState = 'agent';
            this.regSocket(rs.serverChatId);
            console.log(rs.serverChatId);
        },

        /**
         * 注销dialog_提交
         */
        logoutDialog_submit: function() {
            this.$data.logoutDialogVisible = false;
            this.addChatMsg({
                role: 'sys',
                content: '本次会话已结束'
            });
        },

        /**
         * 注销dialog_取消
         */
        logoutDialog_cancel: function() {
            this.$data.logoutDialogVisible = false;
        },

        /**
         * 聊天记录滚动到底部
         */
        goEnd: function() {
            this.$refs.common_chat.goEnd();
        },

        /**
         * chat回调
         */
        chatCallback: function(rs) {
            if (rs.eventType == 'transformServer') {
                this.transferDialog_show();
            }
        },
        /**
         * 显示评分dialog
         */
        showRateDialog: function() {
            this.$data.rateDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.im_rate.init();
            });
        },
        /**
         * 显示留言dialog
         */
        showLeaveDialog: function() {
            this.$data.leaveDialogVisible = true;
            this.$nextTick(() => {
                this.$refs.im_leave.init();
            });
        }
    },
    mounted() {
        this.regClientChatEn();
    }
};
</script>

<style lang="less">
@import '../../common/css/base.less';

.imClient-wrapper {
    #common-wrapper();
}

.imClient-inner {
    width: 850px;
    height: 100%;
    margin: 10px auto 0px;
    overflow: hidden;
    box-shadow: 0 1px 5px 2px #ccc;
    .imClient-header {
        position: relative;
        height: 35px;
        box-sizing: border-box;
        background: #1072b5;
        font-size: 13px;
        color: #ffffff;
        .name-wrapper {
            margin-left: 20px;
        }
        .logo {
            height: 45px;
            width: auto;
        }
        .opr-wrapper {
            right: 20px;
            font-size: 16px;
            cursor: pointer;
            .fa {
                margin-left: 10px;
            }
        }
    }
    .imClient-main {
        max-width: 100%;
        height: 520px;
        position: relative;
        & > .item {
            float: left;
            height: 100%;
            border-top-width: 0px;
            border-right-width: 0px;
            box-sizing: border-box;
            &:last-child {
                border-right-width: 1px;
            }
        }
        & > .imClientChat-wrapper {
            width: 550px;
            border-right: 1px solid #ccc;
        }
        & > .imClientInfo-wrapper {
            width: 300px;
        }
    }
}

// 信息区域
.imClientInfo-wrapper {
    width: 100%;
    height: 100%;
    background: #ffffff;
    .imClientInfo-notice-wrapper,
    .imClientInfo-faq-wrapper {
        .imClientInfo-item-header {
            font-weight: bolder;
            font-size: 16px;
            color: #1072b5;
            padding: 10px 15px 0;
        }
    }
    .imClientInfo-notice-wrapper {
        .imClientInfo-notice-main {
            padding: 0 15px;
            & > .link {
                margin: 10px 0;
                font-size: 12px;
                color: #000000;
            }
        }
    }
    .imClientInfo-faq-wrapper {
        height: 380px;
        border-top: 1px solid #ccc;
        .imClientInfo-faq-main {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            .el-collapse {
                border: 0px;
                .el-collapse-item__header {
                    position: relative;
                    padding: 0px 15px;
                    font-size: 12px;
                    background: transparent;
                    color: #000000;
                    &.is-active {
                        color: #f7455d;
                    }
                    .el-collapse-item__arrow {
                        position: absolute;
                        left: 267px;
                    }
                }
                .el-collapse-item__wrap {
                    background: transparent;
                    .el-collapse-item__content {
                        font-size: 12px;
                        color: #959699;
                        padding: 0px 15px 10px;
                    }
                }
            }
        }
    }
}

// element-UI
.el-dialog {
    width: 500px;
    background: #ffffff;
    color: #000000;
}
</style>
