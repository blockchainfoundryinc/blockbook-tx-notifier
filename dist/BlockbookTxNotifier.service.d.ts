import { OnDestroy } from '@angular/core';
import { BlockbookTxNotifierConfigService } from "./BlockbookTxNotifierConfig.service";
import { BlockbookTxNotifiersConstructorProps } from "./models";
export declare class BlockbookTxNotifierService implements OnDestroy {
    private configService;
    private txNotifs;
    config: BlockbookTxNotifiersConstructorProps;
    constructor(configService: BlockbookTxNotifierConfigService);
    ngOnDestroy(): void;
    txSubject(): import("rxjs").Subject<unknown>;
    connectedSubject(): import("rxjs").BehaviorSubject<boolean>;
}
