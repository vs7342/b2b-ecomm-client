export class Alert {
  constructor(
    public id: number,
    public User_id: number,
    public Product_id: number,
    public Is_Triggered: boolean,
    public Created_At: string,
    public Triggered_At: string
  ) {}
}
