"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const admin_bro_1 = require("admin-bro");
const file_1 = __importDefault(require("./file"));
const Show = (props) => {
    const { property } = props;
    return (<admin_bro_1.FormGroup>
      <admin_bro_1.Label>{property.label}</admin_bro_1.Label>
      <file_1.default width="100%" {...props}/>
    </admin_bro_1.FormGroup>);
};
exports.default = Show;
