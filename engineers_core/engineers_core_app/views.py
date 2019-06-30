from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework_bulk import ListBulkCreateUpdateDestroyAPIView
from .serializers import *
from django.db.models import Q
from django.db.models import F
from django.db.models import Count
from datetime import date
from django.core.mail import send_mail
from django.contrib.auth import password_validation
from django.core.validators import validate_email
import binascii
import os

TODAY = date.today()


class EmailVerificationView(generics.CreateAPIView):
    serializer_class = EmailVerificationSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = EmailVerificationSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)

        email = serializer_class.validated_data.get('email', None)
        try:
            validate_email(email)
        except Exception as e:
            print('EmailValidatorのe: ', e)
            return Response(data={'message': 'メールアドレスの形式が正しくありません。', 'reasons': e}, status=400)
        # すでに登録済みユーザーのメアドが指定された場合は登録済みとレスポンス
        if email_address_exists(email):
            return Response(data={'email': email, 'message': '指定されたメールアドレスは、すでに登録されています。'}, status=400)
        # まだ登録されていないメールアドレスの場合は、一意なトークンを持った認証用のメールを送信する
        token = generate_key()
        success = send_email_confirmation(email, 'info@engineers-core.mail', token)
        if success:
            # メールアドレス認証前のメールアドレス・トークンの保存
            serializer_class.validated_data['token'] = token
            serializer_class.is_valid(raise_exception=True)
            print('serializer_class.validated_data: ', serializer_class.validated_data)
            serializer_class.save()
            # アドレス+メール送信成功した場合はメール送信成功の旨を返す
            print('serializer_class.data: ', serializer_class.data)
            return Response(data={'email': email, 'message': 'メール送信処理に成功しました。'}, status=201)
        else:
            return Response(data={'email': email, 'message': 'メール送信処理に失敗しました。'}, status=500)


def email_address_exists(email):
    users = AuthUser.objects
    is_exist = users.filter(email=email).exists()
    if is_exist:
        return True
    else:
        return False


def generate_key():
    return binascii.hexlify(os.urandom(20)).decode()


def send_email_confirmation(email_address, from_address, token):
    try:
        if email_address is not None:
            subject = "【EngineersCore】仮登録が完了しました。こちらのメールから本登録できます。"
            message = "こちらから本登録を完了させると、ログインしてサービスをご利用いただけます。\n" \
                      "http://127.0.0.1:4200/signup/{}".format(token)
            from_email = from_address
            recipient_list = [email_address]
            sent_count = send_mail(subject, message, from_email, recipient_list)
            if sent_count == 1:
                return True
            else:
                return False
    except Exception as e:
        print(e)
        return False


class EmailVerifyView(generics.ListCreateAPIView):
    serializer_class = EmailVerificationSerializer

    def get_queryset(self):
        # トークンをもとにレコード取得
        token = self.request.query_params.get('token', None)
        queryset = EmailVerification.objects.filter(token=token)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('EmailVerifyViewのSQL: ' + str(compiler.as_sql()))
        print('queryset: ', queryset)
        if queryset:
            return queryset
        else:
            return Response('トークンが無効', status=400)


class PasswordReminderView(generics.CreateAPIView):
    serializer_class = PasswordReminderSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = PasswordReminderSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)

        email = serializer_class.validated_data.get('email', None)
        # 登録されていないメアドが指定された場合は未登録エラーのレスポンス
        if not email_address_exists(email):
            return Response(data={'email': email, 'message': '指定されたメールアドレスのユーザーは、登録されていません。', 'success': False},
                            status=400)
        # 登録済みメールアドレスの場合は、一意なトークンを持った認証用のメールを送信する
        token = generate_key()
        success = send_password_reminder(email, 'info@engineers-core.mail', token)
        if success:
            # パスワード変更前のメールアドレス・トークンの保存
            serializer_class.validated_data['token'] = token
            serializer_class.is_valid(raise_exception=True)
            print('serializer_class.validated_data: ', serializer_class.validated_data)
            serializer_class.save()
            # アドレス+メール送信成功した場合はメール送信成功の旨を返す
            print('serializer_class.data: ', serializer_class.data)
            return Response(data={'email': email, 'message': 'メール送信処理に成功しました。', 'success': True}, status=201)
        else:
            return Response(data={'email': email, 'message': 'メール送信処理に失敗しました。', 'success': False}, status=500)


def send_password_reminder(email_address, from_address, token):
    try:
        if email_address is not None:
            subject = "【EngineersCore】こちらのメールからパスワード変更ができます。"
            message = "こちらからパスワード変更ができます。\n" \
                      "http://127.0.0.1:4200/password/reset/{}".format(token)
            from_email = from_address
            recipient_list = [email_address]
            sent_count = send_mail(subject, message, from_email, recipient_list)
            if sent_count == 1:
                return True
            else:
                return False
    except Exception as e:
        print(e)
        return False


