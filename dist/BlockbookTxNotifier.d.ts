import 'url-polyfill';
import { BehaviorSubject, Subject } from 'rxjs';
export declare class BlockbookTxNotifier {
    private bbUrl;
    private bbRestUrl;
    private address;
    private preventFetchOnStart;
    private socket;
    private unconfirmedTxs;
    private useHttp;
    private preventLog;
    private checkCancelledInterval;
    private CANCELLED_INTERVAL_MS;
    connectedSubject$: BehaviorSubject<boolean>;
    txSubject$: Subject<unknown>;
    constructor(props: any);
    private log;
    private getHashblockUrl;
    private getTxUrl;
    private connect;
    disconnect(): void;
    isConnected(): any;
    private subscribeToTxs;
    private checkCancelledTx;
    private subscribeToBlockhash;
    getUnconfirmedTxs(): void;
}
