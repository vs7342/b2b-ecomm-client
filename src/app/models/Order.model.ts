export class Order {
  constructor(
    public id: number,
    public User_id: number,
    public Shipping_Address_id: number,
    public Billing_Address_id: number,
    public StatusType_id: number,
    public Tracking_id: string,
    public Created_At: string,
    public Updated_At: string
  ) {}
}
