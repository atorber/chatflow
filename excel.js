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
const __dirname = path.resolve()

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
        rows.shift()
        rows.pop()
        rows.sort(function (a, b) {
          return a[keysLength - 1] - b[keysLength - 1]
        })
        for (let i = 0; i < rows.length; i++) {
        //   console.log(`第${i + 1}行数据：${rows[i]}`)
          const row = rows[i]
          const order = {}
          for (const y in row) {
            if (!['团员备注', '详细地址', '下单人', '跟团号'].includes(keys[y])) {
              order[keys[y]] = row[y]
            }
          }
          // order.index = i
          // console.debug(order)
          if (Object.keys(orders).includes(order['几期'])) {
            if (orders[order['几期']][order['几号楼']]) {
              orders[order['几期']][order['几号楼']].push(order)
              const items = orders[order['几期']][order['几号楼']]
              items.sort(function (a, b) {
                return a['几室'] - b['几室']
              })
              orders[order['几期']][order['几号楼']] = items
            } else {
              orders[order['几期']][order['几号楼']] = []
              orders[order['几期']][order['几号楼']].push(order)
              const items = orders[order['几期']][order['几号楼']]
              items.sort(function (a, b) {
                return a['几室'] - b['几室']
              })
              orders[order['几期']][order['几号楼']] = items
            }

          } else {
            orders[order['几期']] = {}
            orders[order['几期']][order['几号楼']] = []
            orders[order['几期']][order['几号楼']].push(order)
            const items = orders[order['几期']][order['几号楼']]
            items.sort(function (a, b) {
              return a['几室'] - b['几室']
            })
            orders[order['几期']][order['几号楼']] = items
          }

        }
        // console.debug(JSON.stringify(orders))
        const newList = []
        const addInfo = {}
        const excelData = []
        // 添加数据
        for (const i in orders) {
          // newList.push(i + '期')
          // 名称
          addInfo.name = i + '期'
          // 数据数组
          addInfo.data = [
            [keys[keysLength - 2], keys[keysLength - 3], keys[keysLength - 10]],
          ]

          const qicount = {

          }

          for (let g = 4; g < keys.length - 19; g++) {
            addInfo.data[0].push(keys[g])
            qicount[keys[g]] = 0
          }

          const qi = orders[i]
          for (const j in qi) {
            // newList.push(j + '号楼')
            const loucount = {

            }

            for (let g = 4; g < keys.length - 19; g++) {
              loucount[keys[g]] = 0
            }

            const lou = qi[j]
            for (const x in lou) {
              const shi = lou[x]
              for (let g = 4; g < keys.length - 19; g++) {
                loucount[keys[g]] = loucount[keys[g]] + shi[keys[g]]
              }
              newList.push(shi)
              const shiorder = [shi[keys[keysLength - 2]] + '号楼', shi[keys[keysLength - 3]], shi[keys[keysLength - 10]]]

              for (let g = 4; g < keys.length - 19; g++) {
                shiorder.push(shi[keys[g]] || 0)
              }
              addInfo.data.push(shiorder)
            }

            const count = [`${j}号楼小计：`, '', '']
            const blankRow = ['', '', '']
            const titleRow = [keys[keysLength - 2], keys[keysLength - 3], keys[keysLength - 10]]

            for (let g = 4; g < keys.length - 19; g++) {
              count.push(loucount[keys[g]] || 0)
              blankRow.push('')
              titleRow.push(keys[g])
              qicount[keys[g]] = qicount[keys[g]] + loucount[keys[g]]
            }
            console.debug(JSON.stringify(count))
            console.debug(JSON.stringify(qicount))
            addInfo.data.push(count)
            addInfo.data.push(blankRow)
            addInfo.data.push(titleRow)

          }

          const count = ['合计', '', '']
          for (let g = 4; g < keys.length - 19; g++) {
            count.push(qicount[keys[g]] || 0)
          }
          addInfo.data.push(count)
          excelData.push(JSON.parse(JSON.stringify(addInfo)))
        }
        // console.debug(excelData)
        // console.debug(newList)
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
              await message.say(fileBox)
              newpath = ''
              message = ''
            }
          })

        } catch (e) {
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
