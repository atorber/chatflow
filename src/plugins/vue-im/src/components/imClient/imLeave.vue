<!-- 留言 -->
<template>
    <div class="imLeave-wrapper">
        <div v-show="!resultVisible" class="main">
            <p class="title">当前人工客服不在线，如需帮助请留言</p>
            <el-form class="main-form" ref="dataForm" :model="dataForm" :rules="dataForm_rules" label-position="top">
                <el-form-item prop="phone">
                    <el-input v-model="dataForm.phone" placeholder="手机(必填)"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="dataForm.email" placeholder="邮箱(必填)"></el-input>
                </el-form-item>
                <el-form-item prop="content">
                    <el-input type="textarea" v-model="dataForm.content" :rows="5" placeholder="请输入2-100字符"></el-input>
                </el-form-item>
                <el-form-item class="text-center">
                    <el-button type="primary" class="submit-btn" @click="submit" :disabled="dataForm.phone.length==0 || dataForm.email.length==0">提 交</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 留言提交成功 -->
        <div v-show="resultVisible" class="submit-main">
            <i class="fa fa-check-circle-o"></i>
            <p class="title">留 言 提 交 成 功</p>
            <p class="sub-title">我们会很快与您联系</p>
        </div>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            resultVisible: false, // 离线留言已提交
            dataForm: {
                email: '',
                phone: '',
                content: ''
            },
            dataForm_rules: {
                email: [
                    {
                        validator: function(rule, value, callback) {
                            if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)) {
                                callback(new Error('请输入正确的邮箱'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ],
                phone: [
                    {
                        validator: function(rule, value, callback) {
                            if (!/^((\d{3,4})|\d{3,4}-)?\d{7,8}$|^1[3-8]\d{9}$|^\d{5}$/.test(value)) {
                                callback(new Error('请输入正确的电话号码'));
                            } else {
                                callback();
                            }
                        },
                        trigger: 'change'
                    }
                ],
                content: [
                    {
                        max: 100,
                        message: '请输入2-100个字符',
                        trigger: 'change'
                    },
                    {
                        min: 2,
                        message: '请输入2-100个字符',
                        trigger: 'change'
                    }
                ]
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
            this.$data.dataForm = {
                email: '',
                phone: '',
                content: ''
            };
            this.$refs.dataForm && this.$refs.dataForm.resetFields();
        },

        /**
         * 提交
         */
        submit: function() {
            var self = this;
            this.$refs.dataForm.validate(function(valid) {
                if (valid) {
                    self.$data.resultVisible = true;
                }
            });
        }
    }
};
</script>

<style lang="less">
.imLeave-wrapper {
    height: 370px;
    padding: 0px 50px;
    .main {
        overflow: hidden;
        .title {
            margin-top: 15px;
            margin-bottom: 10px;
            text-align: center;
            font-size: 14px;
            color: #000000;
        }
        .main-form {
            margin-bottom: 10px;
            .submit-btn {
                width: 100px;
                margin-bottom: 15px;
            }
        }
    }
    .submit-main {
        color: #000000;
        .fa {
            color: #6bcc00;
            font-size: 50px;
            margin: 85px auto 0px;
            display: table;
        }
        .title {
            font-size: 18px;
            text-align: center;
            margin-top: 30px;
        }
        .sub-title {
            font-size: 14px;
            text-align: center;
            margin-top: 15px;
        }
    }
}
</style>
