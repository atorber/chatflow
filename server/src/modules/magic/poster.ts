/* eslint-disable sort-keys */
/* eslint-disable camelcase */
import * as fs from 'fs';
import { FileBox } from 'file-box';
import * as path from 'path';
import { CanvasRenderingContext2D, createCanvas, loadImage } from 'canvas';
import axios from 'axios';

// 设置超时时间
axios.defaults.timeout = 300000;

interface Chat {
  role: 'user' | 'assistant';
  content: string;
  content_type: 'text';
}

export class PoemPalette {
  mj_token: string;
  coze_token: string;
  bot_id: string;
  mj_host: string = 'https://api.opengptgod.com';
  // mj_host: string = 'https://api.gptgod.work';

  constructor(mj_token: string, coze_token: string, bot_id: string) {
    this.mj_token = mj_token;
    this.coze_token = coze_token;
    this.bot_id = bot_id;
  }

  async chat(
    user: string,
    text: string,
    chat_history: Chat[] = [],
  ): Promise<any> {
    axios.defaults.timeout = 30000;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.coze_token,
    };
    const data = {
      conversation_id: '123',
      bot_id: this.bot_id,
      user,
      query: text,
      chat_history,
      stream: false,
    };
    const res = await axios.post('https://api.coze.cn/open_api/v2/chat', data, {
      headers,
    });
    console.info('res:', JSON.stringify(res.data));
    const message = res.data.messages[0];
    const content = message.content;
    // console.info("content:", content);
    // 去除content中的回车、空格、制表符、换行符
    const str = content
      .replace(/[\r\n\t\s]/g, '')
      .replace(/“/g, '"')
      .replace(/”/g, '"');
    // console.info("str:", str);

