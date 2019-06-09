from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework_bulk import ListBulkCreateUpdateDestroyAPIView

from .serializers import *
from django.db.models import Q
from django.db.models import F


class AuthInfoGetView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get(self, request, format=None):
        return Response(data={
            'user_id': request.user.id,
            'account_name': request.user.username,
            'email': request.user.email,
        },
            status=status.HTTP_200_OK)


class BookListView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        queryset = Book.objects.all()
        title = self.request.query_params.get('title', None)
        if title is not None:
            queryset = queryset.filter(title__icontains=title)
        author_name = self.request.query_params.get('author', None)
        if author_name is not None:
            queryset = queryset.filter(authors__author_name__icontains=author_name)
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(BookListView, self).filter_queryset(queryset)
        sort = self.request.query_params.get('sort', None)
        if sort is not None:
            if sort == 'sale_date':
                return queryset.order_by(F('sale_date').desc(nulls_last=True))
        return queryset.order_by(F('amazon_book__sales_rank').asc(nulls_last=True))


class BookView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class BookBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookBulkSerializer


class AmazonBookBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = AmazonBook.objects.all()
    serializer_class = AmazonBookBulkSerializer


class BookDetailListView(generics.ListCreateAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class BookDetailBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailBulkSerializer


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


class AuthorBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorBulkSerializer


class AuthUserRegisterView(generics.ListCreateAPIView):
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer


class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        queryset = User.objects.all()
        # ユーザー名orアカウント名で検索
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(Q(account_name__icontains=user) | Q(user_name__icontains=user))
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('UserListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(UserListView, self).filter_queryset(queryset)
        return queryset.order_by('id')


class UserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'account_name'


class BookAuthorListView(generics.ListCreateAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorSerializer

    def get_queryset(self):
        queryset = BookAuthor.objects.all()
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__id=book_id)
        author_id = self.request.query_params.get('author_id', None)
        if author_id is not None:
            queryset = queryset.filter(author__id=author_id)
        return queryset


class BookAuthorView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorSerializer


class BookAuthorBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorBulkSerializer


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
        # アカウント名で検索
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        # 本IDで検索
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__id=book_id)
        # 本のタイトルで検索
        title = self.request.query_params.get('title', None)
        if title is not None:
            queryset = queryset.filter(book__title__icontains=title)
        # 本の著者名で検索
        author = self.request.query_params.get('author', None)
        if author is not None:
            queryset = queryset.filter(book__authors__author_name__icontains=author)
        # ユーザー名orアカウント名で検索
        user = self.request.query_params.get('user', None)
        if user is not None:
            queryset = queryset.filter(Q(user__account_name__icontains=user) | Q(user__user_name__icontains=user))
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('BookCommentListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(BookCommentListView, self).filter_queryset(queryset)
        return queryset.order_by('-id')


class BookCommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentWithForeignSerializer


class CommentFavoriteListView(generics.ListCreateAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteWithForeignSerializer

    def get_queryset(self):
        queryset = CommentFavorite.objects.all()
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        # user_idとcomment_idがクエリパラメータで設定されている場合
        user_id = self.request.query_params.get('user_id', None)
        comment_id = self.request.query_params.get('comment_id', None)
        if user_id is not None and comment_id is not None:
            queryset = queryset.filter(user__id=user_id, comment__id=comment_id)
        elif user_id is not None and comment_id is None:
            queryset = queryset.filter(user__id=user_id)
        elif user_id is None and comment_id is not None:
            queryset = queryset.filter(comment__id=comment_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('CommentFavoriteListViewのSQL: ' + str(compiler.as_sql()))
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


class BookCommentReplyListView(generics.ListCreateAPIView):
    queryset = BookCommentReply.objects.all()
    serializer_class = BookCommentReplyWithForeignSerializer

    # 登録処理ではuserとcommentのidだけ指定で行いたいので、BookCommentReplySerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = BookCommentReplySerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = BookCommentReply.objects.all()
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        comment_id = self.request.query_params.get('comment_id', None)
        if comment_id is not None:
            queryset = queryset.filter(comment__id=comment_id)
        return queryset


class BookCommentReplyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookCommentReply.objects.all()
    serializer_class = BookCommentReplySerializer


class BookCommentReplyFavoriteListView(generics.ListCreateAPIView):
    queryset = BookCommentReplyFavorite.objects.all()
    serializer_class = BookCommentReplyFavoriteSerializer

    def get_queryset(self):
        queryset = BookCommentReplyFavorite.objects.all()
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        return queryset

    # 登録処理ではuserとcommentのidだけ指定で行いたいので、BookCommentReplyFavoriteSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = BookCommentReplyFavoriteSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


class BookCommentReplyFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookCommentReplyFavorite.objects.all()
    serializer_class = BookCommentReplyFavoriteSerializer


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
        elif user_id is not None and book_id is None:
            queryset = queryset.filter(user__id=user_id)
        elif user_id is None and book_id is not None:
            queryset = queryset.filter(book__id=book_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('CommentFavoriteListViewのSQL: ' + str(compiler.as_sql()))
        return queryset


# TODO: ryo.saito pkだけで更新処理できるようにする。
class InterestedBookView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookSerializer


class ShelfView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shelf.objects.all()
    serializer_class = ShelfSerializer


class ShelfListView(generics.ListCreateAPIView):
    queryset = Shelf.objects.all()
    serializer_class = ShelfSerializer

    # 登録処理ではidだけ指定で行いたいので、BookFeatureCategorySerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = ShelfSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = Shelf.objects.filter(shelf_status='OPN')
        shelf_cd = self.request.query_params.get('shelf_cd', None)
        if shelf_cd is not None:
            queryset = queryset.filter(shelf_cd=shelf_cd)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfListViewのSQL: ' + str(compiler.as_sql()))
        return queryset


class ShelfBookView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfBook.objects.all()
    serializer_class = ShelfBookSerializer


class ShelfBookListView(generics.ListCreateAPIView):
    queryset = ShelfBook.objects.all()
    serializer_class = ShelfBookWithForeignSerializer

    # 登録処理ではcategoryとbookのidだけ指定で行いたいので、BookFeatureSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = ShelfBookSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = ShelfBook.objects.filter(shelf__shelf_status='OPN')
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__id=book_id)
        shelf_cd = self.request.query_params.get('shelf_cd', None)
        if shelf_cd is not None:
            queryset = queryset.filter(shelf_book__shelf_cd=shelf_cd)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfBookListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfBookListView, self).filter_queryset(queryset)
        return queryset.order_by('shelf_book__display_order', 'display_order')


class ShelfFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfFavorite.objects.all()
    serializer_class = ShelfFavoriteSerializer


class ShelfFavoriteListView(generics.ListCreateAPIView):
    queryset = ShelfFavorite.objects.all()
    serializer_class = ShelfFavoriteWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = ShelfFavoriteSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = ShelfFavorite.objects.filter(shelf__shelf_status='OPN')
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        shelf_id = self.request.query_params.get('shelf_id', None)
        if shelf_id is not None:
            queryset = queryset.filter(shelf__id=shelf_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfFavoriteListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfFavoriteListView, self).filter_queryset(queryset)
        return queryset.order_by('shelf__display_order')


class ShelfCommentView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfComment.objects.all()
    serializer_class = ShelfCommentSerializer


class ShelfCommentListView(generics.ListCreateAPIView):
    queryset = ShelfComment.objects.all()
    serializer_class = ShelfCommentWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = ShelfCommentSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = ShelfComment.objects.filter(shelf__shelf_status='OPN')
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        shelf_cd = self.request.query_params.get('shelf_cd', None)
        if shelf_cd is not None:
            queryset = queryset.filter(shelf__shelf_cd=shelf_cd)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfCommentListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfCommentListView, self).filter_queryset(queryset)
        return queryset.order_by('shelf__display_order')


class ShelfCommentFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfCommentFavorite.objects.all()
    serializer_class = ShelfCommentFavoriteSerializer


class ShelfCommentFavoriteListView(generics.ListCreateAPIView):
    queryset = ShelfCommentFavorite.objects.all()
    serializer_class = ShelfCommentFavoriteWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = ShelfCommentFavoriteSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = ShelfCommentFavorite.objects.filter(shelf_comment__shelf__shelf_status='OPN')
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        comment_id = self.request.query_params.get('comment_id', None)
        if comment_id is not None:
            queryset = queryset.filter(shelf_comment__id=comment_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfCommentFavoriteListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfCommentFavoriteListView, self).filter_queryset(queryset)
        return queryset.order_by('favorite_date')
