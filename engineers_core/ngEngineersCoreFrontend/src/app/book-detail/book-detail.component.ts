import {Component, Input, OnInit} from '@angular/core';
import {BookService} from '../service/book/book.service';
import {Book} from '../book';
import {ActivatedRoute} from '@angular/router';
import {BookCommentService} from '../service/book-comment/book-comment.service';
import {BookComment} from '../book-comment';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  @Input() book: Book;
  bookComments: any[];

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private bookCommentService: BookCommentService,
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
  }

  getBookComments(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookCommentService.getBookComments(id).subscribe(data => {
        console.log('data:' + data);
        console.log('id:' + id);
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
}
