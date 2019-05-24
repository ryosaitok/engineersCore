from rest_framework import generics, permissions, status
from rest_framework.response import Response

from .serializers import *
from django.db.models import Q


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


class AuthUserRegisterView(generics.ListCreateAPIView):
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer


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
            print('著者名での検索はデータ連結の方法わかってなくて未実装')
            # queryset = queryset.filter(book__author_name__icontains=author)
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


class BookFeatureCategoryView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookFeatureCategory.objects.all()
    serializer_class = BookFeatureCategorySerializer


class BookFeatureCategoryListView(generics.ListCreateAPIView):
    queryset = BookFeatureCategory.objects.all()
    serializer_class = BookFeatureCategorySerializer

    # 登録処理ではidだけ指定で行いたいので、BookFeatureCategorySerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = BookFeatureCategorySerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


class BookFeatureView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookFeature.objects.all()
    serializer_class = BookFeatureSerializer


class BookFeatureListView(generics.ListCreateAPIView):
    queryset = BookFeature.objects.all()
    serializer_class = BookFeatureWithForeignSerializer

    # 登録処理ではcategoryとbookのidだけ指定で行いたいので、BookFeatureSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = BookFeatureSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = BookFeature.objects.all()
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__id=book_id)
        category_id = self.request.query_params.get('category_id', None)
        if category_id is not None:
            queryset = queryset.filter(book_feature_category__id=category_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('BookFeatureListViewのSQL: ' + str(compiler.as_sql()))
        return queryset
