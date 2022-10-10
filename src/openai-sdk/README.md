[![npm version](https://badge.fury.io/js/openai-sdk.svg)](https://www.npmjs.com/package/openai-sdk)
[![Actions status | kunl/openai-sdk](https://github.com/kunl/openai-sdk/workflows/Node%20CI/badge.svg)](https://github.com/kunl/openai-sdk/actions?actions?workflow=Node%20CI)


# 快速开始

## 1. 安装openai-sdk

```js

  npm i openai-sdk
  import openai-sdk from 'openai-sdk'

```

### 2. 引入并初始化相关参数

```js

  import openai from 'openai-sdk'
  let {
      init,
      chat,
      nlp
  } = openai
  init({
    TOKEN: "",
    EncodingAESKey: ""
  })

```

### 3. 聊天接口

```js

  chat({
    username: "uid",
    msg: "你好吗"
  }).then(res => {
      console.log('机器人返回:', res)
  }, res => {
      console.log('reject res:', res)
  }).catch(e => {
      console.log('error', e)
  })

```

### 4.nlp相关接口 

#### 4.1 分词

```js
    // 分词
    nlp.tokenize({
        uid: "uid",
        data: {
            q: "我的家乡叫中国。"
        }
    }).then(res => {
        console.log('词法分析返回：', res)
    }, res => {
        console.log('reject res:', res)
    }).catch(e => {
        console.log('error', e)
    })

   // 分词接口返回值
   {
      words: ['我', '的', '家乡', '叫', '中国', '。'],
      POSs: [27, 30, 16, 31, 20, 34],
      words_mix: ['我的家乡', '叫', '中国', '。'],
      POSs_mix: [16, 31, 20, 34],
      entities: ['我的家乡', '我的', '中国'],
      entity_types: [0, 0, 100000012]
  }
```

#### 4.2 数字日期时间识别

```js
    // 数字日期时间识别
    nlp.ner({
        uid: "uid",
        data: {
            q: "帮我订两张后天上午的火车票"
        }
    }).then(res => {
        console.log('数字日期时间识别返回：', res)
    }, res => {
        console.log('reject res:', res)
    }).catch(e => {
        console.log('error', e)
    })

   // 数字日期时间识别接口返回值
   [
      {
          type: 'number',
          span: [3, 4],
          text: '两',
          norm: '2'
      },
      {
          type: 'datetime_interval',
          span: [5, 9],
          text: '后天上午',
          norm: '2019-11-23 08:00:00~2019-11-23 11:59:59'
      }
    ]
```

#### 4.3 情感分析

```js
    // 情感分析
    nlp.sentiment({
        uid: "uid",
        data: {
            q: "恭喜小张脱单成功",
            mode: "6class"
        }
    }).then(res => {
        console.log('情感分析返回：', res)
    }, res => {
        console.log('reject res:', res)
    })
    .catch(e => {
        console.log('error', e)
    })

   // 情感分析接口返回值
   {
      error: null,
      result: [
          ['高兴', 0.9011998772621155],
          ['无情感', 0.08493703603744507],
          ['喜欢', 0.011011340655386448],
          ['悲伤', 0.0015742022078484297],
          ['厌恶', 0.0006485909689217806],
          ['愤怒', 0.000628964276984334]
      ]
  }
```
#### 4.4 敏感词识别

```js
    // 敏感词识别
    nlp.sensitive({
        uid: "uid",
        data: {
            q: "楼主真垃圾，祝你早日死全家"
        }
    }).then(res => {
        console.log('敏感词识别返回：', res)
    }, res => {
        console.log('reject res:', res)
    }).catch(e => {
        console.log('error', e)
    })

   // 敏感词识别接口返回值
   {
      error: null,
      result: [
          ['dirty_curse', 0.9999999900000001],
          ['other', 9.9999999e-9],
          ['dirty_politics', 0],
          ['dirty_porno', 0]
      ]
  }
```
