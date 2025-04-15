import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Request,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { S3 } from 'aws-sdk';
import { Store } from '../../db/store.js';
// import { v4 } from 'uuid';
import { writeFile } from 'fs/promises';
import { join } from 'path';

@Controller('api/v1/upload')
export class UploadController {
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Request() req: any,
    @UploadedFile() file: any,
    @Body() body: any,
  ) {
    console.info('上传图片文件:', file);
    console.info('其他表单数据:', body);

    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }

    // 这里可以添加您的文件处理逻辑
    // 比如将文件保存到服务器或云存储，并获取文件的URL
    const s3 = new S3({
      accessKeyId: db.config.accessKeyId,
      secretAccessKey: db.config.secretAccessKey,
      region: db.config.region,
      endpoint: db.config.endpoint,
    });
    const file_name = `send/${file.originalname}`;
    const bucketName = db.config.bucketName;
    if (bucketName) {
      const uploadResult = await UploadService.uploadToS3(
        s3,
        bucketName,
        file,
        file_name,
      );

      return {
        code: 200,
        message: 'success',
        data: {
          src: uploadResult.Location, // S3返回的文件URL
        },
      };
    } else {
      return {
        code: 400,
        message: 'error',
        data: {
          src: '', // S3返回的文件URL
        },
      };
    }
  }

  @Post('imageVika')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageVika(
    @Request() req: any,
    @UploadedFile() file: any,
    @Body() body: any,
  ) {
    console.info('上传图片文件:', file);
    console.info('其他表单数据:', body);

    const user = req.user;
    // console.debug(user);
    // console.debug(Store.users);
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }

    // 构建保存文件的路径
    const savePath = join(__dirname, '../upload', file.originalname);
    console.info('文件保存路径:', savePath);
    // 使用fs模块将文件保存到磁盘
    await writeFile(savePath, file.buffer);

    // 响应
    return { message: '文件上传成功', filename: file.originalname };
  }

  // 计算分片上传的MD5值
  @Post('multipart/initiate')
  async uploadFile(@Request() req: any, @Body() body: any) {
    console.info('文件信息:', body);

    const user = req.user;
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }

    const s3 = new S3({
      accessKeyId: db.config.accessKeyId,
      secretAccessKey: db.config.secretAccessKey,
      region: db.config.region,
      endpoint: db.config.endpoint,
    });

    const uploadParams = {
      Bucket: db.config.bucketName || '',
      Key: `send/${body.file_name}`, // 设置文件的唯一标识
    };

    try {
      const multipartUpload = await s3
        .createMultipartUpload(uploadParams)
        .promise();

      return {
        code: 200,
        message: 'success',
        data: {
          // 分片大小50M
          split_size: 50 * 1024 * 1024,
          upload_id: multipartUpload.UploadId, // 分片上传的uploadId
          upload_id_md5: body.file_name || '', //计算得到的MD5值
        },
      };
    } catch (error) {
      console.error('创建分片上传失败:', error);
      throw new InternalServerErrorException('无法初始化分片上传');
    }
  }

  // 上传分片
  @Post('multipart')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPart(
    @Request() req: any,
    @UploadedFile() file: any,
    @Body()
    body: {
      upload_id: string;
      split_index: string;
      split_num: string;
      file_name: string;
    },
  ) {
    console.info('上传分片文件:', file);
    console.info('其他表单数据:', body);

    const user = req.user;
    const db = Store.findUser(user.userId);
    if (!db) {
      throw new UnauthorizedException();
    }

    const s3 = new S3({
      accessKeyId: db.config.accessKeyId,
      secretAccessKey: db.config.secretAccessKey,
      region: db.config.region,
      endpoint: db.config.endpoint,
    });

    const uploadParams = {
      Bucket: db.config.bucketName || '',
      Key: `send/${body.file_name}`,
      PartNumber: Number(body.split_num), // 分片序号
      UploadId: body.upload_id, // 分片上传的uploadId
      Body: file.buffer, // 分片文件
    };

    try {
      const res = await s3.uploadPart(uploadParams).promise();
      console.debug('分片上传：', res);
      const completeParams = {
        Bucket: db.config.bucketName || '',
        Key: `send/${body.file_name}`, // 这个键应该与初始化和上传分片时使用的一致
        UploadId: body.upload_id,
        MultipartUpload: {
          Parts: [
            {
              ETag: res.ETag,
              PartNumber: Number(body.split_num),
            },
          ], // 分片数组，包含 { ETag, PartNumber } 对象
        },
      };
      const completeMultipartUploadResult = await s3
        .completeMultipartUpload(completeParams)
        .promise();
      return {
        code: 200,
        message: 'success',
        data: {
          is_merge: true, // 是否合并分片
          upload_id: body.upload_id, // 分片上传的uploadId
          src: completeMultipartUploadResult.Location, // S3返回的文件URL
        },
      };
    } catch (error) {
      console.error('上传分片失败:', error);
      throw new InternalServerErrorException('无法上传分片');
    }
  }
}
