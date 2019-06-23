export class ShelfBook {
  shelfBookId: number;
  shelfId: number;
  bookId: number;
  displayOrder: number;

  constructor(shelfBookId: number, shelfId: number, bookId: number, displayOrder: number) {
    this.shelfBookId = shelfBookId;
    this.shelfId = shelfId;
    this.bookId = bookId;
    this.displayOrder = displayOrder;
  }
}
