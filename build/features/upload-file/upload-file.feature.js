"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_bro_1 = __importStar(require("admin-bro"));
const build_path_1 = __importDefault(require("./build-path"));
const aws_provider_1 = __importDefault(require("./providers/aws-provider"));
const local_provider_1 = __importDefault(require("./providers/local-provider"));
const uploadFileFeature = (config) => {
    const { provider, properties, validation } = config;
    let adapter;
    let providerName;
    if (provider && provider.name === 'BaseAdapter') {
        adapter = provider;
        providerName = 'base';
    }
    else if (provider && provider.aws) {
        const options = provider.aws;
        adapter = new aws_provider_1.default(options);
        providerName = 'aws';
    }
    else if (provider && provider.local) {
        const options = provider.local;
        adapter = new local_provider_1.default(options);
        providerName = 'local';
    }
    else {
        throw new Error('You have to specify provider in options');
    }
    if (!properties.key) {
        throw new Error('You have to define `key` property in options');
    }
    const fileProperty = properties.file || 'file';
    const filePathProperty = properties.filePath || 'filePath';
    const stripFileFromPayload = async (request, context) => {
        var _a, _b;
        context[fileProperty] = (_a = request === null || request === void 0 ? void 0 : request.payload) === null || _a === void 0 ? void 0 : _a[fileProperty];
        ((_b = request === null || request === void 0 ? void 0 : request.payload) === null || _b === void 0 ? true : delete _b[fileProperty]);
        return request;
    };
    const updateRecord = async (response, request, context) => {
        const { record, [fileProperty]: file } = context;
        const { method } = request;
        if (method !== 'post') {
            return response;
        }
        if (record && record.isValid()) {
            // someone wants to remove file
            if (file === null) {
                const bucket = (properties.bucket && record[properties.bucket]) || adapter.bucket;
                const key = record.params[properties.key];
                // and file exists
                if (key && bucket) {
                    const params = Object.assign(Object.assign(Object.assign(Object.assign({ [properties.key]: null }, properties.bucket && { [properties.bucket]: null }), properties.size && { [properties.size]: null }), properties.mimeType && { [properties.mimeType]: null }), properties.filename && { [properties.filename]: null });
                    await record.update(params);
                    await adapter.delete(key, bucket, context);
                    return Object.assign(Object.assign({}, response), { record: record.toJSON(context.currentAdmin) });
                }
            }
            if (file) {
                const uploadedFile = file;
                const oldRecord = Object.assign({}, record);
                const key = build_path_1.default(record, uploadedFile);
                await adapter.upload(uploadedFile, key, context);
                const params = Object.assign(Object.assign(Object.assign(Object.assign({ [properties.key]: key }, properties.bucket && { [properties.bucket]: adapter.bucket }), properties.size && { [properties.size]: uploadedFile.size.toString() }), properties.mimeType && { [properties.mimeType]: uploadedFile.type }), properties.filename && { [properties.filename]: uploadedFile.name });
                await record.update(params);
                const oldKey = oldRecord.params[properties.key] && oldRecord.params[properties.key];
                const oldBucket = (properties.bucket && oldRecord.params[properties.bucket]) || adapter.bucket;
                if (oldKey && oldBucket && (oldKey !== key || oldBucket !== adapter.bucket)) {
                    await adapter.delete(oldKey, oldBucket, context);
                }
                return Object.assign(Object.assign({}, response), { record: record.toJSON(context.currentAdmin) });
            }
        }
        return response;
    };
    const deleteFile = async (response, request, context) => {
        const { record } = context;
        const key = record === null || record === void 0 ? void 0 : record.param(properties.key);
        if (record && key) {
            const storedBucket = properties.bucket && record.param(properties.bucket);
            await adapter.delete(key, storedBucket || adapter.bucket, context);
        }
        return response;
    };
    const deleteFiles = async (response, request, context) => {
        const { records = [] } = context;
        await Promise.all(records.map(async (record) => {
            const key = record === null || record === void 0 ? void 0 : record.param(properties.key);
            if (record && key) {
                const storedBucket = properties.bucket && record.param(properties.bucket);
                await adapter.delete(key, storedBucket || adapter.bucket, context);
            }
        }));
        return response;
    };
    const fillRecordWithPath = async (record, context) => {
        const key = record === null || record === void 0 ? void 0 : record.params[properties.key];
        const storedBucket = properties.bucket && (record === null || record === void 0 ? void 0 : record.params[properties.bucket]);
        if (key) {
            // eslint-disable-next-line no-param-reassign
            record.params[filePathProperty] = await adapter.path(key, storedBucket || adapter.bucket, context);
        }
        return record;
    };
    const fillPath = async (response, request, context) => {
        const { record } = response;
        return Object.assign(Object.assign({}, response), { record: await fillRecordWithPath(record, context) });
    };
    const fillPaths = async (response, request, context) => {
        const { records } = response;
        return Object.assign(Object.assign({}, response), { records: await Promise.all(records.map((record) => fillRecordWithPath(record, context))) });
    };
    const custom = {
        fileProperty,
        filePathProperty,
        provider: providerName,
        keyProperty: properties.key,
        bucketProperty: properties.bucket,
        mimeTypeProperty: properties.mimeType,
        // bucket property can be empty so default bucket has to be passed
        defaultBucket: adapter.bucket,
        mimeTypes: validation === null || validation === void 0 ? void 0 : validation.mimeTypes,
        maxSize: validation === null || validation === void 0 ? void 0 : validation.maxSize,
    };
    const uploadFeature = admin_bro_1.buildFeature({
        properties: {
            [fileProperty]: {
                custom,
                isVisible: { show: true, edit: true, list: true, filter: false },
                components: {
                    edit: admin_bro_1.default.bundle('../../../src/features/upload-file/components/edit'),
                    list: admin_bro_1.default.bundle('../../../src/features/upload-file/components/list'),
                    show: admin_bro_1.default.bundle('../../../src/features/upload-file/components/show'),
                },
            },
        },
        actions: {
            show: {
                after: fillPath,
            },
            new: {
                before: stripFileFromPayload,
                after: [updateRecord, fillPath]
            },
            edit: {
                before: [stripFileFromPayload],
                after: [updateRecord, fillPath],
            },
            delete: {
                after: deleteFile,
            },
            list: {
                after: fillPaths,
            },
            bulkDelete: {
                after: deleteFiles,
            },
        },
    });
    return uploadFeature;
};
exports.default = uploadFileFeature;