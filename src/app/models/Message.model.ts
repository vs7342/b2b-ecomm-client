export class Message {
  constructor(
    public id: number,
    public Conversation_id: number,
    public Text: string,
    public Is_From_Customer: boolean,
    public Created_At: string
  ) {}
}
