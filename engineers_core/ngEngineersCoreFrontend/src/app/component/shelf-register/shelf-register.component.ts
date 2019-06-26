import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard';
import {NgForm} from '@angular/forms';
import {faBookReader, faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {Shelf} from '../../dto/shelf/shelf';
import {Book} from '../../dto/book/book';
import {ShelfBook} from '../../dto/shelf-book/shelf-book';
import {BookService} from '../../service/book/book.service';
import {ShelfService} from '../../service/shelf/shelf.service';
import {ShelfCommentService} from '../../service/shelf-comment/shelf-comment.service';
import {ShelfBookService} from '../../service/shelf-book/shelf-book.service';

@Component({
  selector: 'app-shelf-register',
  templateUrl: './shelf-register.component.html',
  styleUrls: ['./shelf-register.component.css']
})
export class ShelfRegisterComponent implements OnInit {

  shelfId = Number(this.route.snapshot.paramMap.get('shelfId'));
  shelf: Shelf;
  shelfBookCount: number;
  searchedBooks: Book[];

  faBookReader = faBookReader;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private bookService: BookService,
    private shelfService: ShelfService,
    private shelfCommentService: ShelfCommentService,
    private shelfBookService: ShelfBookService,
  ) {
  }

  ngOnInit() {
    this.initShelf();
  }

  initShelf(): void {
    this.shelf = new Shelf(null, null, [], null, null, null, null,
      null, [], [], null, null, []);
    this.shelfBookCount = 0;
  }

  /**
   * 本のタイトルでLIKE検索し、本のIDで重複除いた結果のコメント一覧を取得する。
   */
  search(f: NgForm) {
    const query = f.value.query.trim();
    if (query === null || query === undefined || query === '') {
      return;
    }
    this.searchBooksByTitle(query, null, 1);
  }

  /**
   * 本のタイトルで本を検索して検索結果を表示する
   */
  searchBooksByTitle(title: string, sort: string, page: number) {
    this.bookService.getBooksLikeTitle(title, sort, page.toString()).subscribe(data => {
      if (data.count > 0) {
        this.searchedBooks = this.bookService.convertBooks(data.results);
      } else {
        this.searchedBooks = [];
      }
    });
  }

  addBook(book: Book) {
    // まだ追加されていない本ならば本棚に追加する
    let alreadyListed = false;
    this.shelf.books.forEach(listedBook => {
      if (listedBook.id === book.id) {
        alreadyListed = true;
      }
    });
    if (!alreadyListed) {
      this.shelf.books.push(book);
      this.shelfBookCount += 1;
    }
  }

  removeBook(index: number) {
    this.shelf.books.splice(index, 1);
    this.shelfBookCount -= 1;
  }

  registerShelf(form: NgForm, books: Book[]) {
    const shelfName = form.value.shelfName;
    const description = form.value.description;
    this.shelfService.registerShelf(this.appComponent.userId, shelfName, description).subscribe(res => {
      const shelfId = res.id;
      const shelfBooks = [];
      books.forEach(book => {
        shelfBooks.push(new ShelfBook(null, shelfId, book.id, null));
      });
      this.shelfBookService.bulkRegisterShelfBooks(shelfBooks).subscribe(r => {
        this.router.navigate(['shelf/' + shelfId + '/']);
      });
    });
  }
}
