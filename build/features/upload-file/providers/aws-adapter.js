"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const base_provider_1 = __importDefault(require("./base-provider"));
class AWSProvider extends base_provider_1.default {
    // public expires: number | null
    constructor(options) {
        super(options.bucket);
        let AWS_S3;
        try {
            // eslint-disable-next-line
            const AWS = require('aws-sdk');
            AWS_S3 = AWS.S3;
        }
        catch (error) {
            throw new Error('You have to install `aws-sdk` in order to run this plugin with AWS');
        }
        // this check is needed because option expires can be `0`
        // this.expires = typeof options.expires === 'undefined'
        //   ? 86400
        //   : options.expires
        this.s3 = new AWS_S3(options);
    }
    async upload(file, key) {
        const tmpFile = fs_1.default.readFileSync(file.path);
        const params = {
            Bucket: this.bucket,
            Key: key,
            Body: tmpFile,
            ACL: 'public-read'
        };
        return this.s3.upload(params).promise();
    }
    async delete(key, bucket) {
        return this.s3.deleteObject({ Key: key, Bucket: bucket }).promise();
    }
    async path(key, bucket) {
        // https://bucket.s3.amazonaws.com/key
        return `https://${bucket}.s3.amazonaws.com/${key}`;
    }
}
exports.default = AWSProvider;
