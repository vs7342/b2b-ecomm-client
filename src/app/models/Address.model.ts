export class Address {
  constructor(
    public id: number,
    public User_id: number,
    public Address_Line_1: string,
    public Address_Line_2: string,
    public City: string,
    public State: string,
    public Pincode: string
  ) {}
}
