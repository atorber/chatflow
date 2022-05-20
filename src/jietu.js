// 引入依赖插件
import puppeteer from 'puppeteer'
import fs from 'fs'
import { FileBox } from 'file-box'
import path from 'path'

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://spcp52tvpjhxm.com.vika.cn/share/shrrUqtCKYNeeNHH9Lunc/dstlk9YM5jaYnCtsu7/viwXenG0iXH6A');
    
    await page.screenshot({ path: 'example.png' });
  
    await browser.close();
  })();