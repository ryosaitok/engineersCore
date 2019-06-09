import {User} from './user';
import {Book} from './book';

export class Shelf {
  shelfId: number;
  user: User;
  books: Book[];
  shelfCd: string;
  shelfName: string;
  displayOrder: number;
  shelfStatus: string;
  description: string;
  favoriteUserIds: number[];
  commentUserIds: number[];

  constructor(shelfId: number, user: User, books: Book[], shelfCd: string, shelfName: string, displayOrder: number,
              shelfStatus: string, description: string, favoriteUserIds: number[], commentUserIds: number[]) {
    this.shelfId = shelfId;
    this.user = user;
    this.books = books;
    this.shelfCd = shelfCd;
    this.shelfName = shelfName;
    this.displayOrder = displayOrder;
    this.shelfStatus = shelfStatus;
    this.description = description;
    this.favoriteUserIds = favoriteUserIds;
    this.commentUserIds = commentUserIds;
  }
}
