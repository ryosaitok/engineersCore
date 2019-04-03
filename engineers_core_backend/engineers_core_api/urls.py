from django.urls import path

from .views import BookList, Book, AuthorList, Author, UserList, User, BookAuthorList, BookAuthor, BookDetailList, \
    BookDetail, BookCommentList, BookComment, CommentFavoriteList, CommentFavorite, ReadBookList, ReadBook, \
    InterestedBookList, InterestedBook


urlpatterns = [
    path('books/', BookList.as_view()),
    path('book/<int:pk>/', Book.as_view()),
    path('authors/', AuthorList.as_view()),
    path('author/<int:pk>/', Author.as_view()),
    path('users/', UserList.as_view()),
    path('user/<int:pk>/', User.as_view()),
    path('bookcomments/', BookCommentList.as_view()),
    path('bookcomment/<int:pk>/', BookComment.as_view()),
    path('commentfavorites/', CommentFavoriteList.as_view()),
    path('commentfavorite/<int:pk>/', CommentFavorite.as_view()),
    path('bookdetails/', BookDetailList.as_view()),
    path('bookdetail/<int:pk>/', BookDetail.as_view()),
    path('bookauthors/', BookAuthorList.as_view()),
    path('bookauthor/<int:pk>/', BookAuthor.as_view()),
    path('readbooks/', ReadBookList.as_view()),
    path('readbook/<int:pk>/', ReadBook.as_view()),
    path('interestedbooks/', InterestedBookList.as_view()),
    path('interestedbook/<int:pk>/', InterestedBook.as_view()),
]