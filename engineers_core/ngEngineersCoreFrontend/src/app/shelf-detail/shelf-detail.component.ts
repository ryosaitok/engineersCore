import {Component, OnInit} from '@angular/core';
import {faBookReader, faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';
import {ActivatedRoute} from '@angular/router';
import {ShelfService} from '../service/shelf/shelf.service';
import {AuthGuard} from '../guard/auth.guard';
import {AppComponent} from '../app.component';
import {ShelfFavoriteService} from '../service/shelf-favorite/shelf-favorite.service';

@Component({
  selector: 'app-shelf-detail',
  templateUrl: './shelf-detail.component.html',
  styleUrls: ['./shelf-detail.component.css']
})
export class ShelfDetailComponent implements OnInit {

  shelfCd = this.route.snapshot.paramMap.get('shelfCd');
  shelf: any;
  shelfCount: number;

  faBookReader = faBookReader;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private shelfService: ShelfService,
    private shelfFavoriteService: ShelfFavoriteService,
  ) {
  }

  ngOnInit() {
    this.getShelf();
  }

  getShelf(): void {
    this.shelfService.getShelfsByShelfCd(this.shelfCd).subscribe(data => {
      if (data.results[0] !== undefined && data.results[0] !== null) {
        this.shelf = data.results[0];
        this.shelfCount = Object.keys(data.results[0].books).length;
      }
    });
  }

  shelfFavorite(shelfId: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfFavoriteService.getShelfFavorite(loggedInUserId, shelfId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.shelfFavoriteService.registerShelfFavorite(loggedInUserId, shelfId).subscribe(
          (res) => {
            this.shelf.favorite_users.push(loggedInUserId);
          },
          (error) => {
            console.error('shelfFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('shelfFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'shelfId: ' + shelfId);
      }
    });
  }

  undoShelfFavorite(shelfId: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfFavoriteService.getShelfFavorite(loggedInUserId, shelfId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.shelfFavoriteService.deleteShelfFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.shelf.favorite_users.indexOf(loggedInUserId);
            this.shelf.favorite_users.splice(userIdIndex, 1);
          },
          (error) => {
            console.log('undoShelfFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。shelfId ' + shelfId);
      }
    });
  }
}
