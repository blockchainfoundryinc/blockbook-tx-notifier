import { OnDestroy } from '@angular/core';
import { BlockbookTxNotifierConfigService } from "./BlockbookTxNotifierConfig.service";
import { BlockbookTxNotifiersConstructorProps } from "./index";
export declare class BlockbookTxNotifierService implements OnDestroy {
    private configService;
    private txNotifs;
    config: BlockbookTxNotifiersConstructorProps;
    constructor(configService: BlockbookTxNotifierConfigService);
    ngOnDestroy(): void;
    txSubject(): import("rxjs").Subject<unknown>;
    statusSubject(): import("rxjs").Subject<unknown>;
}
