export class OrderProduct {
  constructor(
    public id: number,
    public Order_id: number,
    public Product_id: number,
    public Quantity: number
  ) {}
}
