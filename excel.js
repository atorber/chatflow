/* eslint-disable no-undef */
/* eslint-disable sort-keys */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable eqeqeq */
/* eslint-disable no-console */
import nodeXlsx from 'node-xlsx'
import ExcelJS from 'exceljs'
import fs from 'fs'
import { FileBox } from 'file-box'
import path from 'path'
import configs from './config.js'
import { VikaBot } from './src/vika.js'
const __dirname = path.resolve()

const vikaConfig = { token: configs.VIKA_TOKEN, sheetName: configs.VIKA_DATASHEETNAME, spaceName: configs.VIKA_SPACENAME }
const vika = new VikaBot(vikaConfig)

async function excel2order (filepath, message) {
  // console.debug('文件路径：', filepath)
  const s = {
    fill: {
      fgColor: { rgb: 'FFCC33' }, // 16进制，注意要去掉#
    },
  }

  const sheets = nodeXlsx.parse(filepath)
  // console.debug(sheets)
  // 解析所有sheet
  if (sheets.length === 6) {
    sheets.forEach(async sheet => {
      // sheet.data是所有行数据
      const rows = sheet.data
      const name = sheet.name
      console.debug(name)
      if (name == '顾客购买表(商品列排)') {
        console.log(rows.length)
        const keys = rows[0]
        const keysLength = keys.length
        const orders = {}
        const rowLength = keys.length
        rows.shift()
        rows.pop()
        rows.sort(function (a, b) {
          return String(a[keysLength - 1]) - String(b[keysLength - 1])
        })
        const num = {

        }
        for (let i = 0; i < rows.length; i++) {

          //   console.log(`第${i + 1}行数据：${rows[i]}`)
          const row = rows[i]
          row[rowLength - 1] = String(row[rowLength - 1])
          const order = {}
          for (const y in row) {
            order[y] = row[y]
          }
          // order.index = i
          //   console.debug(order)louOrders
          //   console.debug(order[0])

          if (Object.keys(orders).includes(order[rowLength - 1])) {
            const qiOrders = orders[order[rowLength - 1]]

            if (Object.keys(qiOrders).includes(order[rowLength - 2])) {
              const louOrders = qiOrders[order[rowLength - 2]]
              louOrders.push(order)
              louOrders.sort(function (a, b) {
                return a[rowLength - 3] - b[rowLength - 3]
              })
              qiOrders[order[rowLength - 2]] = louOrders
              orders[order[rowLength - 1]] = qiOrders

            } else {
              const louOrders = [order]
              qiOrders[order[rowLength - 2]] = louOrders
              orders[order[rowLength - 1]] = qiOrders

            }

          } else {
            const qiOrders = {}
            qiOrders[order[rowLength - 2]] = [order]
            orders[order[rowLength - 1]] = qiOrders
            // console.debug(JSON.stringify(orders))

          }

        }
        // console.debug(JSON.stringify(orders))
        const newList = []
        const excelData = []

        // 添加数据
        for (const i in orders) {
          // newList.push(i + '期')
          const addInfo = {}
          // 名称
          addInfo.name = i + '期(弄)'

          // 固定表头
          addInfo.data = [
            [keys[keysLength - 2], keys[keysLength - 3], keys[keysLength - 10]],
          ]

          const qicount = {

          }

          //   表头及计数初始化
          for (let g = 4; g < keys.length - 19; g++) {
            addInfo.data[0].push(keys[g])
            qicount[g] = 0
          }

          const qi = orders[i]
          for (const j in qi) {
            // newList.push(j + '号楼')
            const loucount = {

            }

            for (let g = 4; g < keys.length - 19; g++) {
              loucount[g] = 0
            }

            const lou = qi[j]

            for (const x in lou) {
              const shi = lou[x]
              for (let g = 4; g < keys.length - 19; g++) {
                loucount[g] = loucount[g] + shi[g]
              }
              newList.push(shi)
              const shiorder = [shi[rowLength - 2] + '号楼', shi[rowLength - 2], shi[rowLength - 10]]

              for (let g = 4; g < keys.length - 19; g++) {
                shiorder.push(shi[g] || 0)
              }
              addInfo.data.push(shiorder)
            }

            const count = [`${j}号楼小计：`, '', '']
            const blankRow = ['', '', '']
            const titleRow = [keys[keysLength - 2], keys[keysLength - 3], keys[keysLength - 10]]

            for (let g = 4; g < keys.length - 19; g++) {
              count.push(loucount[g] || 0)
              blankRow.push('')
              titleRow.push(keys[g])
              qicount[g] = qicount[g] + loucount[g]
            }
            console.debug(JSON.stringify(count))
            addInfo.data.push(count)
            addInfo.data.push(blankRow)
            addInfo.data.push(titleRow)

          }
          //   console.debug(JSON.stringify(qicount))

          const count = ['合计', '', '']
          for (let g = 4; g < keys.length - 19; g++) {
            count.push(qicount[g] || 0)
          }
          //   console.debug('合计-------------------', count)

          addInfo.data.push(count)
          excelData.push(JSON.parse(JSON.stringify(addInfo)))
        }
        // console.debug(excelData)
        console.debug(newList.length)
        // 写入Excel数据
        try {
          // 写xlsx
          const buffer = nodeXlsx.build(excelData)
          let newpath = __dirname + `\\cache\\汇总单_${path.basename(filepath)}`
          // const newpath = 'C:\\Users\\wechaty\\Documents\\GitHub\\wechat-openai-qa-bot\\data1652169999200.xls'
          // console.info('newpath==================================', newpath)
          // 写入数据
          fs.writeFile(newpath, buffer, async function (err) {
            if (err) {
              throw err
            }
            // 输出日志
            console.log('Write to xls has finished')
            await xlsxrw(newpath)

            const fileBox = FileBox.fromFile(newpath)
            console.log(fileBox)
            if (message) {
              await message.say('转换成功，请下载查看~')
              await message.say(fileBox)
              newpath = ''
              message = ''
            }
          })

        } catch (e) {
          await message.say('格式转换失败:\n1.请检查原始表格是否正确\n2.仅支持从快团团默认导出的全量字段表格\n3.表格中必须须包含 顾客购买表(商品列排) sheet\n4.文件名中不能包含括号等特殊字符，建议使用导出的原始文件名')
          // 输出日志
          console.log('excel写入异常,error=%s', e.stack)
          return e
        }
      }

    })
  }
}

