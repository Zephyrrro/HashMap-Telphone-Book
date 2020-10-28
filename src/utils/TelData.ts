import { TelProps } from "./types";

export default class TelData {
  phone: string;
  user: string;
  address: string;

  constructor(props: TelProps) {
    const { phone, user, address } = props;
    this.phone = phone;
    this.user = user;
    this.address = address;
  }
}
