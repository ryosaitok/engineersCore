import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BookComment} from '../../dto/book-comment';
import {BookCommentService} from '../../service/book-comment/book-comment.service';

@Component({
  selector: 'app-book-comment',
  templateUrl: './book-comment.component.html',
  styleUrls: ['./book-comment.component.css']
})
export class BookCommentComponent implements OnInit {

  @Input() bookComment: BookComment;
  commentId = Number(this.route.snapshot.paramMap.get('id'));

  constructor(
    private route: ActivatedRoute,
    private bookCommentService: BookCommentService,
  ) {}

  ngOnInit() {
    this.getBookComment(this.commentId);
  }

  getBookComment(commentId: number): void {
    this.bookCommentService.getBookComment(commentId).subscribe(response => {
      this.bookComment = new BookComment(
          response.id,
          response.user,
          response.book,
          response.comment_text,
          response.comment_date,
          response.tweet_flag,
      );
    });
  }

}
