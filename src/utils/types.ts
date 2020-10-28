import TelData from "./TelData";

export interface TelProps {
  phone: string;
  user: string;
  address: string;
}

export interface HashItem {
  keyType: KeyType;
  key: string;
  value: TelData;
}

export interface TableItem {
  keyType: KeyType;
  key: string;
  user: string;
  phone: string;
  address: string;
}

export interface ModalProps {
  visible: boolean;
  onClose: Function;
}

export interface SearchModalState {
  keyType: KeyType;
  placeholder: string;
  searchText: string;
  searchResult: Array<TableItem>;
  searchLength: number;
  popVisible: boolean;
}

export interface CreateModalState extends TelProps {
  keyType: KeyType;
}

export type KeyType = "user" | "phone";
