import {User} from '../user/user';
import {Book} from '../book/book';

export class InterestedBook {
  id: number;
  user: User;
  book: Book;
  interestedDate: Date;

  constructor(id: number, user: User, book: Book, interestedDate: Date) {
    this.id = id;
    this.user = user;
    this.book = book;
    this.interestedDate = interestedDate;
  }
}
