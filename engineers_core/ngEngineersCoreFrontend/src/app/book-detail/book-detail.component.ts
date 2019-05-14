import {Component, Input, OnInit} from '@angular/core';
import {BookService} from '../service/book/book.service';
import {Book} from '../book';
import {ActivatedRoute} from '@angular/router';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {SigninService} from '../service/signin/signin.service';
import {ReadBookService} from '../service/read-book/read-book.service';
import {InterestedBookService} from '../service/interested-book/interested-book.service';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  @Input() book: Book;
  bookComments: any[];
  isInterested: boolean;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookCommentService: BookCommentService,
    private readBookService: ReadBookService,
    private interestedBookService: InterestedBookService,
    private signinService: SigninService,
  ) {
  }

  ngOnInit() {
    this.getBook();
    this.getBookComments();
  }

  getBook(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookService.getBook(id).subscribe(
      (res) => {
        this.book = new Book(
          res.id,
          res.title,
          res.book_status,
          res.sale_date,
          res.pages_count,
          res.offer_price,
          res.amazon_book
        );
      },
      (error) => {
        // 404表示する？
      });
    this.checkInterested(Number(id));
  }

  getBookComments(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookCommentService.getBookComments(id).subscribe(data => {
        // promiseの中だとpushメソッドが使えない？
        // this.bookComments.push(new BookComment(
        //   data.id,
        //   data.user,
        //   data.book,
        //   data.comment_text,
        //   data.comment_date,
        //   data.tweet_flag,
        //   data.delete_flag
        // ));
        this.bookComments = data;
      }
    );
  }

  registerBookComment(f: NgForm): void {
    // userId: number, bookId: number, comment: string
    const bookId = f.value.bookId;
    const comment = f.value.comment;
    const readDate = f.value.readDate;
    console.log('bookId: ' + bookId);
    console.log('comment: ' + comment);
    console.log('readDate: ' + readDate);
    this.signinService.getLoginUserIdDeprecated().subscribe(response => {
      const userId = response.id;
      this.readBookService.registerReadBook(userId, bookId, readDate).subscribe(
        (res) => {
          console.log('res.status: ' + res.status);
        }, (error) => {
          console.log('error: ' + error);
        }
      );
      this.bookCommentService.registerBookComment(userId, bookId, comment).subscribe(
        (res) => {
          console.log('res.status: ' + res.status);
        }, (error) => {
          console.log('error: ' + error);
        }
      );
    });
    // メソッドの呼び出し箇所考える
    this.getBookComments();
  }

  checkInterested(bookId: number): void {
    this.signinService.getLoginUserIdDeprecated().subscribe(response => {
      const userId = Number(response.id);
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(
        // dataの方に来るということは、データが見つかった
        (data) => {
        const deleteFlag = data[0].delete_flag;
        if (deleteFlag !== undefined) {
          this.isInterested = deleteFlag !== true;
        } else {
          this.isInterested = false;
        }
      },
        // errorの方に来るということは、データが見つからなかった。
        (error) => {
          this.isInterested = false;
        });
    });
  }

  interested(bookId: number): void {
    this.signinService.getLoginUserIdDeprecated().subscribe(response => {
      const userId = response.id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(data => {
        // まだデータが存在しない場合は作成する。
        if (data === null || data === undefined || data.length === 0) {
          this.interestedBookService.registerInterestedBook(userId, bookId).subscribe(
            (res) => {
              this.isInterested = true;
            },
            (error) => {
              console.log(error);
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
              console.log(error);
            }
          );
        }
      });
    });
  }

  notInterested(bookId: number): void {
    this.signinService.getLoginUserIdDeprecated().subscribe(response => {
      const userId = response.id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(data => {
        // すでにデータがある場合は更新する。
        if (data !== null && data !== undefined && data.length !== 0) {
          const interestedId = data[0].id;
          this.interestedBookService.updateInterestedBook(interestedId, userId, bookId, true).subscribe((res) => {
              this.isInterested = false;
            },
            (error) => {
              console.log(error);
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
