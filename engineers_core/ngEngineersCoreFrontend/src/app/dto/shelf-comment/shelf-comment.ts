import {User} from '../user/user';
import {ShelfCommentReply} from './shelf-comment-reply';

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
  reportUserIds: number[];
  commentReplies: ShelfCommentReply[];
  displayedReply: boolean;

  constructor(shelfCommentId: number, user: User, shelfId: number, commentText: string, commentDate: Date, tweetFlag: boolean,
              favoriteUsers: number[], favoriteUserCount: number, replyUserIds: number[], replyUserCount: number,
              reportUserIds: number[], commentReplies: ShelfCommentReply[], displayedReply: boolean) {
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
    this.reportUserIds = reportUserIds;
    // API経由でデータ取得した初期値は基本的には空の配列となる。返信一覧を表示する時にデータを新しく取得してこのフィールドに追加する。
    this.commentReplies = commentReplies;
    // 返信部分を表示するかどうか。初期値は非表示。
    this.displayedReply = displayedReply;
  }
}
