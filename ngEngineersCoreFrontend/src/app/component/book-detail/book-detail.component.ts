import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AuthGuard} from '../../guard/auth.guard';
import {NgForm} from '@angular/forms';
import {faCommentDots, faHeart, faBook, faCaretDown, faExclamationTriangle} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {Book} from '../../dto/book/book';
import {BookComment} from '../../dto/book-comment/book-comment';
import {BookService} from '../../service/book/book.service';
import {BookCommentService} from '../../service/book-comment/book-comment.service';
import {SigninService} from '../../service/signin/signin.service';
import {InterestedBookService} from '../../service/interested-book/interested-book.service';
import {BookAuthorService} from '../../service/book-author/book-author.service';
import {CommentFavoriteService} from '../../service/comment-favorite/comment-favorite.service';
import {UserService} from '../../service/user/user.service';
import {BookCommentReplyService} from '../../service/book-comment-reply/book-comment-reply.service';
import {BookCommentReplyFavoriteService} from '../../service/book-comment-reply-favorite/book-comment-reply-favorite.service';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  webHost = environment.webUrl;
  faHeart = faHeart;
  faCommentDots = faCommentDots;
  faBook = faBook;
  faCaretDown = faCaretDown;
  faExclamationTriangle = faExclamationTriangle;

  pageFound = true;
  bookId = Number(this.route.snapshot.paramMap.get('id'));
  @Input() book: Book;
  userId: number;
  accountName: string;
  bookComments: BookComment[];
  bookCommentCount: number;
  bookInterestedCount: number;
  isInterested: boolean;
  today: string;
  clicked = false;

  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private modalService: BsModalService,
    private appComponent: AppComponent,
    private signinService: SigninService,
    private userService: UserService,
    private bookService: BookService,
    private bookAuthorService: BookAuthorService,
    private bookCommentService: BookCommentService,
    private interestedBookService: InterestedBookService,
    private commentFavoriteService: CommentFavoriteService,
    private bookCommentReplyService: BookCommentReplyService,
    private bookCommentReplyFavoriteService: BookCommentReplyFavoriteService,
  ) {
  }

  ngOnInit() {
    this.setToday();
    this.getLoginUser();
    this.getBook();
    this.getBookComments(this.bookId);
    this.checkInterested(this.bookId);
    this.getInterestedCount(this.bookId);
  }

  getLoginUser(): void {
    this.signinService.getAuthUser().subscribe(response => {
      this.userService.getUser(response.account_name).subscribe(res => {
        const user = res;
        this.appComponent.userId = user.id;
        this.appComponent.accountName = user.account_name;
        this.appComponent.userName = user.user_name;
        this.appComponent.profileImageLink = user.profile_image_link;
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

  // TODO: ryo.saito Authorの配列をもてるようにする。
  getBook(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    this.bookService.getBook(bookId).subscribe(res => {
      this.book = this.bookService.convertBook(res);
    }, error => {
      this.pageFound = false;
    });
  }

  getBookComments(bookId: number): void {
    this.bookCommentService.getBookCommentsByBookId(bookId).subscribe(data => {
      this.bookCommentCount = data.count;
      if (data.count > 0) {
        this.bookComments = this.bookCommentService.convertBookComments(data.results);
      } else {
        this.bookComments = [];
      }
    });
  }

  registerBookComment(f: NgForm): void {
    if (this.appComponent.isDoubleClick()) {
      return;
    }
    if (!this.authGuard.canActivate()) {
      return;
    }
    const comment = f.value.comment;
    const readDate = f.value.readDate;
    const loggedInUserId = this.appComponent.userId;
    this.bookCommentService.registerBookComment(loggedInUserId, this.bookId, comment, readDate).subscribe(
      (res) => {
        this.bookCommentService.getBookComment(res.id).subscribe(bookComment => {
          const convertedComment = this.bookCommentService.convertBookComment(bookComment);
          this.bookComments.unshift(convertedComment);
          this.bookCommentCount += 1;
        });
        // コメント登録が完了したらモーダルを閉じて画面の一番上に移動
        this.modalRef.hide();
        window.scrollTo(0, 0);
      }, (error) => {
        // error
      }
    );
    this.appComponent.makeClickable();
  }

  checkInterested(bookId: number): void {
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(
        (data) => {
          this.isInterested = data.results[0] !== undefined;
        },
        // errorの方に来るということは、データが見つからなかった。
        (error) => {
          // error
          this.isInterested = false;
        });
    });
  }

  getInterestedCount(bookId: number): void {
    this.interestedBookService.getBookInterested(bookId).subscribe(data => {
      this.bookInterestedCount = data.count;
    });
  }

  interested(bookId: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.interestedBookService.getInterestedBook(loggedInUserId, bookId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.interestedBookService.registerInterestedBook(loggedInUserId, bookId).subscribe(
          (res) => {
            this.isInterested = true;
            this.bookInterestedCount += 1;
          },
          (error) => {
            // error
          }
        );
        // すでにデータがある場合はメソッドが呼ばれるのおかしい。
      } else {
        // error
      }
    });
  }

  notInterested(bookId: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.interestedBookService.getInterestedBook(loggedInUserId, bookId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const interestedId = data.results[0].id;
        this.interestedBookService.deleteInterestedBook(interestedId).subscribe(
          (res) => {
            this.isInterested = false;
            this.bookInterestedCount -= 1;
          },
          (error) => {
            // error
          }
        );
      } else {
        // まだデータが存在しない場合はデータ変更は無し。
        // error
        this.isInterested = false;
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

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  setToday(): void {
    const now = new Date();
    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    this.today = year + '-' + month + '-' + day;
  }

  reverseRepliesDisplayState(shelfCommentId: number, commentIndex: number, page: number): void {
    // 表示中に呼ばれた場合には非表示、非表示中に呼ばれた場合には表示
    this.bookComments[commentIndex].displayedReply = !this.bookComments[commentIndex].displayedReply;
    this.bookCommentReplyService.getCommentRepliesPagingByCommentId(shelfCommentId, page).subscribe(data => {
      if (data.count > 0) {
        this.bookComments[commentIndex].commentReplies = this.bookCommentReplyService.convertBookCommentReplies(data.results);
      }
    }, error => {
      // error
    });
  }

  registerReply(f: NgForm, commentId: number, commentIndex: number) {
    if (this.appComponent.isDoubleClick()) {
      return;
    }
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
    this.appComponent.makeClickable();
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

  notReplyFavorite(commentReplyId: number, commentIndex: number, replyIndex: number): void {
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
