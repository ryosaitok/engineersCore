from django.urls import path

from .views import BookList, BookDetail, AuthorList, AuthorDetail, UserList, UserDetail


urlpatterns = [
    path('books/', BookList.as_view()),
    path('book/<int:pk>/', BookDetail.as_view()),
    path('authors/', AuthorList.as_view()),
    path('author/<int:pk>/', AuthorDetail.as_view()),
    path('users/', UserList.as_view()),
    path('user/<int:pk>/', UserDetail.as_view()),
]