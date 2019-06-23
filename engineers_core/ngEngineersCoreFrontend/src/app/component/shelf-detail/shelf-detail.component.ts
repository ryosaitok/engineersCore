import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard';
import {
  faBookReader,
  faCaretDown,
  faCommentDots,
  faExclamationTriangle,
  faHeart
} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {Shelf} from '../../dto/shelf/shelf';
import {ShelfComment} from '../../dto/shelf-comment/shelf-comment';
import {ShelfService} from '../../service/shelf/shelf.service';
import {ShelfFavoriteService} from '../../service/shelf-favorite/shelf-favorite.service';
import {ShelfCommentService} from '../../service/shelf-comment/shelf-comment.service';
import {ShelfCommentFavoriteService} from '../../service/shelf-comment-favorite/shelf-comment-favorite.service';
import {ShelfCommentReplyService} from '../../service/shelf-comment-reply/shelf-comment-reply.service';
import {ShelfCommentReplyFavoriteService} from '../../service/shelf-comment-reply-favorite/shelf-comment-reply-favorite.service';

@Component({
  selector: 'app-shelf-detail',
  templateUrl: './shelf-detail.component.html',
  styleUrls: ['./shelf-detail.component.css']
})
export class ShelfDetailComponent implements OnInit {

  shelfId = Number(this.route.snapshot.paramMap.get('shelfId'));
  shelf: Shelf;
  shelfBookCount: number;
  shelfComments: ShelfComment[];
  shelfCommentCount: number;

  faBookReader = faBookReader;
  faHeart = faHeart;
  faCommentDots = faCommentDots;
  faCaretDown = faCaretDown;
  faExclamationTriangle = faExclamationTriangle;

  constructor(
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private shelfService: ShelfService,
    private shelfCommentService: ShelfCommentService,
    private shelfFavoriteService: ShelfFavoriteService,
    private shelfCommentFavoriteService: ShelfCommentFavoriteService,
    private shelfCommentReplyService: ShelfCommentReplyService,
    private shelfCommentReplyFavoriteService: ShelfCommentReplyFavoriteService,
  ) {
  }

  ngOnInit() {
    this.getShelf();
    this.getShelfComments();
  }

