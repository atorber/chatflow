import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService {
  static async uploadToS3(
    s3: S3,
    bucketName: string,
    file: any,
    file_name: string,
  ): Promise<S3.ManagedUpload.SendData> {
    return s3
      .upload({
        Bucket: bucketName,
        Key: file_name,
        Body: file.buffer,
      })
      .promise();
  }
}
