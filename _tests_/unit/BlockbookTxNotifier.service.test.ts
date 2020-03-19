import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { BlockbookTxNotifierConfigService, BlockbookTxNotifierService } from '../../dist';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

describe('Service: BlockbookTxNotifier', () => {
  let service, config;

  beforeEach(() => {
    TestBed.resetTestEnvironment();
    TestBed.initTestEnvironment(BrowserDynamicTestingModule,
      platformBrowserDynamicTesting());

    TestBed.configureTestingModule({
      providers: [
        BlockbookTxNotifierConfigService,
        BlockbookTxNotifierService
      ]
    });

    config = TestBed.get(BlockbookTxNotifierConfigService);
    service = TestBed.get(BlockbookTxNotifierService);
    config.configure('test', 'test');
  });

  it('Configuring the config service should trigger the websocket service to init', () => {
    expect(service.config).toEqual({ url: 'test', address: 'test' });
  });

  it('txSubject is defined after config', () => {
    expect(service.txSubject()).toBeDefined()
  });

  it('statusSubject is defined after config', () => {
    expect(service.statusSubject()).toBeDefined()
  });
});