class VerifyPasswordReminderView(generics.ListCreateAPIView):
    serializer_class = AuthUserSerializer

    def get_queryset(self):
        # トークンをもとにレコード取得
        token = self.request.query_params.get('token', None)
        queryset = PasswordReminder.objects.filter(token=token)
        print('queryset: ', queryset)
        email = queryset[0].email
        print('queryset[0].email: ', queryset[0].email)
        authUsers = AuthUser.objects.filter(email=email)
        print('authUsers: ', authUsers)
        if authUsers:
            return authUsers
        else:
            return Response('トークンが無効', status=400)


class PasswordResetView(generics.UpdateAPIView):

    def put(self, request, *args, **kwargs):
        serializer_class = PasswordResetSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)

        # パスワードリマインダーメールのtokenでメールを照合し、メールで認証ユーザーを特定し、パスワード更新
        token = self.request.query_params.get('token', None)
        reminders = PasswordReminder.objects.filter(token=token)
        if len(reminders) != 1:
            return Response(data={'message': 'トークンが無効です。', 'success': False}, status=400)
        email = reminders.first().email
        auth_user = AuthUser.objects.filter(email=email).first()
        if auth_user is None:
            return Response(data={'message': 'トークンが無効です。', 'success': False}, status=400)
        # パスワードの形式をチェックし、問題がなければ暗号化
        password = serializer_class.validated_data.get('password', None)
        print('password: ', password)
        try:
            password_validation.validate_password(password)
        except Exception as e:
            print('password_validation.validate_password(password)のe: ', e)
            return Response(data={'message': 'パスワードの形式が正しくありません。', 'success': False, 'reasons': e}, status=400)
        auth_user.password = make_password(password)
        print('auth_user.password: ', auth_user.password)
        try:
            # パスワードを更新したインスタンスでDB更新
            auth_user.save()
            return Response(data={'message': 'パスワード更新処理が成功しました。', 'success': True}, status=200)
        except Exception as e:
            print('PasswordResetView パスワード更新処理でerror: ', e)
            return Response(data={'message': 'PasswordResetView パスワード更新処理でerror', 'success': False}, status=500)


class AuthUserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer


class AuthUserListView(generics.ListCreateAPIView):
    queryset = AuthUser.objects.all()
    serializer_class = AuthUserSerializer

    def get_queryset(self):
        queryset = AuthUser.objects.all()
        # ユーザー名orアカウント名で検索
        email = self.request.query_params.get('email', None)
        if email is not None:
            queryset = queryset.filter(email=email)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('AuthUserListViewのSQL: ' + str(compiler.as_sql()))
        return queryset


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
        queryset = super(BookListView, self).filter_queryset(queryset).annotate(comment_count=Count('book_comments'))
        sort = self.request.query_params.get('sort', None)
        if sort is not None:
            if sort == 'sale_date':
                return queryset.order_by(F('sale_date').desc(nulls_last=True))
            if sort == 'popular':
                return queryset.order_by(F('comment_count').desc(nulls_last=True))
        return queryset.order_by(F('amazon_book__sales_rank').asc(nulls_last=True))


class BookView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    def get_queryset(self):
        queryset = Book.objects.all().annotate(comment_count=Count('book_comments'))
        return queryset


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
        sort = self.request.query_params.get('sort', None)
        if sort is not None:
            if sort == 'new':
                return queryset.order_by('-id')
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


class BookCommentReportListView(generics.ListCreateAPIView):
    queryset = BookCommentReport.objects.all()
    serializer_class = BookCommentReportWithForeignSerializer

    def get_queryset(self):
        queryset = BookCommentReport.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer_class = BookCommentReportSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


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

    def filter_queryset(self, queryset):
        queryset = super(BookCommentReplyListView, self).filter_queryset(queryset)
        return queryset.order_by('-id')


class BookCommentReplyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookCommentReply.objects.all()
    serializer_class = BookCommentReplyWithForeignSerializer


