from rest_framework import generics

from .models import Book, Author, User, BookAuthor, BookDetail, BookComment, CommentFavorite, ReadBook, InterestedBook
from .serializers import BookSerializer, AuthorSerializer, UserSerializer, BookAuthorSerializer, BookDetailSerializer, \
    BookCommentSerializer, CommentFavoriteSerializer, ReadBookSerializer, InterestedBookSerializer


class BookList(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class Book(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookDetailList(generics.ListCreateAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class BookDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class AuthorList(generics.ListCreateAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class Author(generics.RetrieveUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class User(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class BookAuthorList(generics.ListCreateAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorSerializer


class BookAuthor(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorSerializer


class BookCommentList(generics.ListCreateAPIView):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentSerializer


class BookComment(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentSerializer


class CommentFavoriteList(generics.ListCreateAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteSerializer


class CommentFavorite(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteSerializer


class ReadBookList(generics.ListCreateAPIView):
    queryset = ReadBook.objects.all()
    serializer_class = ReadBookSerializer


class ReadBook(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReadBook.objects.all()
    serializer_class = ReadBookSerializer


class InterestedBookList(generics.ListCreateAPIView):
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookSerializer


class InterestedBook(generics.RetrieveUpdateDestroyAPIView):
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookSerializer