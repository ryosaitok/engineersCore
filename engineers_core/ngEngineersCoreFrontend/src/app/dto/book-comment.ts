import {User} from './user';
import {Book} from './book';

export class BookComment {
  id: number;
  user: User;
  book: Book;
  commentText: string;
  commentDate: string;
  tweetFlag: boolean;

  constructor(id: number, user: User, book: Book, commentText: string, commentDate: string, tweetFlag: boolean) {
    this.id = id;
    this.user = user;
    this.book = book;
    this.commentText = commentText;
    this.commentDate = commentDate;
    this.tweetFlag = tweetFlag;
  }
}