    // 使用正则从str中提取出{和}之间的内容
    const reg = /{([^}]*)}/;
    const result = reg.exec(str);
    const resultStr = result ? result[0] : '';
    // console.info("resultStr:", resultStr);
    try {
      // 将resultStr转为json对象
      const dataStr = JSON.parse(resultStr);
      // console.info("dataStr:", JSON.stringify(dataStr, null, 2));
      return dataStr;
    } catch (error) {
      console.error('返回内容JSON格式化失败:', error);
      return await this.chat(user, text, chat_history);
    }
  }

  async createImage(textPoem: any, disc: string = '') {
    // const text = `${textPoem['诗题']}\n${textPoem['诗词']}\n画面描述:${textPoem['画面描述']}\n根据以上描述为这首诗词生成配图，符合中国的社会、文化元素。`
    const text = `${textPoem['诗题']}\n${textPoem['诗词']}\n根据以上描述为这首诗词生成配图，能够准确表达诗的意境。${disc}`;

    console.info('createImage图片生成提示词:', text);
    axios.defaults.timeout = 600000;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + this.mj_token,
    };
    const data = {
      model: 'mj-chat',
      messages: [{ role: 'user', content: text }],
    };

    /* stable-diffusion
      {
          "id": "chatcmpl-89D5Yb7J2XuJscZvBSPbooJVC11Dd",
          "object": "chat.completion",
          "created": 1714211738,
          "model": "stable-diffusion",
          "choices": [
              {
                  "index": 0,
                  "message": {
                      "role": "assistant",
                      "content": "绘制中..\n![一位老者，白发苍苍，面容和蔼，举手投足间的缓慢，让周围风云都仿佛放缓了脚步，不为世俗的纷扰所动，只有内心的宁静和岁月的智慧.png](https://pfst.cf2.poecdn.net/base/image/235545842df562c89fa8373b1eb62e205c9b04c296783f56cf995fc8ea7afd65?w=1024&h=1024&pmaid=73818077)"
                  },
                  "finish_reason": "stop"
              }
          ],
          "usage": {
              "prompt_tokens": 95,
              "completion_tokens": 159,
              "total_tokens": 254
          }
      }
        */

    /* gpt-4-dalle
        {
            "id": "chatcmpl-89DpPo455wq3Z98QMlTmW63ioXm0c",
            "object": "chat.completion",
            "created": 1714212085,
            "model": "gpt-4-dalle",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "{\"prompt\":\"A serene old man with white hair, a kindly face, moving slowly with each gesture as if slowing down the surrounding environment. He appears unaffected by worldly disturbances, embodying inner peace and the wisdom of the years. The setting is calm and timeless, reflecting his tranquil demeanor. The background suggests a soft, muted landscape that enhances the theme of serenity and wisdom.\",\"size\":\"1024x1024\"}\n\n![image1](https://filesystem.site/cdn/20240427/r47DOspEJKH3oXq5dRCmol5BvjBlxS.webp)![image2](https://filesystem.site/cdn/20240427/vT8b3yqiFhEqQeu4Kyftb0nQP5bhdN.webp)\n\n[下载1](https://filesystem.site/cdn/download/20240427/r47DOspEJKH3oXq5dRCmol5BvjBlxS.webp)\t[下载2](https://filesystem.site/cdn/download/20240427/vT8b3yqiFhEqQeu4Kyftb0nQP5bhdN.webp)\n\nHere are the images of the serene old man with white hair, embodying inner peace and the wisdom of the years. Each image captures his tranquil demeanor against a soft, muted landscape background."
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 95,
                "completion_tokens": 281,
                "total_tokens": 376
            }
        }
        */

    // 每5s打印一次当前请求耗时，直到返回结果时停止
    let i = 0;
    const interval = setInterval(() => {
      console.info('图片生成中...', i * 5, 's');
      i++;
    }, 5000);

    try {
      const res = await axios.post(
        `${this.mj_host}/v1/chat/completions`,
        data,
        { headers },
      );
      console.info('res:', JSON.stringify(res.data));
      const content = res.data.choices[0].message.content;
      clearInterval(interval);
      // 从content中提取出图片的url，截取出括号()中的内容
      const imageUrl = content.match(/\(([^)]*)\)/)[1];
      return imageUrl;
    } catch (error) {
      console.error('error:', error);
      clearInterval(interval);
      return '';
    }
  }

  // 分割图片
  async sliceImage(sourcePath: string, outputPath: string) {
    // Load the source image
    const image = await loadImage(sourcePath);
    const width = image.width / 2;
    const height = image.height / 2;
    const images: string[] = [];
    // 从sourcePath中提取出文件名
    const fileName = path.basename(sourcePath, path.extname(sourcePath));
    console.info('fileName:', fileName);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 2; j++) {
        // Create a canvas for each slice
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Draw a section of the source image on each canvas
        ctx.drawImage(
          image,
          i * width,
          j * height,
          width,
          height,
          0,
          0,
          width,
          height,
        );

        // Convert canvas to Buffer
        const buffer = canvas.toBuffer('image/png');
        // Save each canvas to file
        const file = path.join(outputPath, `${fileName}_slice_${i}_${j}.png`);
        console.info('file:', file);
        await fs.promises.writeFile(file, buffer);
        // await fs.writeFile(`${outputPath}_slice_${i}_${j}.png`, buffer);
        images.push(file);
      }
    }
    return images;
  }

  // 调用函数，传入源图片路径和输出路径
  // sliceImage('./source.png', './output').catch(console.error);

  async downloadImage(url: string, outputPath: string) {
    const fileBox = FileBox.fromUrl(url);
    const fileName = path.join(outputPath, fileBox.name);
    // console.info('fileName:', fileName);
    await fileBox.toFile(fileName, true);
    return fileName;
  }

  // 绘制带倒角的矩形边框的函数，用于给最终的图片添加统一的圆角
  drawRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
  }

  // 主要功能的函数
  async drawPosterWithText(
    imagePath: string,
    title: string,
    text: string,
    outputPath: any,
  ) {
    const image = await loadImage(imagePath);
    // 如果title中包含《》则去掉
    title = title.replace(/《|》/g, '');
    // 字体与留白的设置，以及外边框的大小
    const padding = 0;
    const borderSize = 5; // 外边框的大小
    const borderRadius = 0; // 图片和外边框的倒角的设置
    const borderColor = '#F8F8FF'; // 边框颜色：蓝灰色
    // const titleFont = 'bold 60px sans-serif';
    const titleFont = 'bold 60px "Noto Sans CJK SC", serif';
    const titlePaddingBottom = 80; // 标题下方留白
    // const textFont = '28px sans-serif';
    const textFont = '28px "Noto Sans CJK SC", serif';
    const textPaddingBottom = 40; // 正文下方留白
    const textLineHeight = 45; // 文本行高

    // 将文本按行分割
    const lines = text.split('\n');
    const totalTextHeight = lines.length * textLineHeight;

    // 计算画布宽度和高度
    const canvasWidth = image.width + padding * 2 + borderSize * 2;
    const canvasHeight =
      padding +
      60 +
      titlePaddingBottom +
      totalTextHeight +
      textPaddingBottom +
      image.height +
      padding +
      borderSize * 2;

    // 创建画布
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // 绘制蓝灰色的边框背景
    ctx.fillStyle = borderColor;
    this.drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, borderRadius);

    // 绘制白色的主体背景
    ctx.fillStyle = 'white';
    this.drawRoundedRect(
      ctx,
      borderSize,
      borderSize,
      canvasWidth - borderSize * 2,
      canvasHeight - borderSize * 2,
      borderRadius,
    );

    // 继续进行绘制工作
    const offsetX = borderSize + padding;
    let offsetY = borderSize + padding + 20;

    // 绘制标题
    ctx.fillStyle = 'black';
    ctx.font = titleFont;
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, offsetY + 60);

    offsetY += 60 + titlePaddingBottom;

    // 绘制正文
    ctx.font = textFont;
    lines.forEach((line: string, index: number) => {
      ctx.fillText(line, canvas.width / 2, offsetY + index * textLineHeight);
    });

    offsetY += totalTextHeight + textPaddingBottom;

    // 绘制图片
    ctx.drawImage(image, offsetX, offsetY, image.width, image.height);

    // 输出为PNG文件
    const buffer = canvas.toBuffer('image/png');
    const fileName = path.basename(imagePath, path.extname(imagePath));
    const outputFileName = `${outputPath}/${title}-${fileName}-framed-poster.png`;
    fs.writeFileSync(outputFileName, buffer);
    return outputFileName;
  }
}

