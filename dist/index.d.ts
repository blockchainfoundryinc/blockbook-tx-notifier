export * from './BlockbookTxNotifier';
export * from './BlockbookTxNotifier.service';
export * from './BlockbookTxNotifierConfig.service';
export interface AddressTxid {
    txid: string;
    address: string;
}
export interface BlockbookTxNotifiersConstructorProps {
    url: string;
    address: string;
}
