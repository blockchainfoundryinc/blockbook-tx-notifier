import { Injectable, OnDestroy } from '@angular/core';
import { BlockbookTxNotifierConfigService } from "./BlockbookTxNotifierConfig.service";
import { BlockbookTxNotifiersConstructorProps } from "./models";
import { BlockbookTxNotifier } from "./BlockbookTxNotifier";

@Injectable()
export class BlockbookTxNotifierService implements OnDestroy {
  private txNotifs: BlockbookTxNotifier;
  public config: BlockbookTxNotifiersConstructorProps;

  constructor(private configService: BlockbookTxNotifierConfigService) {
    this.configService.configComplete.subscribe(config => {
      if (!config) return;
      this.config = config;
      this.txNotifs = new BlockbookTxNotifier({ url: config.url, address: config.address, restUrl: config.restUrl});
    });
  }

  ngOnDestroy() {
    this.configService.configComplete.unsubscribe();
  }

  txSubject() {
    return this.txNotifs.txSubject$;
  }

  connectedSubject() {
    return this.txNotifs.connectedSubject$;
  }
}