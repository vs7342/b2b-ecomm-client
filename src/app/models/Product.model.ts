export class Product {
  constructor(
    public id: number,
    public Name: string,
    public Short_Description: string,
    public Detail_Description: string,
    public Price: number,
    public Image_Url: string,
    public Quantity: number,
    public Minimum_Quantity_Threshold: number
  ) {}
}
