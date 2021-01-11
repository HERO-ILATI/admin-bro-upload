import fs from 'fs'
// eslint-disable-next-line import/no-extraneous-dependencies
import { S3 } from 'aws-sdk'
import { UploadedFile } from 'admin-bro'

import BaseAdapter from './base-provider'

/**
 * AWS Credentials which can be set for S3 file upload.
 * If not given 'aws-sdk' will try to fetch them from
 * environmental variables.
 * @memberof module:@admin-bro/upload
 */
export type AWSOptions = {
  /**
   * AWS IAM accessKeyId. By default its value is taken from AWS_ACCESS_KEY_ID env variable
  */
  accessKeyId?: string;
  /**
   * AWS IAM secretAccessKey. By default its value is taken from AWS_SECRET_ACCESS_KEY env variable
   */
  secretAccessKey?: string;
  /**
   * AWS region where your bucket was created.
  */
  region: string;
  /**
   * S3 Bucket where files will be stored
   */
  bucket: string;
  /**
   * indicates how long links should be available after page load (in minutes).
   * Default to 24h. If set to 0 adapter will mark uploaded files as PUBLIC ACL.
   */
  expires?: number;
}

export default class AWSProvider extends BaseAdapter {
  private s3: S3

  // public expires: number

  constructor(options: AWSOptions) {
    super(options.bucket)

    let AWS_S3: typeof S3
    try {
      // eslint-disable-next-line
      const AWS = require('aws-sdk')
      AWS_S3 = AWS.S3
    } catch (error) {
      throw new Error('You have to install `aws-sdk` in order to run this plugin with AWS')
    }
    // this.expires = options.expires || 86400
    this.s3 = new AWS_S3(options)
  }

  public async upload(file: UploadedFile, key: string): Promise<S3.ManagedUpload.SendData> {
    const tmpFile = fs.readFileSync(file.path)
    const params: S3.PutObjectRequest = {
      Bucket: this.bucket,
      Key: key,
      Body: tmpFile,
      ACL : 'public-read'
    }
    // if (!this.expires) {
    //   params.ACL = 'public-read'
    // }
    return this.s3.upload(params).promise()
  }

  public async delete(key: string, bucket: string): Promise<S3.DeleteObjectOutput> {
    return this.s3.deleteObject({ Key: key, Bucket: bucket }).promise()
  }

  public async path(key: string, bucket: string): Promise<string> {
    // if (this.expires) {
    //   return this.s3.getSignedUrl('getObject', {
    //     Key: key,
    //     Bucket: bucket,
    //     Expires: this.expires,
    //   })
    // }
    // https://bucket.s3.amazonaws.com/key
    return `https://${bucket}.s3.amazonaws.com/${key}`
  }
}
