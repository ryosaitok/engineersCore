import {User} from '../user/user';
import {Book} from '../book/book';

export class BookComment {
  id: number;
  user: User;
  book: Book;
  commentText: string;
  commentDate: string;
  tweetFlag: boolean;
  favoriteUserIds: number[];
  favoriteUserCount: number;
  replyUserIds: number[];
  replyUserCount: number;

  constructor(id: number, user: User, book: Book, commentText: string, commentDate: string, tweetFlag: boolean,
              favoriteUserIds: number[], favoriteUserCount: number, replyUserIds: number[], replyUserCount: number) {
    this.id = id;
    this.user = user;
    this.book = book;
    this.commentText = commentText;
    this.commentDate = commentDate;
    this.tweetFlag = tweetFlag;
    this.favoriteUserIds = favoriteUserIds;
    this.favoriteUserCount = favoriteUserCount;
    this.replyUserIds = replyUserIds;
    this.replyUserCount = replyUserCount;
  }
}
