import TxRealtimeNotifications from '../../src/TxRealtimeNotifications';
import * as socketio from 'socket.io';

describe('TxRealtimeNotifications test', () => {
  const app = require('http').createServer();
  const io = socketio(app);
  const PORT = 4448;
  const exampleConfig = {
    url: 'http://localhost:' + PORT,
    address: 'test_address',
    preventFetchOnStart: true
  };

  io.on('connection', (socket) => {
    socket.on('message', (msg, answer) => {
      if (msg.method === 'getAddressHistory') {
        return answer({ result: { items: ['test_tx_1', 'test_tx_2'] } })
      } else if (msg.method === 'getDetailedTransaction') {
        return answer(msg.params);
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

  it('$statusSubject should fire "connected" / "disconnected"', (cb) => {
    const txNotif = new TxRealtimeNotifications(exampleConfig);
    
    txNotif.$statusSubject.subscribe(status => {
      if (txNotif.isConnected()) {
        expect(status).toEqual('connected');
        txNotif.disconnect();
      } else {
        expect(status).toEqual('disconnected');
        cb();
      }
    });
  });

  it('getUnconfirmedTxs() should push unconfirmed txs to $txSubject', (cb) => {
    const txNotif = new TxRealtimeNotifications({ ...exampleConfig, preventFetchOnStart: false });
    
    txNotif.$txSubject.subscribe(txs => {
      expect(txs[0]).toBe('test_tx_1');
      expect(txs[1]).toBe('test_tx_2');
      txNotif.disconnect();
      cb();
    });
  });

  it('subscribeToTxs should push to $txSubject on new txs', (cb) => {
    const txNotif = new TxRealtimeNotifications(exampleConfig);
    
    txNotif.$txSubject.subscribe(txs => {
      expect(txs[0]).toEqual('second_tx_test');
      txNotif.disconnect();
      cb();
    });

    setTimeout(() => {
      io.emit('bitcoind/addresstxid', { txid: 'second_tx_test', address: 'test_address' });
    }, 1000);
  });
});
