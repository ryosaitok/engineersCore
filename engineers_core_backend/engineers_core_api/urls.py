from django.urls import path

from .views import BookList, Book, AuthorList, Author, UserList, User, BookAuthorList, BookAuthor, BookDetailList, BookDetail, BookReportList, BookReport


urlpatterns = [
    path('books/', BookList.as_view()),
    path('book/<int:pk>/', Book.as_view()),
    path('authors/', AuthorList.as_view()),
    path('author/<int:pk>/', Author.as_view()),
    path('users/', UserList.as_view()),
    path('user/<int:pk>/', User.as_view()),
    path('bookreports/', BookReportList.as_view()),
    path('bookreport/<int:pk>/', BookReport.as_view()),
    path('bookdetails/', BookDetailList.as_view()),
    path('bookdetail/<int:pk>/', BookDetail.as_view()),
    path('bookauthors/', BookAuthorList.as_view()),
    path('bookauthor/<int:pk>/', BookAuthor.as_view()),
]