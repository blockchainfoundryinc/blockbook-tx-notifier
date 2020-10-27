var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var io = require("socket.io-client");
var axios_1 = require("axios");
require("url-polyfill");
var rxjs_1 = require("rxjs");
var BlockbookTxNotifier = /** @class */ (function () {
    function BlockbookTxNotifier(props) {
        this.bbUrl = '';
        this.bbRestUrl = '';
        this.unconfirmedTxs = [];
        this.CANCELLED_INTERVAL_MS = 5000;
        this.connectedSubject$ = new rxjs_1.BehaviorSubject(null);
        this.txSubject$ = new rxjs_1.Subject();
        if (!props.url || !props.address) {
            throw new Error('Missing required parameter.');
        }
        this.bbUrl = props.url;
        this.address = props.address;
        this.preventFetchOnStart = !!props.preventFetchOnStart;
        this.useHttp = !!props.useHttp;
        this.bbRestUrl = props.restUrl;
        this.preventLog = props.preventLogs;
        this.connect();
    }
    BlockbookTxNotifier.prototype.log = function (args) {
        if (!this.preventLog) {
            console.log(args);
        }
    };
    BlockbookTxNotifier.prototype.getHashblockUrl = function (hash) {
        var url = new URL(this.bbRestUrl ? this.bbRestUrl : this.bbUrl);
        if (!this.bbRestUrl) {
            url.protocol = this.useHttp ? 'http' : 'https';
        }
        url.pathname = "/api/v2/block/" + hash;
        return url.toString();
    };
    BlockbookTxNotifier.prototype.getTxUrl = function (txid) {
        var url = new URL(this.bbRestUrl ? this.bbRestUrl : this.bbUrl);
        if (!this.bbRestUrl) {
            url.protocol = this.useHttp ? 'http' : 'https';
        }
        url.pathname = "/api/v2/tx/" + txid;
        return url.toString();
    };
    BlockbookTxNotifier.prototype.connect = function () {
        var _this = this;
        this.socket = io.connect(this.bbUrl, { transports: ['websocket'] });
        this.socket.on('connect', function () {
            _this.connectedSubject$.next(true);
            _this.subscribeToTxs();
            _this.subscribeToBlockhash();
            if (!_this.preventFetchOnStart) {
                _this.getUnconfirmedTxs();
            }
        });
        this.socket.on('disconnect', function () { return _this.connectedSubject$.next(false); });
    };
    BlockbookTxNotifier.prototype.disconnect = function () {
        this.socket.disconnect();
    };
    BlockbookTxNotifier.prototype.isConnected = function () {
        return this.socket.connected;
    };
    BlockbookTxNotifier.prototype.subscribeToTxs = function () {
        var _this = this;
        this.socket.emit('subscribe', 'bitcoind/addresstxid', Array.isArray(this.address) ? this.address : [this.address]);
        this.socket.on('bitcoind/addresstxid', function (tx) { return __awaiter(_this, void 0, void 0, function () {
            var txDetails, err_1, parsedTx;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(this.getTxUrl(tx.txid))];
                    case 1:
                        txDetails = _a.sent();
                        txDetails = txDetails.data;
                        return [3 /*break*/, 3];
                    case 2:
                        err_1 = _a.sent();
                        this.log(err_1);
                        return [2 /*return*/];
                    case 3:
                        parsedTx = {
                            txid: tx.txid,
                            confirmed: false,
                            tx: txDetails
                        };
                        this.txSubject$.next(parsedTx);
                        this.unconfirmedTxs.push(parsedTx);
                        return [2 /*return*/];
                }
            });
        }); });
        this.checkCancelledInterval = setInterval(this.checkCancelledTx.bind(this), this.CANCELLED_INTERVAL_MS);
    };
    BlockbookTxNotifier.prototype.checkCancelledTx = function () {
        var _this = this;
        this.unconfirmedTxs.forEach(function (utx) { return __awaiter(_this, void 0, void 0, function () {
            var utxInfo, err_2, newTxs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(this.getTxUrl(utx.txid))];
                    case 1:
                        utxInfo = _a.sent();
                        if (utx.error) {
                            throw utx.error;
                        }
                        return [2 /*return*/];
                    case 2:
                        err_2 = _a.sent();
                        this.log("Tx " + utx.txid + " dropped.");
                        newTxs = this.unconfirmedTxs.filter(function (tx) { return tx.txid !== utx.txid; });
                        this.unconfirmedTxs = newTxs;
                        this.txSubject$.next(__assign(__assign({}, utx), { cancelled: true }));
                        return [2 /*return*/];
                    case 3: return [2 /*return*/];
                }
            });
        }); });
    };
    BlockbookTxNotifier.prototype.subscribeToBlockhash = function () {
        var _this = this;
        this.socket.emit('subscribe', 'bitcoind/hashblock');
        this.socket.on('bitcoind/hashblock', function (hash) { return __awaiter(_this, void 0, void 0, function () {
            var block, txDetails, err_3, txsInBlock, newUnconfirmedTxs;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(this.getHashblockUrl(hash))];
                    case 1:
                        block = _a.sent();
                        block = block.data;
                        return [3 /*break*/, 3];
                    case 2:
                        err_3 = _a.sent();
                        this.log(err_3);
                        return [2 /*return*/];
                    case 3:
                        txsInBlock = block.txs;
                        if (!txsInBlock) {
                            return [2 /*return*/];
                        }
                        newUnconfirmedTxs = [];
                        this.unconfirmedTxs.forEach(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var utxidIndex, err_4;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        utxidIndex = txsInBlock.findIndex(function (txInBlock) { return txInBlock.txid === tx.txid; });
                                        if (!(utxidIndex !== -1)) return [3 /*break*/, 5];
                                        _a.label = 1;
                                    case 1:
                                        _a.trys.push([1, 3, , 4]);
                                        return [4 /*yield*/, axios_1.default.get(this.getTxUrl(tx.txid))];
                                    case 2:
                                        txDetails = _a.sent();
                                        txDetails = txDetails.data;
                                        return [3 /*break*/, 4];
                                    case 3:
                                        err_4 = _a.sent();
                                        this.log(err_4);
                                        return [2 /*return*/];
                                    case 4:
                                        this.txSubject$.next({
                                            txid: txDetails.txid,
                                            confirmed: true,
                                            tx: txDetails
                                        });
                                        return [3 /*break*/, 6];
                                    case 5:
                                        newUnconfirmedTxs.push(tx);
                                        _a.label = 6;
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); });
                        this.unconfirmedTxs = newUnconfirmedTxs;
                        return [2 /*return*/];
                }
            });
        }); });
    };
    BlockbookTxNotifier.prototype.getUnconfirmedTxs = function () {
        var _this = this;
        var opts = {
            method: 'getAddressHistory',
            params: [
                Array.isArray(this.address) ? this.address : [this.address],
                {
                    // needed for older bitcores (so we don't load all history if bitcore-node < 3.1.3)
                    start: 0,
                    end: 1000,
                    from: 0,
                    to: 1000,
                    queryMempoolOnly: true
                }
            ]
        };
        this.socket.send(opts, function (res) {
            res.result.items.forEach(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                var txDetails, err_5, parsedTx;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, axios_1.default.get(this.getTxUrl(tx.tx.hash))];
                        case 1:
                            txDetails = _a.sent();
                            txDetails = txDetails.data;
                            return [3 /*break*/, 3];
                        case 2:
                            err_5 = _a.sent();
                            this.log(err_5);
                            return [2 /*return*/];
                        case 3:
                            parsedTx = {
                                txid: tx.txid,
                                confirmed: false,
                                tx: txDetails
                            };
                            this.txSubject$.next(parsedTx);
                            this.unconfirmedTxs.push(parsedTx);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    };
    return BlockbookTxNotifier;
}());
exports.BlockbookTxNotifier = BlockbookTxNotifier;
