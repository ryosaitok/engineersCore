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

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

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
    this.getBookComments();
    this.checkInterested();
    this.getInterestedCount();
  }

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookAuthorService: BookAuthorService,
    private bookCommentService: BookCommentService,
    private interestedBookService: InterestedBookService,
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

  getBookComments(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookCommentService.getBookComments(id).subscribe(data => {
        this.bookComments = data;
        this.bookCommentCount = 0;
        data.forEach(comment => {
          if (comment.id !== null && comment.id !== undefined) {
            this.bookCommentCount = this.bookCommentCount + 1;
          }
        });
      }
    );
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
    this.getBookComments();
  }

  checkInterested(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(
        // dataの方に来るということは、データが見つかった
        (data) => {
          if (data[0] !== undefined) {
            this.isInterested = data[0].delete_flag !== true;
          } else {
            this.isInterested = false;
          }
        },
        // errorの方に来るということは、データが見つからなかった。
        (error) => {
          console.log('checkInterestedでerror: ' + error);
          this.isInterested = false;
        });
    });
  }

  getInterestedCount(): void {
    const bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.interestedBookService.getBookInterested(bookId).subscribe(data => {
      data.forEach(res => {
        this.bookInterestedCount = 0;
        if (res.id !== null && res.id !== undefined) {
          this.bookInterestedCount = this.bookInterestedCount + 1;
        }
      });
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
          // すでにデータがある場合は更新する。
        } else {
          const interestedId = data[0].id;
          this.interestedBookService.updateInterestedBook(interestedId, userId, bookId, false).subscribe(
            (res) => {
              this.isInterested = true;
            },
            (error) => {
              console.log('interestedでerror: ' + error);
            }
          );
        }
      });
    });
  }

  notInterested(bookId: number): void {
    this.signinService.getAuthUser().subscribe(response => {
      const userId = response.user_id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(data => {
        // すでにデータがある場合は更新する。
        if (data !== null && data !== undefined && data.length !== 0) {
          const interestedId = data[0].id;
          this.interestedBookService.updateInterestedBook(interestedId, userId, bookId, true).subscribe(
            (res) => {
              this.isInterested = false;
            },
            (error) => {
              console.log('notInterestedでerror: ' + error);
            }
          );
        } else {
          // まだデータが存在しない場合はデータ変更は無し。
          this.isInterested = false;
        }
      });
    });
  }
}
