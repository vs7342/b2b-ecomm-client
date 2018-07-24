export class User {
  constructor(
    public id: number,
    public Email: string,
    public UserType_id: number,
    public Password: string,
    public First_Name: string,
    public Last_Name: string,
    public Mobile_Number: string,
    public FCM_token: string,
    public Is_Enabled: boolean
  ) {}
}
