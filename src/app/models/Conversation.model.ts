export class Conversation {
  constructor(
    public id: number,
    public Customer_Service_User_id: number,
    public Customer_User_id: number,
    public Is_Finished: boolean,
    public Created_At: string
  ) {}
}
