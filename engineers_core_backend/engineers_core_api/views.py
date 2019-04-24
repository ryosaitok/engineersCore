from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *


class BookListView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookDetailListView(generics.ListCreateAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class AuthorListView(generics.ListCreateAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class AuthorView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'account_name'


class BookAuthorListView(generics.ListCreateAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorSerializer


class BookAuthorView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorSerializer


class BookCommentListView(generics.ListCreateAPIView):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentSerializer


class BookCommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentSerializer


class CommentFavoriteListView(generics.ListCreateAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteSerializer


class CommentFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteSerializer


class ReadBookListView(generics.ListCreateAPIView):
    queryset = ReadBook.objects.all()
    serializer_class = ReadBookSerializer

    def get_queryset(self):
        queryset = ReadBook.objects.all()
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        return queryset


class ReadBookView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReadBook.objects.all()
    serializer_class = ReadBookSerializer


class InterestedBookListView(generics.ListCreateAPIView):
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookSerializer


class InterestedBookView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookSerializer
