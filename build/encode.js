"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDecoder = exports.generateEncoder = void 0;
const ts_poet_1 = require("ts-poet");
const types_1 = require("./types");
const options_1 = require("./options");
function generateEncoder(ctx, typeName) {
    const name = (0, types_1.wrapperTypeName)(typeName);
    if (!name) {
        return (0, ts_poet_1.code) `${(0, types_1.messageToTypeName)(ctx, typeName)}.encode(value).finish()`;
    }
    if (name == 'Timestamp') {
        const TimestampValue = (0, ts_poet_1.imp)(`${name}@./google/protobuf/timestamp`);
        return (0, ts_poet_1.code) `${TimestampValue}.encode(${ctx.utils.toTimestamp}(value)).finish()`;
    }
    const TypeValue = (0, ts_poet_1.imp)(`${name}@./google/protobuf/wrappers`);
    switch (name) {
        case 'StringValue':
            return (0, ts_poet_1.code) `${TypeValue}.encode({value: value ?? ""}).finish()`;
        case 'Int32Value':
        case 'UInt32Value':
        case 'DoubleValue':
        case 'FloatValue':
            return (0, ts_poet_1.code) `${TypeValue}.encode({value: value ?? 0}).finish()`;
        case 'Int64Value':
        case 'UInt64Value':
            if (ctx.options.forceLong === options_1.LongOption.LONG) {
                return (0, ts_poet_1.code) `${TypeValue}.encode({value: value ? value.toNumber(): 0}).finish()`;
            }
            return (0, ts_poet_1.code) `${TypeValue}.encode({value: value ?? 0 }).finish()`;
        case 'BoolValue':
            return (0, ts_poet_1.code) `${TypeValue}.encode({value: value ?? false}).finish()`;
        case 'BytesValue':
            return (0, ts_poet_1.code) `${TypeValue}.encode({value: value ?? new Uint8Array()}).finish()`;
    }
    throw new Error(`unknown wrapper type: ${name}`);
}
exports.generateEncoder = generateEncoder;
function generateDecoder(ctx, typeName) {
    let name = (0, types_1.wrapperTypeName)(typeName);
    if (!name) {
        return (0, ts_poet_1.code) `${(0, types_1.messageToTypeName)(ctx, typeName)}.decode(value)`;
    }
    let TypeValue;
    if (name == 'Timestamp') {
        TypeValue = (0, ts_poet_1.imp)(`${name}@./google/protobuf/timestamp`);
        return (0, ts_poet_1.code) `${TypeValue}.decode(value)`;
    }
    TypeValue = (0, ts_poet_1.imp)(`${name}@./google/protobuf/wrappers`);
    return (0, ts_poet_1.code) `${TypeValue}.decode(value).value`;
}
exports.generateDecoder = generateDecoder;
