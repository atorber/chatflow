<!-- qq表情 -->
<template>
    <div class="common_chat_emoji-wrapper common_chat_emoji-wrapper-global">
        <div  @click="toggleFaceHidden">
            <i class="iconfont fa fa-smile-o float-left"></i>
        </div>
        <div class="list-wrapper" v-show="!faceHidden">
            <div class="list-inner" @click="selectFace">
                <a v-for="(item, index)  in qqemojiList" :key="index" class="item qqemoji" :title="item" :text="[item]" :class="'qqemoji'+index"></a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            qqemojiList: ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '愉快', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '悠闲', '奋斗', '咒骂', '疑问', '嘘', '晕', '疯了', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '嘴唇', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '投降', '激动', '乱舞', '献吻', '左太极', '右太极'],
            faceHidden: true
        };
    },
    methods: {
        /**
         * 切换表情界面的显示
         */
        toggleFaceHidden: function() {
            this.$data.faceHidden = !this.$data.faceHidden;
        },

        /**
         * 关闭表情窗口
         */
        hideFaceWrapper: function() {
            var self = this;
            // 选中face也会隐藏表情窗口，这时判断是否已经隐藏了
            setTimeout(function() {
                if (!self.$data.faceHidden) {
                    self.$data.faceHidden = true;
                }
            }, 200);
        },

        /**
         * 选中face
         */
        selectFace: function(e) {
            var faceName = e.target.getAttribute('text');
            if (!faceName) {
                return;
            }
            var imgStr = this.getImgByFaceName(faceName);
            this.$emit('select', {
                faceName: faceName,
                imgStr: imgStr
            }); // 事件上传

            // 关闭窗口
            this.$data.faceHidden = true;
        },
        /**
         * 根据face名称返回一个img图片
         * @param {String} faceName face名称
         */
        getImgByFaceName: function(faceName) {
            var imgStr = '<img class="qqemoji small qqemoji@faceIndex" text="@faceName" src="/static/image/im_emoji_spacer.gif"/>';
            var faceIndex = 0;
            for (var i = 0; i < this.$data.qqemojiList.length; i++) {
                if (this.$data.qqemojiList[i] == faceName) {
                    faceIndex = i;
                    break;
                }
            }
            imgStr = imgStr.replace(/@faceIndex/g, faceIndex).replace(/@faceName/g, faceName);
            return imgStr;
        }
    },
    mounted() {}
};
</script>

<style lang="less">
.common_chat_emoji-wrapper {
    .iconfont {
        color: #aaa;
        font-size: 20px;
    }
    .list-wrapper {
        height: 210px;
        width: 440px;
        background-color: #fff;
        border: 1px solid #e6e6e6;
        padding: 10px;
        position: absolute;
        top: -240px;
        left: 1px;
        .list-inner {
            width: 100%;
            height: 100%;
            overflow: hidden;
            .item {
                float: left;
                border-bottom: 1px solid #e6e6e6;
                border-right: 1px solid #e6e6e6;
                cursor: pointer;
            }
        }
    }
}

