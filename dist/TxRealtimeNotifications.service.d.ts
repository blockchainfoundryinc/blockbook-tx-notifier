import { OnDestroy } from '@angular/core';
import { TxRealtimeNotificationsConfigService } from "./TxRealtimeNotificationsConfig.service";
import { TxRealtimeNotificationsConstructorProps } from "./index";
export declare class TxRealtimeNotificationsService implements OnDestroy {
    private configService;
    private txNotifs;
    config: TxRealtimeNotificationsConstructorProps;
    constructor(configService: TxRealtimeNotificationsConfigService);
    ngOnDestroy(): void;
    txSubject(): import("rxjs").Subject<unknown>;
    statusSubject(): import("rxjs").Subject<unknown>;
}
