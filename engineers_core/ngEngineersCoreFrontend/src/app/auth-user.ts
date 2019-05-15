export class AuthUser {
  id: number;
  accountName: string;
  email: string;
  password: string;

  constructor(id: number, accountName: string, email: string) {
    this.id = id;
    this.accountName = accountName;
    this.email = email;
  }
}
