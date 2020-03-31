var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var BlockbookTxNotifierConfig_service_1 = require("./BlockbookTxNotifierConfig.service");
var index_1 = require("./index");
var BlockbookTxNotifierService = /** @class */ (function () {
    function BlockbookTxNotifierService(configService) {
        var _this = this;
        this.configService = configService;
        this.configService.configComplete.subscribe(function (config) {
            if (!config)
                return;
            _this.config = config;
            _this.txNotifs = new index_1.BlockbookTxNotifier({ url: config.url, address: config.address, restUrl: config.restUrl });
        });
    }
    BlockbookTxNotifierService.prototype.ngOnDestroy = function () {
        this.configService.configComplete.unsubscribe();
    };
    BlockbookTxNotifierService.prototype.txSubject = function () {
        return this.txNotifs.txSubject$;
    };
    BlockbookTxNotifierService.prototype.statusSubject = function () {
        return this.txNotifs.connectedSubject$;
    };
    BlockbookTxNotifierService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [BlockbookTxNotifierConfig_service_1.BlockbookTxNotifierConfigService])
    ], BlockbookTxNotifierService);
    return BlockbookTxNotifierService;
}());
exports.BlockbookTxNotifierService = BlockbookTxNotifierService;
