import { Controller, Post, Body } from '@nestjs/common';
import { SetMetadata } from '@nestjs/common';
// import * as path from 'path';
import { drawPosterWithText, downloadImage } from './poster.js';
import { S3 } from 'aws-sdk';
import 'dotenv/config.js';
import { FileBox } from 'file-box';
import * as fs from 'fs';

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
@Controller('api/v1/magic')
export class MagicController {
  @Public()
  @Post('poem-poster')
  async posterCreate(
    @Body()
    body: {
      title: string;
      text: string;
      image_url: string;
    },
  ) {
    console.log(body);
    // 诗词生成海报
    /*
    {
      "action": "poem-poster",
      "parms": {
          "title": "春联",
          "text": "春联题材广无边，福寿康宁喜气添。家国情怀展宏图，吉祥如意庆丰年。",
          "image_url": "https://lf-plugin-resouce.oceancloudapi.com/obj/bot-studio-platform-plugin-tos/artist/image/44f743db3d514657bd0648de9ca5869e.png"
      }
  }
  */
    const { title, text, image_url } = body;
    try {
      //   const uuid = Math.random().toString(36).substr(2, 8);
      const outputPath = './';
      const imagePath = await downloadImage(image_url, outputPath);
      console.info('downloadImage imagePath', imagePath);

      // 生成海报
      const fileRes = await drawPosterWithText(
        imagePath,
        title,
        text,
        outputPath,
      );
      console.info('drawPosterWithText fileRes', JSON.stringify(fileRes));

      async function uploadToS3(
        s3: S3,
        bucketName: string,
        file: any,
        file_name: string,
      ): Promise<S3.ManagedUpload.SendData> {
        return s3
          .upload({
            Bucket: bucketName,
            Key: file_name,
            Body: file,
          })
          .promise();
      }
      // 比如将文件保存到服务器或云存储，并获取文件的URL
      const s3 = new S3({
        accessKeyId: process.env['accessKeyId'],
        secretAccessKey: process.env.secretAccessKey,
        region: process.env.region,
        endpoint: process.env.endpoint,
      });

      const bucketName = process.env.bucketName || 'poem-poster';
      const uploadResult = await uploadToS3(
        s3,
        bucketName,
        await FileBox.fromFile(fileRes.outputFileName).toBuffer(),
        'poster' + '/' + fileRes.newFileName,
      );
      console.info('uploadResult', JSON.stringify(uploadResult));
      // 删除文件fileRes.outputFileName
      fs.unlinkSync(fileRes.outputFileName);
      fs.unlinkSync(imagePath);

      return {
        code: 200,
        message: 'success',
        data: {
          url: uploadResult.Location,
          title,
          text,
        },
      };
    } catch (e) {
      console.error(e);
      return {
        code: 500,
        message: 'fail',
        data: e,
      };
    }
  }
}
