export * from './TxRealtimeNotifications';
export * from './TxRealtimeNotifications.service';
export * from './TxRealtimeNotificationsConfig.service';

export interface AddressTxid {
  txid: string,
  address: string
}

export interface TxRealtimeNotificationsConstructorProps {
  url: string;
  address: string;
}