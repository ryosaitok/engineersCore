import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {BookService} from '../service/book/book.service';
import {Book} from '../book';
import {ActivatedRoute} from '@angular/router';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {SigninService} from '../service/signin/signin.service';
import {InterestedBookService} from '../service/interested-book/interested-book.service';
import {NgForm} from '@angular/forms';
import {BookAuthorService} from '../service/book-author/book-author.service';
import {faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';
import {CommentFavoriteService} from '../service/comment-favorite/comment-favorite.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';

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
  bookComments: any[];
  bookCommentCount: number;
  bookInterestedCount: number;
  isInterested: boolean;

  modalRef: BsModalRef;

  ngOnInit() {
    this.getLoginUser();
    this.getBook();
    this.getBookComments(this.bookId);
    this.checkInterested(this.bookId);
    this.getInterestedCount(this.bookId);
  }

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookAuthorService: BookAuthorService,
    private bookCommentService: BookCommentService,
    private interestedBookService: InterestedBookService,
    private commentFavoriteService: CommentFavoriteService,
    private signinService: SigninService,
    private modalService: BsModalService
  ) {
  }

  getLoginUser(): void {
    this.signinService.getAuthUser().subscribe(response => {
      const user = response;
      this.userId = user.user_id;
      this.accountName = user.account_name;
    });
  }

  // TODO: ryo.saito Authorの配列をもてるようにする。
  getBook(): void {
    const bookId = this.route.snapshot.paramMap.get('id');
    this.bookAuthorService.getBookAuthors(bookId).subscribe(
      (data) => {
        const bookAuthor = data.results[0];
        if (bookAuthor !== undefined) {
          this.book = new Book(
            bookAuthor.book.id,
            bookAuthor.book.title,
            bookAuthor.book.book_status,
            bookAuthor.book.sale_date,
            bookAuthor.book.pages_count,
            bookAuthor.book.offer_price,
            bookAuthor.book.amazon_book,
            bookAuthor.author.author_name
          );
        } else {
          // 404表示する？
        }
      },
      (error) => {
        // 404表示する？
      });
  }

  getBookComments(bookId: number): void {
    this.bookCommentService.getBookCommentsByBookId(bookId).subscribe(data => {
      this.bookComments = data.results;
      this.bookCommentCount = data.count;
    });
  }

  registerBookComment(f: NgForm): void {
    const comment = f.value.comment;
    const readDate = f.value.readDate;
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.bookCommentService.registerBookComment(userId, this.bookId, comment, readDate).subscribe(
        (res) => {
          this.bookCommentService.getBookComment(res.id).subscribe(bookComment => {
            this.bookComments.unshift(bookComment);
          });
          // コメント登録が完了したらモーダルを閉じる。
          this.modalRef.hide();
        }, (error) => {
          console.log('読んだコメントの登録に失敗！error: ' + error);
        }
      );
    });
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
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(data => {
        // まだデータが存在しない場合は作成する。
        if (data === null || data === undefined || data.count === 0) {
          this.interestedBookService.registerInterestedBook(userId, bookId).subscribe(
            (res) => {
              this.isInterested = true;
            },
            (error) => {
              console.log('error: ' + error);
            }
          );
          // すでにデータがある場合はメソッドが呼ばれるのおかしい。
        } else {
          console.log('userId: ' + userId + ' , commentId: ' + bookId);
        }
      });
    });
  }

  notInterested(bookId: number): void {
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(data => {
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
          console.log('userId: ' + userId + ' , commentId: ' + bookId);
          this.isInterested = false;
        }
      });
    });
  }

  commentFavorite(commentId: number, index: number): void {
    console.log('commentFavorite。commentId ' + commentId);
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.commentFavoriteService.getCommentFavorite(userId, commentId).subscribe(data => {
        // まだデータが存在しない場合は作成する。
        if (data === null || data === undefined || data.count === 0) {
          this.commentFavoriteService.registerCommentFavorite(userId, commentId).subscribe(
            (res) => {
              this.bookComments[index].favorite_users.push(userId);
            },
            (error) => {
              console.error('error: ' + error);
            }
          );
        } else {
          console.error('userId: ' + userId, 'commentId: ' + commentId);
        }
      });
    });
  }

  notCommentFavorite(commentId: number, index: number): void {
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.commentFavoriteService.getCommentFavorite(userId, commentId).subscribe(data => {
        // データがある場合は削除する。
        if (data !== null && data !== undefined && data.count !== 0) {
          const favoriteId = data.results[0].id;
          this.commentFavoriteService.deleteCommentFavorite(favoriteId).subscribe(
            (res) => {
              const userIdIndex = this.bookComments[index].favorite_users.indexOf(userId);
              this.bookComments[index].favorite_users.splice(userIdIndex,  1);
            },
            (error) => {
              console.log('error: ' + error);
            }
          );
        } else {
          console.error('commentId: ' + commentId, 'userId: ' + userId);
        }
      });
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
}
