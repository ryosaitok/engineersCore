import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {AuthGuard} from '../../guard/auth.guard';
import {faBookReader, faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {Shelf} from '../../dto/shelf/shelf';
import {Book} from '../../dto/book/book';
import {ShelfBook} from '../../dto/shelf-book/shelf-book';
import {ShelfService} from '../../service/shelf/shelf.service';
import {ShelfCommentService} from '../../service/shelf-comment/shelf-comment.service';
import {BookService} from '../../service/book/book.service';
import {ShelfBookService} from '../../service/shelf-book/shelf-book.service';
import {SigninService} from '../../service/signin/signin.service';
import {UserService} from '../../service/user/user.service';

@Component({
  selector: 'app-shelf-edit',
  templateUrl: './shelf-edit.component.html',
  styleUrls: ['./shelf-edit.component.css']
})
export class ShelfEditComponent implements OnInit {

  shelfId = Number(this.route.snapshot.paramMap.get('shelfId'));
  shelf: Shelf;
  shelfBookCount: number;
  shelfCommentCount: number;
  searchedBooks: Book[];
  pageFound = true;

  faBookReader = faBookReader;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authGuard: AuthGuard,
    private signinService: SigninService,
    private userService: UserService,
    private appComponent: AppComponent,
    private bookService: BookService,
    private shelfService: ShelfService,
    private shelfCommentService: ShelfCommentService,
    private shelfBookService: ShelfBookService,
  ) {
  }

  ngOnInit() {
    this.getShelf();
    this.getShelfCommentCount();
  }

  getShelf(): void {
    this.shelfService.getShelf(this.shelfId).subscribe(res => {
      this.signinService.getAuthUser().subscribe(response => {
        this.userService.getUser(response.account_name).subscribe(r => {
          if (res.user.id === r.id) {
            this.shelf = this.shelfService.convertShelf(res, 20);
            this.shelfBookCount = Object.keys(this.shelf.books).length;
          } else {
            // ログイン中ユーザーの本棚ではない場合は、アクセスできない表示
            this.pageFound = false;
          }
        });
      });
    }, error => {
      // リソースにアクセスできない場合は、アクセスできない表示
      this.pageFound = false;
    });
  }

  getShelfCommentCount(): void {
    this.shelfCommentService.getShelfCommentsByShelfId(this.shelfId).subscribe(data => {
      this.shelfCommentCount = data.count;
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
      this.shelfBookCount += 1;
    }
  }

  removeBook(index: number) {
    this.shelf.books.splice(index, 1);
    this.shelfBookCount -= 1;
  }

  updateShelf(form: NgForm, shelfId: number, books: Book[]) {
    const shelfName = form.value.shelfName;
    const description = form.value.description;
    const shelfBooks = [];
    books.forEach(book => {
      shelfBooks.push(new ShelfBook(null, shelfId, book.id, null));
    });
    this.shelfService.updateShelf(shelfId, this.appComponent.userId, shelfName, description, 'OPN').subscribe(res => {
      // すでに本棚に本が登録されている場合は、本棚の本を一旦全削除し、本を追加登録していく。
      this.shelfBookService.getShelfBooksByShelfId(shelfId).subscribe(data => {
        if (data.count === 0) {
          this.shelfBookService.bulkRegisterShelfBooks(shelfBooks).subscribe(r => {
            this.router.navigate(['shelf/' + shelfId + '/']);
          });
        } else {
          this.shelfBookService.shelfIdBulkDeleteShelfBooks(shelfId).subscribe(response => {
            this.shelfBookService.bulkRegisterShelfBooks(shelfBooks).subscribe(r => {
              this.router.navigate(['shelf/' + shelfId + '/']);
            });
          });
        }
      });
    });
  }
}
