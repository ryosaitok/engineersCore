import {User} from '../user/user';
import {Book} from '../book/book';
import {BookCommentReply} from './book-comment-reply';

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
  reportUserIds: number[];
  commentReplies: BookCommentReply[] = [];
  displayedReply: boolean;

  constructor(id: number, user: User, book: Book, commentText: string, commentDate: string, tweetFlag: boolean,
              favoriteUserIds: number[], favoriteUserCount: number, replyUserIds: number[], replyUserCount: number,
              reportUserIds: number[], commentReplies: BookCommentReply[], displayedReply: boolean) {
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
    this.reportUserIds = reportUserIds;
    // API経由でデータ取得した初期値は基本的には空の配列となる。返信一覧を表示する時にデータを新しく取得してこのフィールドに追加する。
    this.commentReplies = commentReplies;
    // 返信部分を表示するかどうか。初期値は非表示。
    this.displayedReply = displayedReply;
  }
}
