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
var TxRealtimeNotification = /** @class */ (function () {
    function TxRealtimeNotification(props) {
        this.bbUrl = '';
        this.unconfirmedTxs = [];
        this.statusSubject$ = new rxjs_1.Subject();
        this.txSubject$ = new rxjs_1.Subject();
        if (!props.url || !props.address) {
            throw new Error('Missing required parameter.');
        }
        this.bbUrl = props.url;
        this.address = props.address;
        this.preventFetchOnStart = !!props.preventFetchOnStart;
        this.useHttp = !!props.useHttp;
        this.connect();
    }
    TxRealtimeNotification.prototype.getHashblockUrl = function (hash) {
        var url = new URL(this.bbUrl);
        url.protocol = this.useHttp ? 'http' : 'https';
        url.pathname = "/api/v2/block/" + hash;
        return url.toString();
    };
    TxRealtimeNotification.prototype.connect = function () {
        var _this = this;
        this.socket = io.connect(this.bbUrl);
        this.socket.on('connect', function () {
            _this.statusSubject$.next('connected');
            _this.subscribeToTxs();
            _this.subscribeToBlockhash();
            if (!_this.preventFetchOnStart) {
                _this.getUnconfirmedTxs();
            }
        });
        this.socket.on('disconnect', function () { return _this.statusSubject$.next('disconnected'); });
    };
    TxRealtimeNotification.prototype.disconnect = function () {
        this.socket.disconnect();
    };
    TxRealtimeNotification.prototype.isConnected = function () {
        return this.socket.connected;
    };
    TxRealtimeNotification.prototype.subscribeToTxs = function () {
        var _this = this;
        this.socket.emit('subscribe', 'bitcoind/addresstxid', Array.isArray(this.address) ? this.address : [this.address]);
        this.socket.on('bitcoind/addresstxid', function (tx) {
            var opts = {
                method: 'getDetailedTransaction',
                params: [tx.txid]
            };
            _this.socket.send(opts, function (tx) {
                var parsedTx = {
                    txid: tx.txid,
                    confirmed: false,
                    tx: tx
                };
                _this.txSubject$.next(parsedTx);
                _this.unconfirmedTxs.push(parsedTx);
            });
        });
    };
    TxRealtimeNotification.prototype.subscribeToBlockhash = function () {
        var _this = this;
        this.socket.emit('subscribe', 'bitcoind/hashblock');
        this.socket.on('bitcoind/hashblock', function (hash) { return __awaiter(_this, void 0, void 0, function () {
            var block, err_1, txsInBlock, newUnconfirmedTxs;
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
                        err_1 = _a.sent();
                        console.error(err_1);
                        return [2 /*return*/];
                    case 3:
                        txsInBlock = block.txs;
                        newUnconfirmedTxs = [];
                        this.unconfirmedTxs.forEach(function (tx) {
                            var utxidIndex = txsInBlock.findIndex(function (txInBlock) { return txInBlock.txid === tx.txid; });
                            if (utxidIndex !== -1) {
                                var opts = {
                                    method: 'getDetailedTransaction',
                                    params: [tx.txid]
                                };
                                _this.socket.send(opts, function (confirmedTx) {
                                    _this.txSubject$.next({
                                        txid: confirmedTx.txid,
                                        confirmed: true,
                                        tx: confirmedTx
                                    });
                                });
                            }
                            else {
                                newUnconfirmedTxs.push(tx);
                            }
                        });
                        this.unconfirmedTxs = newUnconfirmedTxs;
                        return [2 /*return*/];
                }
            });
        }); });
    };
    TxRealtimeNotification.prototype.getUnconfirmedTxs = function () {
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
            var parsedItems = res.result.items.map(function (tx) { return ({
                txid: tx.txid,
                confirmed: false,
                tx: tx
            }); });
            parsedItems.forEach(function (tx) {
                _this.txSubject$.next(tx);
                _this.unconfirmedTxs.push(tx);
            });
        });
    };
    return TxRealtimeNotification;
}());
exports.default = TxRealtimeNotification;
