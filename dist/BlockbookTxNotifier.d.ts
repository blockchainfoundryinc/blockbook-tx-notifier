import 'url-polyfill';
import { Subject } from 'rxjs';
export declare class BlockbookTxNotifier {
    private bbUrl;
    private address;
    private preventFetchOnStart;
    private socket;
    private unconfirmedTxs;
    private useHttp;
    statusSubject$: Subject<unknown>;
    txSubject$: Subject<unknown>;
    constructor(props: any);
    private getHashblockUrl;
    private connect;
    disconnect(): void;
    isConnected(): any;
    private subscribeToTxs;
    private subscribeToBlockhash;
    getUnconfirmedTxs(): void;
}