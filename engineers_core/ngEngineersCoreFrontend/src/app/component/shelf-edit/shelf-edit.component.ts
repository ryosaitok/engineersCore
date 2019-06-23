import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AuthGuard} from '../../guard/auth.guard';
import {faBookReader, faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {Shelf} from '../../dto/shelf/shelf';
import {ShelfComment} from '../../dto/shelf-comment/shelf-comment';
import {Book} from '../../dto/book/book';
import {ShelfService} from '../../service/shelf/shelf.service';
import {ShelfCommentService} from '../../service/shelf-comment/shelf-comment.service';
import {BookService} from '../../service/book/book.service';

@Component({
  selector: 'app-shelf-edit',
  templateUrl: './shelf-edit.component.html',
  styleUrls: ['./shelf-edit.component.css']
})
export class ShelfEditComponent implements OnInit {

  shelfId = Number(this.route.snapshot.paramMap.get('shelfId'));
  shelf: Shelf;
  shelfBookCount: number;
  shelfComments: ShelfComment[];
  shelfCommentCount: number;
  searchedBooks: Book[];

  faBookReader = faBookReader;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private bookService: BookService,
    private shelfService: ShelfService,
    private shelfCommentService: ShelfCommentService,
  ) {
  }

  ngOnInit() {
    this.getShelf();
    this.getShelfComments();
  }

  getShelf(): void {
    this.shelfService.getShelf(this.shelfId).subscribe(res => {
      if (res !== undefined && res !== null) {
        this.shelf = this.shelfService.convertShelf(res, 20);
        this.shelfBookCount = Object.keys(this.shelf.books).length;
      }
    });
  }

  getShelfComments(): void {
    this.shelfCommentService.getShelfCommentsByShelfId(this.shelfId).subscribe(data => {
      if (data.results !== undefined && data.results !== null && data.count !== 0) {
        const shelfComments = data.results;
        this.shelfComments = this.shelfCommentService.convertShelfComments(shelfComments);
        this.shelfCommentCount = data.count;
      }
    });
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
    }
  }

  removeBook(index: number) {
    this.shelf.books.splice(index, 1);
  }

  updateShelf(f: NgForm, shelfId: number, books: Book[]) {
    const shelfName = f.value.shelfName;
    const description = f.value.description;
    this.shelfService.updateShelf(shelfId, shelfName, description).subscribe(res => {
      console.log('JSON.stringify(res): ', JSON.stringify(res));
      // 本棚の本を一旦全削除し、本を追加登録していく
      this.shelfBookService.bulkDeleteShelfBooks(shelfId).subscribe(response => {
        console.log('JSON.stringify(response): ', JSON.stringify(response));
        // 本棚の本を一旦全削除し、本を追加登録していく
        this.shelfBookService.bulkRegisterShelfBooks(shelfId, books).subscribe(r => {
          console.log('JSON.stringify(r): ', JSON.stringify(r));
        }, e => {
          console.error('JSON.stringify(e): ', JSON.stringify(e));
        });
      }, error => {
          console.error('JSON.stringify(error): ', JSON.stringify(error));
        });
    }, err => {
      console.error('JSON.stringify(err): ', JSON.stringify(err));
    });
  }

  deleteShelf(shelfId: number) {
    this.shelfService.deleteShelf(shelfId).subscribe(res => {
      console.log('JSON.stringify(res): ', JSON.stringify(res));
    }, err => {
      console.error('JSON.stringify(err): ', JSON.stringify(err));
    });
  }
}
