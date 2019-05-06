export class Book {
  id: number;
  title: string;
  bookStatus: string;
  saleDate: string;
  pagesCount: number;
  offerPrice: number;
  amazonBook: string;

  constructor(id: number, title: string, bookStatus: string, saleDate: string, pagesCount: number, offerPrice: number, amazonBook: string) {
    this.id = id;
    this.title = title;
    this.bookStatus = bookStatus;
    this.saleDate = saleDate;
    this.pagesCount = pagesCount;
    this.offerPrice = offerPrice;
    this.amazonBook = amazonBook;
  }
}
