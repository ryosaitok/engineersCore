import {User} from '../user/user';

export class ShelfCommentReply {
  shelfCommentReplyId: number;
  user: User;
  shelfCommentId: number;
  commentText: string;
  commentDate: Date;
  tweetFlag: boolean;
  favoriteUserIds: number[];
  favoriteUserCount: number;
  reportUserIds: number[];

  constructor(shelfCommentReplyId: number, user: User, shelfCommentId: number, commentText: string, commentDate: Date, tweetFlag: boolean,
              favoriteUsers: number[], favoriteUserCount: number, reportUserIds: number[]) {
    this.shelfCommentReplyId = shelfCommentReplyId;
    this.user = user;
    this.shelfCommentId = shelfCommentId;
    this.commentText = commentText;
    this.commentDate = commentDate;
    this.tweetFlag = tweetFlag;
    this.favoriteUserIds = favoriteUsers;
    this.favoriteUserCount = favoriteUserCount;
    this.reportUserIds = reportUserIds;
  }
}
