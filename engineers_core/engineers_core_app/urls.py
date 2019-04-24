from django.urls import path

from .views import *

urlpatterns = [
    path('books/', BookListView.as_view()),
    path('book/<int:pk>/', BookView.as_view()),
    path('authors/', AuthorListView.as_view()),
    path('author/<int:pk>/', AuthorView.as_view()),
    path('users/', UserListView.as_view()),
    # path('user/<int:pk>/', User.as_view()),
    path('user/<str:account_name>/', UserView.as_view(), name='account_name'),
    path('bookcomments/', BookCommentListView.as_view()),
    path('bookcomment/<int:pk>/', BookCommentView.as_view()),
    path('commentfavorites/', CommentFavoriteListView.as_view()),
    path('commentfavorite/<int:pk>/', CommentFavoriteView.as_view()),
    path('bookdetails/', BookDetailListView.as_view()),
    path('bookdetail/<int:pk>/', BookDetailView.as_view()),
    path('bookauthors/', BookAuthorListView.as_view()),
    path('bookauthor/<int:pk>/', BookAuthorView.as_view()),
    path('readbooks/', ReadBookListView.as_view()),
    path('readbook/<int:pk>/', ReadBookView.as_view()),
    path('interestedbooks/', InterestedBookListView.as_view()),
    path('interestedbook/<int:user_id>/', InterestedBookView.as_view()),
]