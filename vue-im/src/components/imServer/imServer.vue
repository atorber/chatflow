<!-- im服务端入口 -->
<template>
    <div class="imServer-wrapper">
        <main class="imServer-main">
            <im-record class="item im-record" @selectedChat="selectedChat()"></im-record>
            <im-chat v-if="storeSelectedChatEn!=null" ref="im_chat" class="item im-chat"></im-chat>
        </main>
    </div>
</template>

<script >
import imRecord from './imRecord.vue';
import imChat from './imChat.vue';

export default {
    components: {
        imRecord: imRecord,
        imChat: imChat
    },
    data() {
        return {
            socket: null
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
        selectedChat: function() {}
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
        & > .item {
            float: left;
            border-right: 1px solid #e6e6e6;
            height: 100%;
        }
        & > .im-record {
            width: 280px;
        }
        & > .im-chat {
            width: calc(~'99% - 280px');
        }
    }
}
</style>
