import { Component, OnInit } from '@angular/core';
import { BookService } from '../service/book/book.service';
import { Book } from '../book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  books: Book[] = [];

  constructor(private bookService: BookService) { }

  ngOnInit() {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.getBooks().subscribe(response => {
      response.forEach(book => {
        this.books.push(new Book(
          book.id,
          book.title,
          book.bookStatus,
          book.saleDate,
          book.pagesCount,
          book.offerPrice,
          book.amazonBook));
      });
    });
  }

}
