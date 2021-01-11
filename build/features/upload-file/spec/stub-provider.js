"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const base_provider_1 = __importDefault(require("../providers/base-provider"));
const stubProvider = (resolvedS3Path) => {
    class StubProvider extends base_provider_1.default {
        constructor() {
            super(...arguments);
            this.path = sinon_1.default.stub().resolves(resolvedS3Path);
            this.upload = sinon_1.default.stub().resolves(resolvedS3Path);
            this.delete = sinon_1.default.stub().resolves(resolvedS3Path);
        }
    }
    return new StubProvider('bucketName');
};
exports.default = stubProvider;