.common_chat_emoji-wrapper-global {
    .qqemoji {
        width: 28px;
        height: 28px;
        font-size: 0;
        text-indent: -999em;
        background: url('../../assets/qqEmoji.png') 0 0 no-repeat;
    }

    .qqemoji.small {
        vertical-align: middle;
        height: 24px !important;
        width: 24px;
        transform: scale(0.82);
        margin-top: -5px;
        margin-left: -3px;
    }

    .qqemoji.qqemoji0 {
        background-position: 0 0;
    }

    .qqemoji.qqemoji1 {
        background-position: -29px 0;
    }

    .qqemoji.qqemoji2 {
        background-position: -58px 0;
    }

    .qqemoji.qqemoji3 {
        background-position: -87px 0;
    }

    .qqemoji.qqemoji4 {
        background-position: -116px 0;
    }

    .qqemoji.qqemoji5 {
        background-position: -145px 0;
    }

    .qqemoji.qqemoji6 {
        background-position: -174px 0;
    }

    .qqemoji.qqemoji7 {
        background-position: -203px 0;
    }

    .qqemoji.qqemoji8 {
        background-position: -232px 0;
    }

    .qqemoji.qqemoji9 {
        background-position: -261px 0;
    }

    .qqemoji.qqemoji10 {
        background-position: -290px 0;
    }

    .qqemoji.qqemoji11 {
        background-position: -319px 0;
    }

    .qqemoji.qqemoji12 {
        background-position: -348px 0;
    }

    .qqemoji.qqemoji13 {
        background-position: -377px 0;
    }

    .qqemoji.qqemoji14 {
        background-position: -406px 0;
    }

    .qqemoji.qqemoji15 {
        background-position: 0 -29px;
    }

    .qqemoji.qqemoji16 {
        background-position: -29px -29px;
    }

    .qqemoji.qqemoji17 {
        background-position: -58px -29px;
    }

    .qqemoji.qqemoji18 {
        background-position: -87px -29px;
    }

    .qqemoji.qqemoji19 {
        background-position: -116px -29px;
    }

    .qqemoji.qqemoji20 {
        background-position: -145px -29px;
    }

    .qqemoji.qqemoji21 {
        background-position: -174px -29px;
    }

    .qqemoji.qqemoji22 {
        background-position: -203px -29px;
    }

    .qqemoji.qqemoji23 {
        background-position: -232px -29px;
    }

    .qqemoji.qqemoji24 {
        background-position: -261px -29px;
    }

    .qqemoji.qqemoji25 {
        background-position: -290px -29px;
    }

    .qqemoji.qqemoji26 {
        background-position: -319px -29px;
    }

    .qqemoji.qqemoji27 {
        background-position: -348px -29px;
    }

    .qqemoji.qqemoji28 {
        background-position: -377px -29px;
    }

    .qqemoji.qqemoji29 {
        background-position: -406px -29px;
    }

    .qqemoji.qqemoji30 {
        background-position: 0 -58px;
    }

    .qqemoji.qqemoji31 {
        background-position: -29px -58px;
    }

    .qqemoji.qqemoji32 {
        background-position: -58px -58px;
    }

    .qqemoji.qqemoji33 {
        background-position: -87px -58px;
    }

    .qqemoji.qqemoji34 {
        background-position: -116px -58px;
    }

    .qqemoji.qqemoji35 {
        background-position: -145px -58px;
    }

    .qqemoji.qqemoji36 {
        background-position: -174px -58px;
    }

    .qqemoji.qqemoji37 {
        background-position: -203px -58px;
    }

    .qqemoji.qqemoji38 {
        background-position: -232px -58px;
    }

    .qqemoji.qqemoji39 {
        background-position: -261px -58px;
    }

    .qqemoji.qqemoji40 {
        background-position: -290px -58px;
    }

    .qqemoji.qqemoji41 {
        background-position: -319px -58px;
    }

    .qqemoji.qqemoji42 {
        background-position: -348px -58px;
    }

    .qqemoji.qqemoji43 {
        background-position: -377px -58px;
    }

    .qqemoji.qqemoji44 {
        background-position: -406px -58px;
    }

    .qqemoji.qqemoji45 {
        background-position: 0 -87px;
    }

    .qqemoji.qqemoji46 {
        background-position: -29px -87px;
    }

    .qqemoji.qqemoji47 {
        background-position: -58px -87px;
    }

    .qqemoji.qqemoji48 {
        background-position: -87px -87px;
    }

    .qqemoji.qqemoji49 {
        background-position: -116px -87px;
    }

    .qqemoji.qqemoji50 {
        background-position: -145px -87px;
    }

    .qqemoji.qqemoji51 {
        background-position: -174px -87px;
    }

    .qqemoji.qqemoji52 {
        background-position: -203px -87px;
    }

    .qqemoji.qqemoji53 {
        background-position: -232px -87px;
    }

    .qqemoji.qqemoji54 {
        background-position: -261px -87px;
    }

    .qqemoji.qqemoji55 {
        background-position: -290px -87px;
    }

    .qqemoji.qqemoji56 {
        background-position: -319px -87px;
    }

    .qqemoji.qqemoji57 {
        background-position: -348px -87px;
    }

    .qqemoji.qqemoji58 {
        background-position: -377px -87px;
    }

    .qqemoji.qqemoji59 {
        background-position: -406px -87px;
    }

    .qqemoji.qqemoji60 {
        background-position: 0 -116px;
    }

    .qqemoji.qqemoji61 {
        background-position: -29px -116px;
    }

    .qqemoji.qqemoji62 {
        background-position: -58px -116px;
    }

    .qqemoji.qqemoji63 {
        background-position: -87px -116px;
    }

    .qqemoji.qqemoji64 {
        background-position: -116px -116px;
    }

    .qqemoji.qqemoji65 {
        background-position: -145px -116px;
    }

    .qqemoji.qqemoji66 {
        background-position: -174px -116px;
    }

    .qqemoji.qqemoji67 {
        background-position: -203px -116px;
    }

    .qqemoji.qqemoji68 {
        background-position: -232px -116px;
    }

    .qqemoji.qqemoji69 {
        background-position: -261px -116px;
    }

    .qqemoji.qqemoji70 {
        background-position: -290px -116px;
    }

    .qqemoji.qqemoji71 {
        background-position: -319px -116px;
    }

    .qqemoji.qqemoji72 {
        background-position: -348px -116px;
    }

    .qqemoji.qqemoji73 {
        background-position: -377px -116px;
    }

    .qqemoji.qqemoji74 {
        background-position: -406px -116px;
    }

    .qqemoji.qqemoji75 {
        background-position: 0 -145px;
    }

    .qqemoji.qqemoji76 {
        background-position: -29px -145px;
    }

    .qqemoji.qqemoji77 {
        background-position: -58px -145px;
    }

    .qqemoji.qqemoji78 {
        background-position: -87px -145px;
    }

    .qqemoji.qqemoji79 {
        background-position: -116px -145px;
    }

    .qqemoji.qqemoji80 {
        background-position: -145px -145px;
    }

    .qqemoji.qqemoji81 {
        background-position: -174px -145px;
    }

    .qqemoji.qqemoji82 {
        background-position: -203px -145px;
    }

    .qqemoji.qqemoji83 {
        background-position: -232px -145px;
    }

    .qqemoji.qqemoji84 {
        background-position: -261px -145px;
    }

    .qqemoji.qqemoji85 {
        background-position: -290px -145px;
    }

    .qqemoji.qqemoji86 {
        background-position: -319px -145px;
    }

    .qqemoji.qqemoji87 {
        background-position: -348px -145px;
    }

    .qqemoji.qqemoji88 {
        background-position: -377px -145px;
    }

    .qqemoji.qqemoji89 {
        background-position: -406px -145px;
    }

    .qqemoji.qqemoji90 {
        background-position: 0 -174px;
    }

    .qqemoji.qqemoji91 {
        background-position: -29px -174px;
    }

    .qqemoji.qqemoji92 {
        background-position: -58px -174px;
    }

    .qqemoji.qqemoji93 {
        background-position: -87px -174px;
    }

    .qqemoji.qqemoji94 {
        background-position: -116px -174px;
    }

    .qqemoji.qqemoji95 {
        background-position: -145px -174px;
    }

    .qqemoji.qqemoji96 {
        background-position: -174px -174px;
    }

    .qqemoji.qqemoji97 {
        background-position: -203px -174px;
    }

    .qqemoji.qqemoji98 {
        background-position: -232px -174px;
    }

    .qqemoji.qqemoji99 {
        background-position: -261px -174px;
    }

    .qqemoji.qqemoji100 {
        background-position: -290px -174px;
    }

    .qqemoji.qqemoji101 {
        background-position: -319px -174px;
    }

    .qqemoji.qqemoji102 {
        background-position: -348px -174px;
    }

    .qqemoji.qqemoji103 {
        background-position: -377px -174px;
    }

    .qqemoji.qqemoji104 {
        background-position: -406px -174px;
    }
}
</style>
