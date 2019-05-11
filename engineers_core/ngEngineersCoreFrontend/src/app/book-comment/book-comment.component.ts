import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookComment} from '../book-comment';
import {BookCommentService} from '../service/book-comment/book-comment.service';

@Component({
  selector: 'app-book-comment',
  templateUrl: './book-comment.component.html',
  styleUrls: ['./book-comment.component.css']
})
export class BookCommentComponent implements OnInit {

  @Input() bookComment: BookComment;

  constructor(
    private route: ActivatedRoute,
    private bookCommentService: BookCommentService,
  ) {}

  ngOnInit() {
    this.getBookComment();
  }

  getBookComment(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.bookCommentService.getBookComment(id).subscribe(response => {
      this.bookComment = new BookComment(
          response.id,
          response.user,
          response.book,
          response.comment_text,
          response.comment_date,
          response.tweet_flag,
          response.delete_flag
      );
    });
  }

}
