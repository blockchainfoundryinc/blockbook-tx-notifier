export interface AddressTxid {
    txid: string;
    address: string;
}
export interface BlockbookTxNotifiersConstructorProps {
    url: string;
    address: string;
    restUrl?: string;
}
