export class AmazonBook {
  amazonBookId: number;
  bookId: number;
  dataAsin: string;
  salesRank: number;

  constructor(amazonBookId: number, bookId: number, dataAsin: string, salesRank: number) {
    this.amazonBookId = amazonBookId;
    this.bookId = bookId;
    this.dataAsin = dataAsin;
    this.salesRank = salesRank;
  }
}
