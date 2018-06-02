export class Message {
  constructor(
    public id: number,
    public From_User_id: number,
    public To_User_id: number,
    public Text: string,
    public Created_At: string
  ) {}
}