  getShelf(): void {
    this.shelfService.getShelf(this.shelfId).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.shelf = this.shelfService.convertShelf(res, 20);
        this.shelfBookCount = Object.keys(this.shelf.books).length;
      }
    });
  }

  getShelfComments(): void {
    this.shelfCommentService.getShelfCommentsByShelfId(this.shelfId).subscribe(data => {
      if (data.results !== undefined && data.results !== null && data.count !== 0) {
        const shelfComments = data.results;
        this.shelfComments = this.shelfCommentService.convertShelfComments(shelfComments);
        this.shelfCommentCount = data.count;
      }
    });
  }

  shelfFavorite(shelfId: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfFavoriteService.getShelfFavorite(loggedInUserId, shelfId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.shelfFavoriteService.registerShelfFavorite(loggedInUserId, shelfId).subscribe(
          (res) => {
            this.shelf.favoriteUserIds.push(loggedInUserId);
            this.shelf.favoriteUserCount += 1;
          },
          (error) => {
            console.error('shelfFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('shelfFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'shelfId: ' + shelfId);
      }
    });
  }

  undoShelfFavorite(shelfId: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfFavoriteService.getShelfFavorite(loggedInUserId, shelfId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.shelfFavoriteService.deleteShelfFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.shelf.favoriteUserIds.indexOf(loggedInUserId);
            this.shelf.favoriteUserIds.splice(userIdIndex, 1);
            this.shelf.favoriteUserCount -= 1;
          },
          (error) => {
            console.log('undoShelfFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。shelfId ' + shelfId);
      }
    });
  }

  registerComment(f: NgForm) {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const comment = f.value.comment;
    // const tweetFlag = f.value.tweetFlag;
    const tweetFlag = false;
    this.shelfCommentService.registerShelfComment(this.appComponent.userId, this.shelf.shelfId, comment, tweetFlag).subscribe(res => {
      this.shelfCommentService.getShelfComment(res.id).subscribe(response => {
        if (response.id !== undefined) {
          const shelfComment = this.shelfCommentService.convertShelfComment(response);
          this.shelfComments.unshift(shelfComment);
          this.shelfCommentCount += 1;
        }
      });
    });
  }

  deleteComment(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.shelfCommentService.deleteShelfComment(commentId).subscribe(res => {
      this.shelfComments.splice(index, 1);
      this.shelfCommentCount -= 1;
    }, error => {
      console.error('deleteCommentでエラー: ', error);
    });
  }

  reportComment(commentId: number, reasonCode: string, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.shelfCommentService.reportComment(this.appComponent.userId, commentId, reasonCode).subscribe(res => {
      // 報告済みマークつける
      this.shelfComments[index].reportUserIds.push(this.appComponent.userId);
    }, error => {
      console.error('reportCommentでエラー: ', error);
    });
  }

  commentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfCommentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.shelfCommentFavoriteService.registerCommentFavorite(loggedInUserId, commentId).subscribe(
          (res) => {
            this.shelfComments[index].favoriteUserIds.push(loggedInUserId);
            this.shelfComments[index].favoriteUserCount += 1;
          },
          (error) => {
            console.error('commentFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('commentFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'commentId: ' + commentId);
      }
    });
  }

  notCommentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfCommentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.shelfCommentFavoriteService.deleteCommentFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.shelfComments[index].favoriteUserIds.indexOf(loggedInUserId);
            this.shelfComments[index].favoriteUserIds.splice(userIdIndex, 1);
            this.shelfComments[index].favoriteUserCount -= 1;
          },
          (error) => {
            console.log('notCommentFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。commentId ' + commentId);
      }
    });
  }

  reverseRepliesDisplayState(shelfCommentId: number, commentIndex: number, page: number): void {
    // 表示中に呼ばれた場合には非表示、非表示中に呼ばれた場合には表示
    this.shelfComments[commentIndex].displayedReply = !this.shelfComments[commentIndex].displayedReply;
    this.shelfCommentReplyService.getCommentRepliesPagingByCommentId(shelfCommentId, page).subscribe(data => {
      if (data.count > 0) {
        this.shelfComments[commentIndex].commentReplies = this.shelfCommentReplyService.convertShelfCommentReplies(data.results);
      }
    }, error => {
      console.error('displayRepliesでエラー: ', error);
    });
  }

  registerReply(f: NgForm, commentId: number, commentIndex: number) {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const comment = f.value.comment;
    // const tweetFlag = f.value.tweetFlag;
    const tweetFlag = false;
    console.log('registerReply。comment: ' + comment + 'commentId: ' + commentId + 'commentIndex: ' + commentIndex);
    this.shelfCommentReplyService.registerCommentReply(this.appComponent.userId, commentId, comment, tweetFlag).subscribe(res => {
      this.shelfCommentReplyService.getCommentReply(res.id).subscribe(response => {
        console.log('JSON.stringify(res): ', JSON.stringify(response));
        if (response.id !== undefined) {
          console.log('response: ', response);
          const shelfCommentReply = this.shelfCommentReplyService.convertShelfCommentReply(response);
          console.log('shelfCommentReply: ', shelfCommentReply);
          this.shelfComments[commentIndex].commentReplies.unshift(shelfCommentReply);
          this.shelfComments[commentIndex].replyUserCount += 1;
        }
      });
    });
  }

  deleteReply(commentReplyId: number, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.shelfCommentReplyService.deleteCommentReply(commentReplyId).subscribe(res => {
      this.shelfComments[commentIndex].commentReplies.splice(replyIndex, 1);
      this.shelfComments[commentIndex].replyUserCount -= 1;
    }, error => {
      console.error('deleteReplyでエラー: ', error);
    });
  }

  reportReply(commentReplyId: number, reasonCode: string, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.shelfCommentReplyService.reportReply(this.appComponent.userId, commentReplyId, reasonCode).subscribe(res => {
      // 報告済みマークつける
      this.shelfComments[commentIndex].commentReplies[replyIndex].reportUserIds.push(this.appComponent.userId);
    }, error => {
      console.error('reportReplyでエラー: ', error);
    });
  }

  replyFavorite(commentReplyId: number, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfCommentReplyFavoriteService.getReplyFavorite(loggedInUserId, commentReplyId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.shelfCommentReplyFavoriteService.registerReplyFavorite(loggedInUserId, commentReplyId).subscribe(
          (res) => {
            this.shelfComments[commentIndex].commentReplies[replyIndex].favoriteUserIds.push(loggedInUserId);
            this.shelfComments[commentIndex].commentReplies[replyIndex].favoriteUserCount += 1;
          },
          (error) => {
            console.error('replyFavoriteでerror: ' + JSON.stringify(error));
          }
        );
      } else {
        console.error('replyFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'commentReplyId: ' + commentReplyId);
      }
    });
  }

  notReplyFavorite(commentReplyId: number, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfCommentReplyFavoriteService.getReplyFavorite(loggedInUserId, commentReplyId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.shelfCommentReplyFavoriteService.deleteReplyFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.shelfComments[commentIndex].commentReplies[replyIndex].favoriteUserIds.indexOf(loggedInUserId);
            this.shelfComments[commentIndex].commentReplies[replyIndex].favoriteUserIds.splice(userIdIndex, 1);
            this.shelfComments[commentIndex].commentReplies[replyIndex].favoriteUserCount -= 1;
          },
          (error) => {
            console.log('notReplyFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。commentReplyId: ' + commentReplyId);
      }
    });
  }

  scrollToComment(id: string): void {
    document.getElementById(id).scrollIntoView({block: 'center', behavior: 'smooth'});
  }
}
