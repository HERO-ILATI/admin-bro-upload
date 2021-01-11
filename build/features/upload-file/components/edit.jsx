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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const admin_bro_1 = require("admin-bro");
const Edit = ({ property, record, onChange }) => {
    const { params } = record;
    const { custom } = property;
    const path = params[custom.filePathProperty];
    const key = params[custom.keyProperty];
    const file = params[custom.fileProperty];
    const [originalKey, setOriginalKey] = react_1.useState(key);
    const [filesToUpload, setFilesToUpload] = react_1.useState([]);
    react_1.useEffect(() => {
        // it means means that someone hit save and new file has been uploaded
        // in this case fliesToUpload should be cleared.
        // This happens when user turns off redirect after new/edit
        if (key !== originalKey) {
            setOriginalKey(key);
            setFilesToUpload([]);
        }
    }, [key, originalKey]);
    const onUpload = (files) => {
        setFilesToUpload(files);
        const [fileToUpload] = files;
        onChange(Object.assign(Object.assign({}, record), { params: Object.assign(Object.assign({}, params), (fileToUpload && { [custom.fileProperty]: fileToUpload })) }));
    };
    const handleRemove = () => {
        onChange(custom.fileProperty, null);
    };
    return (<admin_bro_1.FormGroup>
      <admin_bro_1.Label>{property.label}</admin_bro_1.Label>
      <admin_bro_1.DropZone onChange={onUpload} validate={{
        mimeTypes: custom.mimeTypes,
        maxSize: custom.maxSize,
    }}/>
      {key && path && !filesToUpload.length && file !== null && (<admin_bro_1.DropZoneItem filename={key} src={path} onRemove={handleRemove}/>)}
    </admin_bro_1.FormGroup>);
};
exports.default = Edit;