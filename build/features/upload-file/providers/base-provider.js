"use strict";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable class-methods-use-this */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Abstract class which is a base for every @admin-bro/upload Adapter.
 *
 * In order to implement your own - you have to override all of its methods.
 * Next, you can pass it with: {@link UploadOptions.provider}
 *
 * ### Extending {@link BaseProvider}
 *
 * ```
 * const { BaseProvider } = require('@admin-bro/upload')
 *
 * class MyProvider extends BaseProvider {
 *   constructor() {
 *     // you have to pass bucket name to the constructor
 *     super('bucketName')
 *   }
 *
 *   public async upload() {
 *     console.log('uploaded')
 *     return true
 *   }
 *
 *   public async delete() {
 *     console.log('deleted')
 *     return true
 *   }
 *
 *   public async path() {
 *     return '/fle-url'
 *   }
 * }
 *
 * const options = {
 *   resources: [
 *     resource: YourResource,
 *     features: [uploadFeature({
 *       provider: new MyProvider(),
 *       properties: { ... },
 *     })],
 *   ]
 * }
 * ```
 *
 * @memberof module:@admin-bro/upload
 * @alias BaseProvider
 * @hide
 * @private
 */
class BaseProvider {
    /**
     * @param { string } bucket     place where files should be stored
     */
    constructor(bucket) {
        this.name = 'BaseAdapter';
        this.bucket = bucket;
    }
    /**
     * Uploads file to given bucket
     *
     * @param {UploadedFile} file uploaded by AdminBro file
     * @param {string} key file path
     * @abstract
     */
    async upload(file, key, context) {
        throw new Error('you have to implement `BaseProvider#upload` method');
    }
    /**
     * Deletes given file
     *
     * @param {string} key file path
     * @param {string} bucket where file should be uploaded
     * @abstract
     */
    async delete(key, bucket, context) {
        throw new Error('you have to implement `BaseProvider#delete` method');
    }
    /**
     * Returns path for the file from where it can be downloaded. It is dynamic in case of
     * time based paths: i.e. link valid in the next 24h
     *
     * @param {string} key file path
     * @param {string} bucket where file should be put
     * @async
     * @abstract
     */
    path(key, bucket, context) {
        throw new Error('you have to implement `BaseProvider#path` method');
    }
}
exports.default = BaseProvider;