class BookCommentReplyFavoriteListView(generics.ListCreateAPIView):
    queryset = BookCommentReplyFavorite.objects.all()
    serializer_class = BookCommentReplyFavoriteWithForeignSerializer

    def get_queryset(self):
        queryset = BookCommentReplyFavorite.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        comment_reply_id = self.request.query_params.get('comment_reply_id', None)
        if comment_reply_id is not None:
            queryset = queryset.filter(book_comment_reply__id=comment_reply_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('BookCommentReplyFavoriteListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(BookCommentReplyFavoriteListView, self).filter_queryset(queryset)
        return queryset.order_by('favorite_date')

    # 登録処理ではuserとcommentのidだけ指定で行いたいので、BookCommentReplyFavoriteSerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = BookCommentReplyFavoriteSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


class BookCommentReplyFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookCommentReplyFavorite.objects.all()
    serializer_class = BookCommentReplyFavoriteSerializer


class BookCommentReplyReportListView(generics.ListCreateAPIView):
    queryset = BookCommentReplyReport.objects.all()
    serializer_class = BookCommentReplyReportWithForeignSerializer

    def get_queryset(self):
        queryset = BookCommentReplyReport.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer_class = BookCommentReplyReportSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


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

    def put(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = ShelfEditSerializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ShelfReportListView(generics.ListCreateAPIView):
    queryset = ShelfReport.objects.all()
    serializer_class = ShelfReportWithForeignSerializer

    def get_queryset(self):
        queryset = ShelfReport.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer_class = ShelfReportSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


class ShelfListView(generics.ListCreateAPIView):
    queryset = Shelf.objects.all()
    serializer_class = ShelfSerializer

    # 登録処理ではidだけ指定で行いたいので、BookFeatureCategorySerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = ShelfEditSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = Shelf.objects.filter(shelf_status='OPN')
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        account_name = self.request.query_params.get('account_name', None)
        if account_name is not None:
            queryset = queryset.filter(user__account_name=account_name)
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfListView, self).filter_queryset(queryset).annotate(favorite_count=Count('favorite_users'))
        sort = self.request.query_params.get('sort', None)
        if sort is not None:
            if sort == 'new':
                return queryset.order_by(F('id').desc(nulls_last=True))
            if sort == 'popular':
                return queryset.order_by(F('favorite_count').desc(nulls_last=True))
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
        shelf_id = self.request.query_params.get('shelf_id', None)
        if shelf_id is not None:
            queryset = queryset.filter(shelf_id=shelf_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfBookListViewのSQL: ' + str(compiler.as_sql()))
        return queryset


class ShelfBookBulkView(ListBulkCreateUpdateDestroyAPIView):
    queryset = ShelfBook.objects.all()
    serializer_class = ShelfBookBulkSerializer

    def delete(self, request, *args, **kwargs):
        serializer_class = ShelfBookBulkSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=False)

        # TODO: 現状だと空のリストが返る。どうやったら削除したIDのリスト返せるのか...
        id_list = self.request.query_params.getlist('id', None)
        if len(id_list) != 0:
            query_set = ShelfBook.objects.filter(id__in=id_list)
            if len(query_set) == 0:
                return Response(data=query_set, status=404)
            query_set.delete()
            # 何も返らなくなるから明示的に空のリストを指定。
            return Response(data=[], status=204)

        shelf_id = self.request.query_params.get('shelf_id', None)
        if shelf_id is not None:
            query_set = ShelfBook.objects.filter(shelf=shelf_id)
            if len(query_set) == 0:
                return Response(data=query_set, status=404)
            query_set.delete()
            return Response(data=[], status=204)

        return Response(data=serializer_class.validated_data, status=400)


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
    serializer_class = ShelfCommentWithForeignSerializer


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
        shelf_id = self.request.query_params.get('shelf_id', None)
        if shelf_id is not None:
            queryset = queryset.filter(shelf=shelf_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfCommentListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfCommentListView, self).filter_queryset(queryset)
        return queryset.order_by('-id')


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


class ShelfCommentReportListView(generics.ListCreateAPIView):
    queryset = ShelfCommentReport.objects.all()
    serializer_class = ShelfCommentReportWithForeignSerializer

    def get_queryset(self):
        queryset = ShelfCommentReport.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer_class = ShelfCommentReportSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)


class ShelfCommentReplyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfCommentReply.objects.all()
    serializer_class = ShelfCommentReplyWithForeignSerializer


class ShelfCommentReplyListView(generics.ListCreateAPIView):
    queryset = ShelfCommentReply.objects.all()
    serializer_class = ShelfCommentReplyWithForeignSerializer

    # 登録処理ではuserとcommentのidだけ指定で行いたいので、ShelfCommentReplySerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer_class = ShelfCommentReplySerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = ShelfCommentReply.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        comment_id = self.request.query_params.get('comment_id', None)
        if comment_id is not None:
            queryset = queryset.filter(comment=comment_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfCommentReplyListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfCommentReplyListView, self).filter_queryset(queryset)
        return queryset.order_by('-id')


class ShelfCommentReplyFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfCommentReplyFavorite.objects.all()
    serializer_class = ShelfCommentReplyFavoriteSerializer


class ShelfCommentReplyFavoriteListView(generics.ListCreateAPIView):
    queryset = ShelfCommentReplyFavorite.objects.all()
    serializer_class = ShelfCommentReplyFavoriteWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer_class = ShelfCommentReplyFavoriteSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)

    def get_queryset(self):
        queryset = ShelfCommentReplyFavorite.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user__id=user_id)
        comment_reply_id = self.request.query_params.get('comment_reply_id', None)
        if comment_reply_id is not None:
            queryset = queryset.filter(shelf_comment_reply__id=comment_reply_id)
        compiler = queryset.query.get_compiler(using=queryset.db)
        print('ShelfCommentFavoriteListViewのSQL: ' + str(compiler.as_sql()))
        return queryset

    def filter_queryset(self, queryset):
        queryset = super(ShelfCommentReplyFavoriteListView, self).filter_queryset(queryset)
        return queryset.order_by('favorite_date')


class ShelfCommentReplyReportListView(generics.ListCreateAPIView):
    queryset = ShelfCommentReplyReport.objects.all()
    serializer_class = ShelfCommentReplyReportWithForeignSerializer

    def get_queryset(self):
        queryset = ShelfCommentReplyReport.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer_class = ShelfCommentReplyReportSerializer(data=request.data)
        serializer_class.is_valid(raise_exception=True)
        serializer_class.save()
        return Response(serializer_class.data, status=201)
