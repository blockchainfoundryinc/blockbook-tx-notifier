import * as io from 'socket.io-client';
import { Subject } from 'rxjs';
import {
  AddressTxid
} from './index';

export default class TxRealtimeNotification {
  private bbUrl = '';
  private address;
  private preventFetchOnStart;
  private socket;
  public statusSubject$ = new Subject();
  public txSubject$ = new Subject();

  constructor(props) {
    if (!props.url || !props.address) {
      throw new Error('Missing required parameter.');
    }

    this.bbUrl = props.url;
    this.address = props.address;
    this.preventFetchOnStart = !!props.preventFetchOnStart;

    this.connect();
  }

  private connect() {
    this.socket = io.connect(this.bbUrl);

    this.socket.on('connect', () => {
      this.statusSubject$.next('connected')
      this.subscribeToTxs();

      if (!this.preventFetchOnStart) {
        this.getUnconfirmedTxs();
      }
    });
    this.socket.on('disconnect', () => this.statusSubject$.next('disconnected'));
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public isConnected() {
    return this.socket.connected;
  }

  public subscribeToTxs() {
    this.socket.emit('subscribe', 'bitcoind/addresstxid', Array.isArray(this.address) ? this.address : [this.address]);

    this.socket.on('bitcoind/addresstxid', (tx: AddressTxid) => {
      const opts = {
        method: 'getDetailedTransaction',
        params: [tx.txid]
      };
      this.socket.send(opts, (tx) => this.txSubject$.next(Array.isArray(tx) ? tx : [tx]));
    })
  }

  public getUnconfirmedTxs() {
    const opts = {
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

    this.socket.send(opts, (res) => {
      this.txSubject$.next(res.result.items);
    });
  }
}
