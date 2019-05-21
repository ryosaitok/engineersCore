import {Component, Input, OnInit} from '@angular/core';
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
        const bookAuthor = data[0];
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
    this.bookCommentService.getBookComments(bookId).subscribe(data => {
      this.bookComments = data;
      this.bookCommentCount = Object.keys(data).length;
    });
  }

  registerBookComment(f: NgForm): void {
    const bookId = f.value.bookId;
    const comment = f.value.comment;
    const readDate = f.value.readDate;
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.bookCommentService.registerBookComment(userId, bookId, comment, readDate).subscribe(
        (res) => {
          console.log('読んだコメントを登録しました！book-comment-id: ' + res.id);
        }, (error) => {
          console.log('読んだコメントの登録に失敗しました！error: ' + error);
        }
      );
    });
    // メソッドの呼び出し箇所考える
    this.getBookComments(this.bookId);
  }

  checkInterested(bookId: number): void {
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(
        // dataの方に来るということは、データが見つかった
        (data) => {
          this.isInterested = data[0] !== undefined;
        },
        // errorの方に来るということは、データが見つからなかった。
        (error) => {
          console.log('checkInterestedでerror: ' + error);
          this.isInterested = false;
        });
    });
  }

  getInterestedCount(bookId: number): void {
    this.interestedBookService.getBookInterested(bookId).subscribe(data => {
      this.bookInterestedCount = Object.keys(data).length;
    });
  }

  interested(bookId: number): void {
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(data => {
        // まだデータが存在しない場合は作成する。
        if (data === null || data === undefined || data.length === 0) {
          this.interestedBookService.registerInterestedBook(userId, bookId).subscribe(
            (res) => {
              this.isInterested = true;
            },
            (error) => {
              console.log('interestedでerror: ' + error);
            }
          );
          // すでにデータがある場合はメソッドが呼ばれるのおかしい。
        } else {
          console.log('すでにデータある。メソッドが呼ばれるのおかしい。userId: ' + userId + ' , bookId: ' + bookId);
        }
      });
    });
  }

  notInterested(bookId: number): void {
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(data => {
        // データがある場合は削除する。
        if (data !== null && data !== undefined && data.length !== 0) {
          const interestedId = data[0].id;
          this.interestedBookService.deleteInterestedBook(interestedId).subscribe(
            (res) => {
              this.isInterested = false;
            },
            (error) => {
              console.log('notInterestedでerror: ' + error);
            }
          );
        } else {
          // まだデータが存在しない場合はデータ変更は無し。
          console.log('データ最初からない。メソッドが呼ばれるのおかしい。userId: ' + userId + ' , bookId: ' + bookId);
          this.isInterested = false;
        }
      });
    });
  }

  commentFavorite(commentId: number): void {
    console.log('commentFavorite。commentId ' + commentId);
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.commentFavoriteService.getCommentFavorite(userId, commentId).subscribe(data => {
        // まだデータが存在しない場合は作成する。
        if (data === null || data === undefined || data.length === 0) {
          this.commentFavoriteService.registerCommentFavorite(userId, commentId).subscribe(
            (res) => {
              console.log('registerCommentFavoriteしたよ。commentId: ' + commentId);
            },
            (error) => {
              console.error('commentFavoriteでerror: ' + error);
            }
          );
        } else {
          console.error('commentFavoriteが呼ばれるのおかしい。userId: ' + userId, 'commentId: ' + commentId);
        }
      });
    });
  }

  notCommentFavorite(commentId: number): void {
    console.log('notCommentFavorite。commentId ' + commentId);
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.commentFavoriteService.getCommentFavorite(userId, commentId).subscribe(data => {
        // データがある場合は削除する。
        if (data !== null && data !== undefined && data.length !== 0) {
          const favoriteId = data[0].id;
          this.commentFavoriteService.deleteCommentFavorite(favoriteId).subscribe(
            (res) => {
              console.log('deleteCommentFavoriteしたよ。commentId' + commentId);
            },
            (error) => {
              console.log('notCommentFavoriteでerror: ' + error);
            }
          );
        } else {
          console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。commentId ' + commentId);
        }
      });
    });
  }
}
