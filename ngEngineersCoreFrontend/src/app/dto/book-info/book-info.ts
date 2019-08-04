import {AmazonBook} from '../amazon-book/amazon-book';
import {Author} from '../author/author';

export class BookInfo {
  id: number;
  title: string;
  bookStatus: string;
  saleDate: string;
  pagesCount: number;
  offerPrice: number;
  amazonBook: AmazonBook;
  authors: Author[];
  commentCount: number;
  interestedCount: number;

  constructor(id: number, title: string, bookStatus: string, saleDate: string, pagesCount: number,
              offerPrice: number, amazonBook: AmazonBook, authors: Author[], commentCount: number,
              interestedCount: number) {
    this.id = id;
    this.title = title;
    this.bookStatus = bookStatus;
    this.saleDate = saleDate;
    this.pagesCount = pagesCount;
    this.offerPrice = offerPrice;
    this.amazonBook = amazonBook;
    this.authors = authors;
    this.commentCount = commentCount;
    this.interestedCount = interestedCount;
  }
}
