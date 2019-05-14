from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import *
from .serializers import *


class AuthInfoGetView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, format=None):
        return Response(data={
            'user_id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
        },
            status=status.HTTP_200_OK)


class BookListView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # def get_queryset(self):
    #     queryset = Author.objects.all()
    #     author_id = self.request.query_params.get('author_id', None)
    #     if author_id is not None:
    #         queryset = queryset.filter(author__author_id=author_id)
    #     return queryset


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

    def get_queryset(self):
        queryset = Book.objects.all()
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__book_id=book_id)
        return queryset


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
    serializer_class = BookCommentWithForeignSerializer

    # 登録処理ではuserとbookのidだけ指定で行いたいので、BookCommentSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = BookCommentSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = BookComment.objects.all()
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__id=book_id)
        return queryset


class BookCommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentSerializer


class CommentFavoriteListView(generics.ListCreateAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteWithForeignSerializer

    # serializer_class = CommentFavoriteSerializer

    def get_queryset(self):
        queryset = CommentFavorite.objects.all()
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        return queryset

    # 登録処理ではuserとcommentのidだけ指定で行いたいので、CommentFavoriteSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = CommentFavoriteSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


class CommentFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteSerializer


class ReadBookListView(generics.ListCreateAPIView):
    # permission_classes = (permissions.IsAuthenticated,)
    queryset = ReadBook.objects.all()
    serializer_class = ReadBookWithForeignSerializer

    # 登録処理ではuserとbookのidだけ指定で行いたいので、ReadBookSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = ReadBookSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    ### これでクエリパラメーターからユーザー情報を取得できる。しかし、認証しているかどうか判定できない...
    # def get_queryset(self):
    #     queryset = ReadBook.objects.all()
    #     account_name = self.request.query_params.get('account_name', None)
    #     if account_name is not None:
    #         queryset = queryset.filter(user__account_name=account_name)
    #     return queryset
    #
    ### これでリクエストパラメータからユーザー情報を取得できるよう。しかし、usernameを取得してqueryでFilter指定できない...
    # def get(self, request, format=None):
    #     return Response(data={
    #         'username': request.user.username,
    #         'email': request.user.email,
    #         },
    #         status=status.HTTP_200_OK)
    def get_queryset(self):
        queryset = ReadBook.objects.all()
        # accountNameがクエリパラメータで設定されている場合
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        # user_idとbook_idがクエリパラメータで設定されている場合
        user_id = self.request.query_params.get('user_id', None)
        book_id = self.request.query_params.get('book_id', None)
        if user_id is not None and book_id is not None:
            queryset = queryset.filter(user__id=user_id, book__id=book_id)
        return queryset


class ReadBookView(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = (permissions.IsAuthenticated,)
    queryset = ReadBook.objects.all()
    serializer_class = ReadBookSerializer


class InterestedBookListView(generics.ListCreateAPIView):
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookWithForeignSerializer

    # 登録処理ではuserとbookのidだけ指定で行いたいので、InterestedBookSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = InterestedBookSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = InterestedBook.objects.all()
        # accountNameがクエリパラメータで設定されている場合
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        # user_idとbook_idがクエリパラメータで設定されている場合
        user_id = self.request.query_params.get('user_id', None)
        book_id = self.request.query_params.get('book_id', None)
        if user_id is not None and book_id is not None:
            queryset = queryset.filter(user__id=user_id, book__id=book_id)
        return queryset


# TODO: ryo.saito pkだけで更新処理できるようにする。
class InterestedBookView(generics.RetrieveUpdateDestroyAPIView):
    # permission_classes = (permissions.IsAuthenticated,)
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookSerializer
