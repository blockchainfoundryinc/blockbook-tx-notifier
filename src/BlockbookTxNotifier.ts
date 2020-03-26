import * as io from 'socket.io-client';
import axios from 'axios';
import 'url-polyfill';
import { Subject } from 'rxjs';
import {
  AddressTxid
} from './index';

export class BlockbookTxNotifier {
  private bbUrl = '';
  private address;
  private preventFetchOnStart;
  private socket;
  private unconfirmedTxs = [];
  private useHttp;
  public statusSubject$ = new Subject();
  public txSubject$ = new Subject();

  constructor(props) {
    if (!props.url || !props.address) {
      throw new Error('Missing required parameter.');
    }

    this.bbUrl = props.url;
    this.address = props.address;
    this.preventFetchOnStart = !!props.preventFetchOnStart;
    this.useHttp = !!props.useHttp;

    this.connect();
  }

  private getHashblockUrl(hash) {
    const url = new URL(this.bbUrl);
    url.protocol = this.useHttp ? 'http' : 'https';
    url.pathname = `/api/v2/block/${hash}`;

    return url.toString();
  }

  private getTxUrl(txid) {
    const url = new URL(this.bbUrl);
    url.protocol = this.useHttp ? 'http' : 'https';
    url.pathname = `/api/v2/tx/${txid}`;

    return url.toString()
  }

  private connect() {
    this.socket = io.connect(this.bbUrl, { transports: ['websocket'] });

    this.socket.on('connect', () => {
      this.statusSubject$.next('connected')
      this.subscribeToTxs();
      this.subscribeToBlockhash();

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

  private subscribeToTxs() {
    this.socket.emit('subscribe', 'bitcoind/addresstxid', Array.isArray(this.address) ? this.address : [this.address]);

    this.socket.on('bitcoind/addresstxid', async (tx: AddressTxid) => {
      let txDetails;

      try {
        txDetails = await axios.get(this.getTxUrl(tx.txid));
        console.log(tx)
        txDetails = txDetails.data;
      } catch(err) {
        console.error(err);
        return;
      }

      const parsedTx = {
        txid: tx.txid,
        confirmed: false,
        tx: txDetails
      };
      this.txSubject$.next(parsedTx);
      this.unconfirmedTxs.push(parsedTx);
    });
  }
  
  private subscribeToBlockhash() {
    this.socket.emit('subscribe', 'bitcoind/hashblock');
    this.socket.on('bitcoind/hashblock', async (hash) => {
      let block;
      let txDetails;

      try {
        block = await axios.get(this.getHashblockUrl(hash));
        block = block.data;
      } catch(err) {
        console.error(err);
        return;
      }

      const txsInBlock = block.txs;

      const newUnconfirmedTxs = [];
      this.unconfirmedTxs.forEach(async tx => {
        const utxidIndex = txsInBlock.findIndex((txInBlock) => txInBlock.txid === tx.txid);

        if (utxidIndex !== -1) {
          try {
            txDetails = await axios.get(this.getTxUrl(tx.txid));
            txDetails = txDetails.data;
          } catch(err) {
            console.error(err);
            return;
          }

          this.txSubject$.next({
            txid: txDetails.txid,
            confirmed: true,
            tx: txDetails
          });
        } else {
          newUnconfirmedTxs.push(tx);
        }
      });

      this.unconfirmedTxs = newUnconfirmedTxs;
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
      res.result.items.forEach(async tx => {
        let txDetails;

        try {
          txDetails = await axios.get(this.getTxUrl(tx.txid));
          txDetails = txDetails.data;
        } catch(err) {
          console.error(err);
          return
        }

        const parsedTx = {
          txid: tx.txid,
          confirmed: false,
          tx: txDetails
        };

        this.txSubject$.next(parsedTx);
        this.unconfirmedTxs.push(parsedTx);
      });
    });
  }
}
