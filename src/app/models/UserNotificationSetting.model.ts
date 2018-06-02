export class UserNotificationSetting {
  constructor(
    public id: number,
    public User_id: number,
    public Desktop: boolean,
    public SMS: boolean,
    public Email: boolean
  ) {}
}
