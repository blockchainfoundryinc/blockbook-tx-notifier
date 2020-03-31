import { BlockbookTxNotifier } from '../../dist';
import * as socketio from 'socket.io';
//import url from 'url';

const URL = require('url');
describe('BlockbookTxNotifier test', () => {
  const mockDb = [
    { txid: 'test_tx_1', tx: { hash: 'test_hash_1' }, memPool: true },
    { txid: 'test_tx_2', tx: { hash: 'test_hash_2' }, memPool: false },
    { txid: 'test_tx_3', tx: { hash: 'test_hash_3' }, memPool: false }
  ];
  const app = require('http').createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    const query = URL.parse(req.url);

    if (query.path.indexOf('/tx') !== -1) {
      res.write(JSON.stringify(mockDb[2]));
      return res.end();  
    }

    res.write(JSON.stringify({
      txs: [mockDb[2]]
    }));
    res.end();
  });
  const io: any = socketio(app);
  const PORT = 4448;
  const exampleConfig = {
    url: 'http://localhost:' + PORT,
    address: 'test_address',
    preventFetchOnStart: true,
    preventLog: true,
    useHttp: true
  };

  io.on('connection', (socket) => {
    socket.on('message', (msg, answer) => {
      if (msg.method === 'getAddressHistory') {
        return answer({ result: { items: mockDb.filter(tx => tx.memPool) } })
      } else if (msg.method === 'getDetailedTransaction') {
        return answer(mockDb.find(tx => tx.txid === msg.params[0]));
      }
    })
  });

  beforeAll(() => {
    // Create a simple socket.io server
    app.listen(PORT);
  });

  afterAll((done) => {
    app.close(done);
  })

  it('should throw error if initialized without required params', () => {
    try {
      new BlockbookTxNotifier({})
    } catch(err) {
      expect(err.message).toEqual('Missing required parameter.');
    }
  })

  it('connectedSubject$ should fire false / true on connect / disconnect', (cb) => {
    const txNotif = new BlockbookTxNotifier(exampleConfig);
    let falseCount = 0;
    txNotif.connectedSubject$.subscribe(status => {
      if (!txNotif.isConnected()) {
        expect(status).toEqual(false);
        falseCount ++;

        if(falseCount == 2) {
          cb();
        }
      } else if (txNotif.isConnected()){
        expect(status).toEqual(true);
        txNotif.disconnect();
      }
    });
  });

  it('getUnconfirmedTxs() should push unconfirmed txs to txSubject$', (cb) => {
    const txNotif = new BlockbookTxNotifier({ ...exampleConfig, preventFetchOnStart: false });
    const mockFn = jest.fn();
    
    txNotif.txSubject$.subscribe(mockFn);

    setTimeout(() => {
      const firstCall: any = mockFn.mock.calls[0][0];
      expect(mockFn.mock.calls).toHaveLength(1);
      expect(firstCall.txid).toEqual('test_tx_1');
      txNotif.disconnect();
      cb();
    }, 1000);
  });

  it('subscribeToTxs should push to txSubject$ on new txs', (cb) => {
    const txNotif = new BlockbookTxNotifier(exampleConfig);
    const mockFn = jest.fn();
    
    txNotif.txSubject$.subscribe(mockFn);

    setTimeout(() => {
      io.emit('bitcoind/addresstxid', { txid: 'test_tx_2', address: 'test_address' });
    }, 500);

    setTimeout(() => {
      const firstCall: any = mockFn.mock.calls[0][0];
      expect(mockFn.mock.calls).toHaveLength(1);
      expect(firstCall.txid).toEqual('test_tx_2');
      txNotif.disconnect();
      cb();
    }, 1000);
  });

  it('should check for confirmed txs on new hashblock', (cb) => {
    const txNotif = new BlockbookTxNotifier({ ...exampleConfig, useHttp: true });
    const mockFn = jest.fn();

    txNotif.txSubject$.subscribe(mockFn);

    setTimeout(() => {
      io.emit('bitcoind/addresstxid', { txid: 'test_tx_3', address: 'test_address' });
    }, 500);
    setTimeout(() => {
      io.emit('bitcoind/hashblock', 'test_block_hash');
    }, 1000);

    setTimeout(() => {
      const firstCall = mockFn.mock.calls[0][0];
      const secondCall = mockFn.mock.calls[1][0];
      expect(mockFn.mock.calls).toHaveLength(2);
      expect(firstCall.confirmed).toBeFalsy();
      expect(firstCall.txid).toEqual('test_tx_3');
      expect(secondCall.confirmed).toBeTruthy();
      expect(secondCall.txid).toEqual('test_tx_3');
      txNotif.disconnect();
      cb();
    }, 2000);
  });

});
