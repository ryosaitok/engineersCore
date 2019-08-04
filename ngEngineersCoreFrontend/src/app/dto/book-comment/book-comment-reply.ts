import {User} from '../user/user';

export class BookCommentReply {
  bookCommentReplyId: number;
  user: User;
  bookCommentId: number;
  commentText: string;
  commentDate: Date;
  tweetFlag: boolean;
  favoriteUserIds: number[];
  favoriteUserCount: number;
  reportUserIds: number[];

  constructor(bookCommentReplyId: number, user: User, bookCommentId: number, commentText: string, commentDate: Date, tweetFlag: boolean,
              favoriteUsers: number[], favoriteUserCount: number, reportUserIds: number[]) {
    this.bookCommentReplyId = bookCommentReplyId;
    this.user = user;
    this.bookCommentId = bookCommentId;
    this.commentText = commentText;
    this.commentDate = commentDate;
    this.tweetFlag = tweetFlag;
    this.favoriteUserIds = favoriteUsers;
    this.favoriteUserCount = favoriteUserCount;
    this.reportUserIds = reportUserIds;
  }
}
