import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {BookService} from '../service/book/book.service';
import {Book} from '../book';
import {ActivatedRoute} from '@angular/router';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {BookComment} from '../book-comment';
import {SigninService} from '../service/signin/signin.service';
import {ReadBookService} from '../service/read-book/read-book.service';
import {InterestedBookService} from '../service/interested-book/interested-book.service';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  @Input() book: Book;
  bookComments: any[];
  submitted = false;
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
    this.bookService.getBook(id).subscribe(response => {
      this.book = new Book(
        response.id,
        response.title,
        response.book_status,
        response.sale_date,
        response.pages_count,
        response.offer_price,
        response.amazon_book
      );
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

  registerBookComment(bookId: number, comment: string, readDate: Date): void {
    this.signinService.getLoginUserIdDeprecated().subscribe(response => {
      const userId = response.id;
      this.readBookService.registerReadBook(userId, bookId, readDate);
      this.bookCommentService.registerBookComment(userId, bookId, comment);
    });
  }

  // TODO: ryo.saito getInterestedBookでデータ取得できるはずなのにundefinedになって...絶対isInterested = falseになる。
  checkInterested(bookId: number): void {
    this.signinService.getLoginUserIdDeprecated().subscribe(response => {
      const userId = Number(response.id);
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(res => {
        if (res.delete_flag !== undefined) {
          console.log('res.delete_flag: ' + res.delete_flag);
          this.isInterested = res.delete_flag !== true;
        } else {
          console.log('res: ' + res);
          console.log('res.id: ' + res.id);
          console.log('res.delete_flagはundefi');
          this.isInterested = false;
        }
      });
    });
  }

  interested(bookId: number): void {
    this.signinService.getLoginUserIdDeprecated().subscribe(response => {
      const userId = response.id;
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(interested => {
        // すでにデータがある場合は更新する。
        if (interested !== null) {
          // すでに存在する場合はdelete_flagをFalseに変える。
          this.interestedBookService.updateInterestedBook(interested.id, false).subscribe(
            (res) => {
              this.isInterested = true;
            },
            (error) => {
              console.log(error);
            }
          );
          // まだデータが存在しない場合は作成する。
        } else {
          this.interestedBookService.registerInterestedBook(userId, bookId).subscribe(
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
      this.interestedBookService.getInterestedBook(userId, bookId).subscribe(interested => {
        // すでにデータがある場合は更新する。
        if (interested !== null) {
          // すでに存在する場合はdelete_flagをTrueに変える。
          this.interestedBookService.updateInterestedBook(interested.id, true).subscribe((res) => {
              this.isInterested = false;
            },
            (error) => {
              console.log(error);
            }
          );
          // まだデータが存在しない場合は何もしない。
        } else {
          this.interestedBookService.registerInterestedBook(userId, bookId).subscribe(
            (res) => {
              this.isInterested = false;
            },
            (error) => {
              console.log(error);
            }
          );
        }
      });
    });
  }

  onSubmit() {
    this.submitted = true;
  }
}
