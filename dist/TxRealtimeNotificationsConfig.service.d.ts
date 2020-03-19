import { BehaviorSubject } from "rxjs";
import { TxRealtimeNotificationsConstructorProps } from "./index";
export declare class TxRealtimeNotificationsConfigService {
    url: string;
    address: string;
    configComplete: BehaviorSubject<TxRealtimeNotificationsConstructorProps>;
    constructor();
    configure(url: any, address: any): void;
}
