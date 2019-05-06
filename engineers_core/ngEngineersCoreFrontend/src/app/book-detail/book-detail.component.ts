import {Component, Input, OnInit} from '@angular/core';
import {BookService} from '../service/book/book.service';
import {Book} from '../book';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {

  @Input() book: Book;

  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private location: Location,
  ) {}

  ngOnInit() {
    this.getBook();
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
        response.amazon_book);
    });
  }

  goBack(): void {
    this.location.back();
  }

}
