export class SigninUser {

  id: number;
  authUserId: number;
  accountName: string;
  userName: string;
  description: string;
  profileImageLink: string;

  constructor(id: number, authUserId: number, accountName: string, userName: string, description: string, profileImageLink: string) {
    this.id = id;
    this.authUserId = authUserId;
    this.accountName = accountName;
    this.userName = userName;
    this.description = description;
    this.profileImageLink = profileImageLink;
  }
}
