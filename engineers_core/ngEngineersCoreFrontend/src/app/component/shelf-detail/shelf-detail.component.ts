import {Component, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {AuthGuard} from '../../guard/auth.guard';
import {faBookReader, faCommentDots, faHeart} from '@fortawesome/free-solid-svg-icons';

import {AppComponent} from '../../app.component';
import {Shelf} from '../../dto/shelf/shelf';
import {ShelfComment} from '../../dto/shelf-comment/shelf-comment';
import {ShelfService} from '../../service/shelf/shelf.service';
import {ShelfFavoriteService} from '../../service/shelf-favorite/shelf-favorite.service';
import {ShelfCommentService} from '../../service/shelf-comment/shelf-comment.service';
import {ShelfCommentFavoriteService} from '../../service/shelf-comment-favorite/shelf-comment-favorite.service';

@Component({
  selector: 'app-shelf-detail',
  templateUrl: './shelf-detail.component.html',
  styleUrls: ['./shelf-detail.component.css']
})
export class ShelfDetailComponent implements OnInit {

  shelfId = Number(this.route.snapshot.paramMap.get('shelfId'));
  shelf: Shelf;
  shelfBookCount: number;
  shelfComments: ShelfComment[];
  shelfCommentCount: number;

  faBookReader = faBookReader;
  faHeart = faHeart;
  faCommentDots = faCommentDots;

  constructor(
    private route: ActivatedRoute,
    private authGuard: AuthGuard,
    private appComponent: AppComponent,
    private shelfService: ShelfService,
    private shelfCommentService: ShelfCommentService,
    private shelfFavoriteService: ShelfFavoriteService,
    private shelfCommentFavoriteService: ShelfCommentFavoriteService,
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
            this.shelf.favoriteUserIds.push(loggedInUserId);
            this.shelf.favoriteUserCount += 1;
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
            const userIdIndex = this.shelf.favoriteUserIds.indexOf(loggedInUserId);
            this.shelf.favoriteUserIds.splice(userIdIndex, 1);
            this.shelf.favoriteUserCount -= 1;
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

  registerComment(f: NgForm) {
    const comment = f.value.comment;
    // const tweetFlag = f.value.tweetFlag;
    const tweetFlag = false;
    this.shelfCommentService.registerShelfComment(this.appComponent.userId, this.shelf.shelfId, comment, tweetFlag).subscribe(res => {
      this.shelfCommentService.getShelfComment(res.id).subscribe(response => {
        if (response.id !== undefined) {
          const shelfComment = this.shelfCommentService.convertShelfComment(response);
          this.shelfComments.unshift(shelfComment);
        }
      });
    });
  }

  commentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfCommentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // まだデータが存在しない場合は作成する。
      if (data === null || data === undefined || data.count === 0) {
        this.shelfCommentFavoriteService.registerCommentFavorite(loggedInUserId, commentId).subscribe(
          (res) => {
            this.shelfComments[index].favoriteUserIds.push(loggedInUserId);
            this.shelfComments[index].favoriteUserCount += 1;
          },
          (error) => {
            console.error('commentFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('commentFavoriteが呼ばれるのおかしい。loggedInUserId: ' + loggedInUserId, 'commentId: ' + commentId);
      }
    });
  }

  notCommentFavorite(commentId: number, index: number): void {
    if (!this.authGuard.canActivate()) {
      return;
    }
    const loggedInUserId = this.appComponent.userId;
    this.shelfCommentFavoriteService.getCommentFavorite(loggedInUserId, commentId).subscribe(data => {
      // データがある場合は削除する。
      if (data !== null && data !== undefined && data.count !== 0) {
        const favoriteId = data.results[0].id;
        this.shelfCommentFavoriteService.deleteCommentFavorite(favoriteId).subscribe(
          (res) => {
            const userIdIndex = this.shelfComments[index].favoriteUserIds.indexOf(loggedInUserId);
            this.shelfComments[index].favoriteUserIds.splice(userIdIndex, 1);
            this.shelfComments[index].favoriteUserCount -= 1;
          },
          (error) => {
            console.log('notCommentFavoriteでerror: ' + error);
          }
        );
      } else {
        console.error('まだデータが存在しない場合はメソッド呼ばれるのおかしい。commentId ' + commentId);
      }
    });
  }

  scrollToComment(id: string): void {
    document.getElementById(id).scrollIntoView({block: 'center', behavior: 'smooth'});
  }
}
