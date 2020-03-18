import { Injectable, OnDestroy } from '@angular/core';
import TxRealtimeNotifications from "./TxRealtimeNotifications";
import { TxRealtimeNotificationsConfigService } from "./TxRealtimeNotificationsConfig.service";
import { TxRealtimeNotificationsConstructorProps } from "./index";

@Injectable()
export class TxRealtimeNotificationsService implements OnDestroy {
  private txNotifs: TxRealtimeNotifications;
  public config: TxRealtimeNotificationsConstructorProps;

  constructor(private configService: TxRealtimeNotificationsConfigService) {
    this.configService.configComplete.subscribe(config => {
      if (!config) return;
      this.config = config;
      this.txNotifs = new TxRealtimeNotifications({ url: config.url, address: config.address});
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