import { Injectable, OnDestroy } from '@angular/core';
import BlockbookTxNotifiers from "./BlockbookTxNotifier";
import { BlockbookTxNotifierConfigService } from "./BlockbookTxNotifierConfig.service";
import { BlockbookTxNotifiersConstructorProps } from "./index";

@Injectable()
export class BlockbookTxNotifierService implements OnDestroy {
  private txNotifs: BlockbookTxNotifiers;
  public config: BlockbookTxNotifiersConstructorProps;

  constructor(private configService: BlockbookTxNotifierConfigService) {
    this.configService.configComplete.subscribe(config => {
      if (!config) return;
      this.config = config;
      this.txNotifs = new BlockbookTxNotifiers({ url: config.url, address: config.address});
    });
  }

  ngOnDestroy() {
    this.configService.configComplete.unsubscribe();
  }

  txSubject() {
    return this.txNotifs.txSubject$;
  }

  statusSubject() {
    return this.txNotifs.statusSubject$;
  }
}