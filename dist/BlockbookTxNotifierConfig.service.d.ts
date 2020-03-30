import { BehaviorSubject } from "rxjs";
import { BlockbookTxNotifiersConstructorProps } from "./index";
export declare class BlockbookTxNotifierConfigService {
    url: string;
    address: string;
    restUrl: string;
    configComplete: BehaviorSubject<BlockbookTxNotifiersConstructorProps>;
    constructor();
    configure(url: any, address: any, restUrl?: string): void;
}
