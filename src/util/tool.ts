// 定义一个延时方法
const waitForMs = (ms: number | undefined) => new Promise(resolve => setTimeout(resolve, ms))

export {
  waitForMs,
}

export default waitForMs
