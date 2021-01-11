"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * Creates a path to the file. Related to the given provider. If it is an AWS
 * path is related to the bucket.
 *
 * @param   {BaseRecord}  record
 * @param   {string}      path        file path
 *
 * @return  {string}
 * @private
 */
const buildRemotePath = (record, file) => {
    if (!record.id()) {
        throw new Error('You cannot upload file for not persisted record. Save record first');
    }
    const { ext, name } = path_1.default.parse(file.name);
    return `${record.id()}/${name}${ext}`;
};
exports.default = buildRemotePath;
