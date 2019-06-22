import {User} from '../user/user';

export class ShelfComment {
  shelfCommentId: number;
  user: User;
  shelfId: number;
  commentText: string;
  commentDate: Date;
  tweetFlag: boolean;
  favoriteUserIds: number[];
  favoriteUserCount: number;
  replyUserIds: number[];
  replyUserCount: number;

  constructor(shelfCommentId: number, user: User, shelfId: number, commentText: string, commentDate: Date, tweetFlag: boolean,
              favoriteUsers: number[], favoriteUserCount: number, replyUserIds: number[], replyUserCount: number) {
    this.shelfCommentId = shelfCommentId;
    this.user = user;
    this.shelfId = shelfId;
    this.commentText = commentText;
    this.commentDate = commentDate;
    this.tweetFlag = tweetFlag;
    this.favoriteUserIds = favoriteUsers;
    this.favoriteUserCount = favoriteUserCount;
    this.replyUserIds = replyUserIds;
    this.replyUserCount = replyUserCount;
  }
}
