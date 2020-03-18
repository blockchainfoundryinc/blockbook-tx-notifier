import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { TxRealtimeNotificationsConstructorProps } from "./index";

@Injectable()
export class TxRealtimeNotificationsConfigService {
  public url: string;
  public address: string;
  public configComplete: BehaviorSubject<TxRealtimeNotificationsConstructorProps> = new BehaviorSubject(null);

  constructor() {
  }

  configure(url, address) {
    this.url = url;
    this.address = address;
    this.configComplete.next({ url: this.url, address: this.address });
  }
}