// let demopath = 'tools/订单20_47_20.xlsx'
// excel2order(demopath)

async function xlsxrw (filename) {
  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filename)
  workbook.eachSheet(function (worksheet, sheetId) {

    // 遍历工作表中的所有行（包括空行）
    worksheet.eachRow({ includeEmpty: true }, function (row, rowNumber) {
    //   console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values))
      row.height = 30
      if (rowNumber === 1) {
        row.height = 20
        row.eachCell(function (cell, colNumber) {
        //   console.log('Cell ' + colNumber + ' = ' + cell.value)
          if (colNumber < 3) {
            worksheet.getColumn(colNumber).width = 10
          } else {
            worksheet.getColumn(colNumber).width = 20
          }

          cell.alignment = { wrapText: true }
          cell.font = {
            bold: true,
          }
        })
      }
      if (row.getCell(1).value && row.getCell(1).value.includes('小计')) {
        // 遍历一行中的所有单元格（包括空单元格）
        console.log('row ', JSON.stringify(row.values))
        row.eachCell({ includeEmpty: true }, function (cell, colNumber) {
        //   console.log('Cell ' + colNumber + ' = ' + cell.value)
          if (colNumber < 3) {
            cell.font = {
              bold: true,
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'darkTrellis',
              fgColor: { argb: 'FFFFFF00' },
              bgColor: { argb: 'FF0000FF' },
            }
          } else {
            cell.font = {
              bold: true,
            }
            cell.fill = {
              type: 'pattern',
              pattern: 'darkTrellis',
              fgColor: { argb: 'FFFFFF00' },
              bgColor: { argb: 'FF0000FF' },
            }
          }
        })
      }
    })

  })

  await workbook.xlsx.writeFile(filename)
}

export default excel2order
