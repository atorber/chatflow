<!-- im服务端入口 -->
<template>
    <div class="imServer-wrapper">
        <main class="imServer-main">
            <im-record class="item im-record" @selectedChat="selectedChat()"></im-record>
            <!-- 聊天记录 -->
            <im-chat v-if="storeSelectedChatEn != null" ref="im_chat" class="item im-chat"></im-chat>
            <!-- 信息区域 -->
            <div class="item imClientInfo-wrapper">
                <!-- <article class="imClientInfo-notice-wrapper">
                    <header class="imClientInfo-item-header">
                        公告
                    </header>
                    <main class="imClientInfo-notice-main">
                        <p class="link">github：
                            <a href="https://github.com/choogoo/wechat-openai-qa-bot"
                                target="_blank">choogoo/wechat-openai-qa-bot</a>
                        </p>
                        <p class="link">blog：
                            <a href="https://www.cnblogs.com/polk6/p/vue-im.html"
                                target="_blank">cnblogs.com/polk6/p/vue-im.html</a>
                        </p>
                    </main>
                </article> -->
                <!-- 常见问题 -->
                <article class="imClientInfo-faq-wrapper">
                    <header class="imClientInfo-item-header">
                        快捷回答
                    </header>
                    <main class="imClientInfo-faq-main">
                        <el-collapse v-model="faqSelected" accordion>
                            <el-collapse-item v-for="(faqItem, index) in faqList" :key="index" :name="index"
                                :title="faqItem.title">
                                <div v-for="(item, i) in faqItem.content" :key="i" :name="i" v-html="item"
                                    @click="sendMsg(item)">
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </main>
                </article>
            </div>
        </main>
    </div>
</template>

<script >
import imRecord from './imRecord.vue';
import imChat from './imChat.vue';
import faqList from './faqList.js'

export default {
    components: {
        imRecord: imRecord,
        imChat: imChat
    },
    data() {
        return {
            socket: null,
            faqList: faqList,
        };
    },
    computed: {
        storeSelectedChatEn() {
            return this.$store.imServerStore.getters.selectedChatEn;
        }
    },
    watch: {},
    methods: {
        /**
         * 选中了会话
         */
        selectedChat: function () { },
        /**
         * 发送消息，e.g. 文本、图片、文件
         * @param {Object} msg 消息对象
         */
        sendMsg: function (text) {
            console.debug(text)
            document.getElementById('common_chat_input').innerHTML = text;
            this.$store.imServerStore.getters.selectedChatEn.inputContent = text
        },
    },
    mounted() {
        this.$store.imServerStore.dispatch('SERVER_ON');
    },
    destroyed() {
        this.$store.imServerStore.dispatch('SERVER_OFF');
    }
};
</script>

<style lang="less">
@import '../../common/css/base.less';

.imServer-wrapper {
    #common-wrapper();
}

.imServer-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    overflow: hidden;

    .imServer-main {
        height: 100%;
        max-width: 100%;
        position: relative;

        &>.item {
            float: left;
            border-left: 1px solid #e6e6e6;
            height: 100%;
        }

        &>.im-record {
            width: 280px;
        }

        &>.im-chat {
            width: calc(~'75% - 280px');
        }

        &>.imClientInfo-wrapper {
            width: calc(~'24%');
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

            &>.link {
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
</style>
