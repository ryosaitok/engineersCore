import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {AuthGuard} from '../../guard/auth.guard';
import {NgForm} from '@angular/forms';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

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

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  bookId = Number(this.route.snapshot.paramMap.get('id'));
  @Input() book: Book;
  faHeart = faHeart;
  faCommentDots = faCommentDots;
  userId: number;
  accountName: string;
  bookComments: BookComment[];
  bookCommentCount: number;
  bookInterestedCount: number;
  isInterested: boolean;
  today: string;

  modalRef: BsModalRef;

  constructor(
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private bookService: BookService,
    private bookAuthorService: BookAuthorService,
    private bookCommentService: BookCommentService,
    private interestedBookService: InterestedBookService,
    private commentFavoriteService: CommentFavoriteService,
    private signinService: SigninService,
    private userService: UserService,
    private modalService: BsModalService
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
        // コメント登録が完了したらモーダルを閉じる。
        this.modalRef.hide();
      }, (error) => {
        console.log('読んだコメントの登録に失敗！error: ' + error);
      }
    );
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
          console.log('error: ' + error);
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
          },
          (error) => {
            console.log('error: ' + error);
          }
        );
        // すでにデータがある場合はメソッドが呼ばれるのおかしい。
      } else {
        console.log('loggedInUserId: ' + loggedInUserId + ' , commentId: ' + bookId);
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
          },
          (error) => {
            console.log('error: ' + error);
          }
        );
      } else {
        // まだデータが存在しない場合はデータ変更は無し。
        console.log('loggedInUserId: ' + loggedInUserId + ' , commentId: ' + bookId);
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
            console.log('notCommentFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。commentId ' + commentId);
      }
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
}
