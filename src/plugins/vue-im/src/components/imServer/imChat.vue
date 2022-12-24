<!-- 聊天记录 -->
<template>
    <div class="imChat-wrapper">
        <!-- 头部 -->
        <header class="imChat-header">
            <span class="name">{{storeSelectedChatEn.clientChatName}}</span>
            <span class="time">{{getAccessTimeStr(storeSelectedChatEn.accessTime)}}</span>
            <span v-show="storeSelectedChatEn.state=='on' " class="on-line">在线</span>
            <span v-show="storeSelectedChatEn.state=='off' " class="off-line ">离线</span>
        </header>
        <main class="imChat-main">
            <!-- 聊天框区域 -->
            <common-chat ref="common_chat" :chatInfoEn="storeSelectedChatEn" :oprRoleName="'server'" @sendMsg="sendMsg"></common-chat>
        </main>
    </div>
</template>

<script>
import commonChat from '@/components/common/common_chat.vue';

export default {
    components: {
        commonChat: commonChat
    },
    data() {
        return {};
    },
    computed: {
        storeSelectedChatEn() {
            return this.$store.imServerStore.getters.selectedChatEn;
        },
        storeHaveNewMsgDelegate() {
            return this.$store.imServerStore.getters.haveNewMsgDelegate;
        },
        storeServerChatEn() {
            return this.$store.imServerStore.getters.serverChatEn;
        }
    },
    watch: {
        storeSelectedChatEn(value) {
            this.$refs.common_chat.goEnd();
        },
        storeHaveNewMsgDelegate(value) {
            this.$refs.common_chat.goEnd();
        }
    },
    methods: {
        /**
         * 发送消息
         * @param {Object} rs 回调对象
         */
        sendMsg: function(rs) {
            var msg = rs.msg;
            msg.role = 'server';
            msg.avatarUrl = this.storeServerChatEn.avatarUrl;
            msg.clientChatId =  this.storeSelectedChatEn.clientChatId;
            // 1.socket发送消息
            this.$store.imServerStore.dispatch('sendMsg', {
                clientChatId: this.storeSelectedChatEn.clientChatId,
                msg: msg
            });

            // 2.附加到此chat对象的msg集合里
            this.$store.imServerStore.dispatch('addChatMsg', {
                clientChatId: this.storeSelectedChatEn.clientChatId,
                msg: msg,
                successCallback: function() {
                    rs.successCallbcak && rs.successCallbcak();
                }
            });
        },

        goEnd: function() {
            this.$refs.common_chat.goEnd();
        },

        /**
         * 获取chat的访问时间
         * @param {Date} accessTime 问时间
         */
        getAccessTimeStr: function(accessTime) {
            return this.$ak.Utils.getDateTimeStr(accessTime, 'Y-m-d H:i:s');
        }
    },
    mounted() {}
};
</script>
<style lang="less">
.imChat-wrapper {
    .imChat-header {
        display: flex;
        align-items: center;
        width: 100%;
        height: 50px;
        padding-left: 10px;
        border-bottom: 1px solid #e6e6e6;
        font-size: 16px;
        span {
            margin-right: 20px;
        }
        .on-line {
            color: #70ed3a;
        }
        .off-line {
            color: #bbbbbb;
        }
    }
    .imChat-main {
        height: calc(~'100% - 50px');
    }
}
</style>

