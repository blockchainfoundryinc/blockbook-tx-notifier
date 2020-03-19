import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { BlockbookTxNotifiersConstructorProps } from "./index";

@Injectable()
export class BlockbookTxNotifierConfigService {
  public url: string;
  public address: string;
  public configComplete: BehaviorSubject<BlockbookTxNotifiersConstructorProps> = new BehaviorSubject(null);

  constructor() {
  }

  configure(url, address) {
    this.url = url;
    this.address = address;
    this.configComplete.next({ url: this.url, address: this.address });
  }
}