import {ActivatedRoute, Router} from '@angular/router';
import {Component, Input, OnInit} from '@angular/core';
import {AuthGuard} from '../../guard/auth.guard';
import {NgForm} from '@angular/forms';
import {
  faCommentDots,
  faHeart,
  faUser,
  faBook,
  faBookReader,
  faCaretDown,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {InterestedBook} from '../../dto/interested-book/interested-book';
import {BookComment} from '../../dto/book-comment/book-comment';
import {User} from '../../dto/user/user';
import {Shelf} from '../../dto/shelf/shelf';
import {UserService} from '../../service/user/user.service';
import {BookCommentService} from '../../service/book-comment/book-comment.service';
import {InterestedBookService} from '../../service/interested-book/interested-book.service';
import {CommentFavoriteService} from '../../service/comment-favorite/comment-favorite.service';
import {SigninService} from '../../service/signin/signin.service';
import {ShelfService} from '../../service/shelf/shelf.service';
import {ShelfFavoriteService} from '../../service/shelf-favorite/shelf-favorite.service';
import {BookCommentReplyService} from '../../service/book-comment-reply/book-comment-reply.service';
import {BookCommentReplyFavoriteService} from '../../service/book-comment-reply-favorite/book-comment-reply-favorite.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {

  webHost = environment.webUrl;
  faHeart = faHeart;
  faCommentDots = faCommentDots;
  faUser = faUser;
  faBook = faBook;
  faBookReader = faBookReader;
  faCaretDown = faCaretDown;
  faExclamationTriangle = faExclamationTriangle;

  pageFound = true;
  accountName = this.route.snapshot.paramMap.get('accountName');
  @Input() user: User;
  shelves: Shelf[] = [];
  shelfCount = 0;
  bookComments: BookComment[] = [];
  bookCommentCount = 0;
  interestedBooks: InterestedBook[] = [];
  interestedBookCount = 0;
  favoriteCommentCount = 0;
  knowledgeScore: number;
  shelfSelected = 'selected';
  readBookSelected = '';
  interestedBookSelected = '';
  favoriteCommentSelected = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private signinService: SigninService,
    private userService: UserService,
    private shelfService: ShelfService,
    private shelfFavoriteService: ShelfFavoriteService,
    private bookCommentService: BookCommentService,
    private commentFavoriteService: CommentFavoriteService,
    private bookCommentReplyService: BookCommentReplyService,
    private interestedBookService: InterestedBookService,
    private bookCommentReplyFavoriteService: BookCommentReplyFavoriteService,
  ) {
  }

  ngOnInit() {
    this.getLoginUser();
    this.getUser();
    this.getShelves();
    this.getReadBookCommentCount();
    this.getInterestedBookCount();
    this.getFavoriteCommentCount();
  }

  getLoginUser(): void {
    this.signinService.getAuthUser().subscribe(response => {
      this.userService.getUser(response.account_name).subscribe(res => {
        this.appComponent.userId = res.id;
        this.appComponent.accountName = res.account_name;
        this.appComponent.userName = res.user_name;
        this.appComponent.profileImageLink = res.profile_image_link;
        this.appComponent.isLoggedIn = true;
      });
    }, error => {
      this.appComponent.userId = null;
      this.appComponent.accountName = null;
      this.appComponent.userName = null;
      this.appComponent.profileImageLink = null;
      this.appComponent.isLoggedIn = false;
    });
  }

  getUser(): void {
    this.userService.getUser(this.accountName).subscribe(response => {
      this.user = new User(response.id, response.user_name, response.account_name, response.description, response.profile_image_link);
    }, error => {
      this.pageFound = false;
    });
  }

  getShelves(): void {
    this.shelfService.getShelvesByAccountName(this.accountName).subscribe(data => {
      this.shelfCount = data.count;
      if (this.shelfCount > 0) {
        this.shelves = this.shelfService.convertShelves(data.results, 5);
      }
    });
    this.shelfSelected = 'selected';
    this.readBookSelected = '';
    this.interestedBookSelected = '';
    this.favoriteCommentSelected = '';
  }

  getReadBookComments(): void {
    this.bookCommentService.getBookCommentsByAccountName(this.accountName).subscribe(data => {
      this.bookCommentCount = data.count;
      if (data.count > 0) {
        this.bookComments = this.bookCommentService.convertBookComments(data.results);
      }
      this.knowledgeScore = 0;
      data.results.forEach(res => {
        this.knowledgeScore = this.knowledgeScore + res.book.offer_price;
      });
    });
    this.shelfSelected = '';
    this.readBookSelected = 'selected';
    this.interestedBookSelected = '';
    this.favoriteCommentSelected = '';
  }

  getInterestedBooks(): void {
    this.interestedBookService.getInterestedBookByAccountName(this.accountName).subscribe(data => {
      this.interestedBookCount = data.count;
      if (this.interestedBookCount > 0) {
        this.interestedBooks = this.interestedBookService.convertInterestedBooks(data.results);
      }
    });
    this.shelfSelected = '';
    this.readBookSelected = '';
    this.interestedBookSelected = 'selected';
    this.favoriteCommentSelected = '';
  }

  getFavoriteBookComments(): void {
    this.commentFavoriteService.getCommentFavoritesByAccountName(this.accountName).subscribe(data => {
      this.favoriteCommentCount = data.count;
      if (data.count > 0) {
        const comments = [];
        data.results.forEach(favorite => {
          comments.push(favorite.comment);
        });
        this.bookComments = this.bookCommentService.convertBookComments(comments);
      }
    });
    this.shelfSelected = '';
    this.readBookSelected = '';
    this.interestedBookSelected = '';
    this.favoriteCommentSelected = 'selected';
  }

  // TODO: ryo.saito countのAPIに切り替える
  getReadBookCommentCount(): void {
    this.bookCommentService.getBookCommentsByAccountName(this.accountName).subscribe(data => {
      this.bookCommentCount = data.count;
    });
  }

  // TODO: ryo.saito countのAPIに切り替える
  getInterestedBookCount(): void {
    this.interestedBookService.getInterestedBookByAccountName(this.accountName).subscribe(data => {
      this.interestedBookCount = data.count;
    });
  }

  // TODO: ryo.saito countのAPIに切り替える
  getFavoriteCommentCount(): void {
    this.commentFavoriteService.getCommentFavoritesByAccountName(this.accountName).subscribe(data => {
      this.favoriteCommentCount = data.count;
    });
  }

  shelfFavorite(shelfId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfFavoriteService.getShelfFavorite(loggedInUserId, shelfId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.shelfFavoriteService.registerShelfFavorite(loggedInUserId, shelfId).subscribe(
          (res) => {
            this.shelves[index].favoriteUserIds.push(loggedInUserId);
            this.shelves[index].favoriteUserCount += 1;
          },
          (error) => {
            // error
          }
        );
      } else {
        // error
      }
    }, e => {
      // error
    });
  }

  undoShelfFavorite(shelfId: number, index: number): void {
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
            const userIdIndex = this.shelves[index].favoriteUserIds.indexOf(loggedInUserId);
            this.shelves[index].favoriteUserIds.splice(userIdIndex, 1);
            this.shelves[index].favoriteUserCount -= 1;
          },
          (error) => {
            // error
          }
        );
      } else {
        // error
      }
    });
  }

  commentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.commentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.commentFavoriteService.registerCommentFavorite(loggedInUserId, commentId).subscribe(
          (res) => {
            this.bookComments[index].favoriteUserIds.push(loggedInUserId);
            this.bookComments[index].favoriteUserCount += 1;
          },
          (error) => {
            // error
          }
        );
      } else {
        // error
      }
    });
  }

  notCommentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.commentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.commentFavoriteService.deleteCommentFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.bookComments[index].favoriteUserIds.indexOf(loggedInUserId);
            this.bookComments[index].favoriteUserIds.splice(userIdIndex, 1);
            this.bookComments[index].favoriteUserCount -= 1;
          },
          (error) => {
            // error
          }
        );
      } else {
        // error
      }
    });
  }

  deleteComment(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.bookCommentService.deleteComment(commentId).subscribe(res => {
      this.bookComments.splice(index, 1);
      this.bookCommentCount -= 1;
    }, error => {
      // error
    });
  }

  reportComment(commentId: number, reasonCode: string, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.bookCommentService.reportComment(this.appComponent.userId, commentId, reasonCode).subscribe(res => {
      // 報告済みマークつける
      this.bookComments[index].reportUserIds.push(this.appComponent.userId);
    }, error => {
      // error
    });
  }

  reverseRepliesDisplayState(bookCommentId: number, commentIndex: number, page: number): void {
    // 表示中に呼ばれた場合には非表示、非表示中に呼ばれた場合には表示
    this.bookComments[commentIndex].displayedReply = !this.bookComments[commentIndex].displayedReply;
    this.bookCommentReplyService.getCommentRepliesPagingByCommentId(bookCommentId, page).subscribe(data => {
      if (data.count > 0) {
        this.bookComments[commentIndex].commentReplies = this.bookCommentReplyService.convertBookCommentReplies(data.results);
      }
    }, error => {
      // error
    });
  }

  registerReply(f: NgForm, commentId: number, commentIndex: number) {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const comment = f.value.comment;
    // const tweetFlag = f.value.tweetFlag;
    const tweetFlag = false;
    this.bookCommentReplyService.registerCommentReply(this.appComponent.userId, commentId, comment, tweetFlag).subscribe(res => {
      this.bookCommentReplyService.getCommentReply(res.id).subscribe(response => {
        if (response.id !== undefined) {
          const shelfCommentReply = this.bookCommentReplyService.convertBookCommentReply(response);
          this.bookComments[commentIndex].commentReplies.unshift(shelfCommentReply);
          this.bookComments[commentIndex].replyUserCount += 1;
          f.reset();
        }
      });
    });
  }

  deleteReply(commentReplyId: number, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.bookCommentReplyService.deleteCommentReply(commentReplyId).subscribe(res => {
      this.bookComments[commentIndex].commentReplies.splice(replyIndex, 1);
      this.bookComments[commentIndex].replyUserCount -= 1;
    }, error => {
      // error
    });
  }

  reportReply(commentReplyId: number, reasonCode: string, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    this.bookCommentReplyService.reportReply(this.appComponent.userId, commentReplyId, reasonCode).subscribe(res => {
      // 報告済みマークつける
      this.bookComments[commentIndex].commentReplies[replyIndex].reportUserIds.push(this.appComponent.userId);
    }, error => {
      // error
    });
  }

  replyFavorite(commentReplyId: number, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.bookCommentReplyFavoriteService.getReplyFavorite(loggedInUserId, commentReplyId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.bookCommentReplyFavoriteService.registerReplyFavorite(loggedInUserId, commentReplyId).subscribe(
          (res) => {
            this.bookComments[commentIndex].commentReplies[replyIndex].favoriteUserIds.push(loggedInUserId);
            this.bookComments[commentIndex].commentReplies[replyIndex].favoriteUserCount += 1;
          },
          (error) => {
            // error
          }
        );
      } else {
        // error
      }
    });
  }

  undoReplyFavorite(commentReplyId: number, commentIndex: number, replyIndex: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.bookCommentReplyFavoriteService.getReplyFavorite(loggedInUserId, commentReplyId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.bookCommentReplyFavoriteService.deleteReplyFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.bookComments[commentIndex].commentReplies[replyIndex].favoriteUserIds.indexOf(loggedInUserId);
            this.bookComments[commentIndex].commentReplies[replyIndex].favoriteUserIds.splice(userIdIndex, 1);
            this.bookComments[commentIndex].commentReplies[replyIndex].favoriteUserCount -= 1;
          },
          (error) => {
            // error
          }
        );
      } else {
        // error
      }
    });
  }
}
