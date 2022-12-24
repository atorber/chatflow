<!-- 评价 -->
<template>
    <div class="imRate-wrapper">
        <div v-show="!resultVisible" class="main">
            <p class="title">
                感谢你的咨询，请对我们的服务进行评价
            </p>
            <el-row>
                <el-rate v-model="dataForm.score" show-text :texts="['非常不满意', '不满意', '一般', '满意', '非常满意']">
                </el-rate>
            </el-row>
            <el-row>
                <el-input type="textarea" :maxlength="50" :rows="4" resize="none" placeholder="备注(选填，50字符以内)" v-model="dataForm.remark"></el-input>
            </el-row>
            <el-button type="primary" class="submit-btn position-h-mid" @click="submit" :disabled="dataForm.score==null">确定</el-button>
        </div>
        <!-- 评价后的界面 -->
        <div v-show="resultVisible" class="submit-main">
            <i class="fa fa-check-circle-o"></i>
            <p class="title">评价提交成功</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            resultVisible: false, // 满意度已提交
            dataForm: {
                score: null, // 选中的item
                remark: ''
            }
        };
    },
    computed: {},
    watch: {},
    methods: {
        /**
         * init
         */
        init: function() {
            this.$data.resultVisible = false;
            this.$data.dataForm.score = null;
            this.$data.dataForm.remark = '';
        },

        /**
         * 提交
         */
        submit: function() {
            this.$data.resultVisible = true;
            // TODO 提交
        }
    },
};
</script>

<style lang="less">
.imRate-wrapper {
    height: 300px;
    & > .main {
        overflow: hidden;
        .title {
            text-align: center;
            font-size: 14px;
            color: #000000;
            margin-top: 15px;
        }
        .el-rate {
            margin-top: 20px;
            text-align: center;
            margin-bottom: 36px;
            .el-rate__item {
                width: 18%;
                .el-rate__icon {
                    font-size: 20px;
                }
            }
            .el-rate__text {
                display: block;
                margin-top: 16px;
            }
        }
        textarea {
            width: 95%;
            margin: 10px auto 0px;
        }
        .submit-btn {
            width: 100px;
            margin: 18px 0;
        }
    }
    & > .submit-main {
        .fa {
            display: table;
            margin: 85px auto 0px;
            color: #6bcc00;
            font-size: 50px;
        }
        .title {
            margin-top: 30px;
            font-size: 20px;
            text-align: center;
            color: #000000;
        }
    }
}
</style>