// 分割图片
export async function sliceImage(sourcePath: string, outputPath: string) {
  // Load the source image
  const image = await loadImage(sourcePath);
  const width = image.width / 2;
  const height = image.height / 2;
  const images: string[] = [];
  // 从sourcePath中提取出文件名
  const fileName = path.basename(sourcePath, path.extname(sourcePath));
  console.info('fileName:', fileName);

  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      // Create a canvas for each slice
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext('2d');

      // Draw a section of the source image on each canvas
      ctx.drawImage(
        image,
        i * width,
        j * height,
        width,
        height,
        0,
        0,
        width,
        height,
      );

      // Convert canvas to Buffer
      const buffer = canvas.toBuffer('image/png');
      // Save each canvas to file
      const file = path.join(outputPath, `${fileName}_slice_${i}_${j}.png`);
      console.info('file:', file);
      await fs.promises.writeFile(file, buffer);
      // await fs.writeFile(`${outputPath}_slice_${i}_${j}.png`, buffer);
      images.push(file);
    }
  }
  return images;
}

// 调用函数，传入源图片路径和输出路径
// sliceImage('./source.png', './output').catch(console.error);

export async function downloadImage(url: string, outputPath: string) {
  const fileBox = FileBox.fromUrl(url);
  const fileName = path.join(__dirname, outputPath, fileBox.name);
  // console.info('fileName:', fileName);
  await fileBox.toFile(fileName, true);
  return fileName;
}

// 绘制带倒角的矩形边框的函数，用于给最终的图片添加统一的圆角
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

// 生成海报
export async function drawPosterWithText(
  imagePath: string,
  title: string,
  text: string,
  outputPath: any,
) {
  const image = await loadImage(imagePath);
  // 如果title中包含《》则去掉
  title = title.replace(/《|》/g, '');
  // 字体与留白的设置，以及外边框的大小
  const padding = 0;
  const borderSize = 5; // 外边框的大小
  const borderRadius = 0; // 图片和外边框的倒角的设置
  const borderColor = '#F8F8FF'; // 边框颜色：蓝灰色
  // const titleFont = 'bold 60px sans-serif';
  const titleFont = 'bold 60px "Noto Sans CJK SC", serif';

  const titlePaddingBottom = 80; // 标题下方留白
  // const textFont = '28px sans-serif';
  const textFont = '28px "Noto Sans CJK SC", serif';

  const textPaddingBottom = 40; // 正文下方留白
  const textLineHeight = 45; // 文本行高

  // 将文本按行分割
  const lines = text.split('\n');
  const totalTextHeight = lines.length * textLineHeight;

  // 计算画布宽度和高度
  const canvasWidth = image.width + padding * 2 + borderSize * 2;
  const canvasHeight =
    padding +
    60 +
    titlePaddingBottom +
    totalTextHeight +
    textPaddingBottom +
    image.height +
    padding +
    borderSize * 2;

  // 创建画布
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext('2d');

  // 绘制蓝灰色的边框背景
  ctx.fillStyle = borderColor;
  drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, borderRadius);

  // 绘制白色的主体背景
  ctx.fillStyle = 'white';
  drawRoundedRect(
    ctx,
    borderSize,
    borderSize,
    canvasWidth - borderSize * 2,
    canvasHeight - borderSize * 2,
    borderRadius,
  );

  // 继续进行绘制工作
  const offsetX = borderSize + padding;
  let offsetY = borderSize + padding + 20;

  // 绘制标题
  ctx.fillStyle = 'black';
  ctx.font = titleFont;
  ctx.textAlign = 'center';
  ctx.fillText(title, canvas.width / 2, offsetY + 60);

  offsetY += 60 + titlePaddingBottom;

  // 绘制正文
  ctx.font = textFont;
  lines.forEach((line: string, index: number) => {
    ctx.fillText(line, canvas.width / 2, offsetY + index * textLineHeight);
  });

  offsetY += totalTextHeight + textPaddingBottom;

  // 绘制图片
  ctx.drawImage(image, offsetX, offsetY, image.width, image.height);

  // 输出为PNG文件
  const buffer = canvas.toBuffer('image/png');
  const fileName = path.basename(imagePath, path.extname(imagePath));
  const newFileName = `${title}-${fileName}-framed-poster.png`;
  const outputFileName = path.join(__dirname, outputPath, newFileName);
  fs.writeFileSync(outputFileName, buffer);
  return { newFileName, outputFileName };
}
