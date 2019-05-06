export class User {
  id: number;
  userName: string;
  userAccountName: string;
  description: string;
  profileImageLink: string;

  constructor(id: number, userName: string, userAccountName: string, description: string, profileImageLink: string) {
    this.id = id;
    this.userName = userName;
    this.userAccountName = userAccountName;
    this.description = description;
    this.profileImageLink = profileImageLink;
  }
}
