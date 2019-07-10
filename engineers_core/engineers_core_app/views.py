from rest_framework import generics, permissions, status, exceptions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import FileUploadParser
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
from google.cloud import storage
import urllib.parse

TODAY = date.today()
BUCKET_NAME = 'test-packet-engineerscore'


class ProfileImageUploadView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    parser_class = (FileUploadParser,)

    # TODO: 一旦localに保存してからGCSに保存してlocalのファイルを削除している処理が無駄。直接ファイルをアップロードするように修正する。
    def post(self, request, *args, **kwargs):
        print('request.data: ', request.data)
        serializer = FileSerializer(data=request.data)
        if serializer.is_valid():
            # アクセス元の認証
            username = request.user.username
            if username == '' or username is None:
                return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False},
                                status=status.HTTP_401_UNAUTHORIZED)
            logged_in_user = get_user_by_acount_name(username)
            print("serializer.validated_data: ", serializer.validated_data)
            if logged_in_user.id != serializer.validated_data['user']:
                return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)

            # media配下に画像保存
            serializer.save()

            # media配下に保存した画像を取得してGoogle Cloud Storageに同名で保存する。
            # 日本語のファイル名は%エンコードされているからデコードする。
            image_file_name = urllib.parse.unquote(serializer.data.get('file'))
            account_name = request.user.username
            logged_id_user = User.objects.filter(account_name=account_name).first()
            upload_file_name = '{0}_{1}'.format(str(logged_id_user.id), str(TODAY))
            upload_file_path = 'image/profile/' + upload_file_name
            image_file_path = '.' + image_file_name
            client = storage.Client()
            bucket = client.get_bucket(BUCKET_NAME)
            blob = bucket.blob(upload_file_path)
            blob.upload_from_filename(image_file_path)

            # Userテーブルのprofile_image_linkにGCSのリンクを保存する。
            profile_image_link = 'https://storage.cloud.google.com/test-packet-engineerscore/' + upload_file_path
            logged_in_user.profile_image_link = profile_image_link
            logged_in_user.save()

            # 以降はGCSから画像データを参照するので、media配下の画像は不要。削除する。
            os.remove(image_file_path)

            return Response(data={'profile_image_link': profile_image_link, 'message': 'ファイルのアップロードに成功しました。'}
                            , status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            HOST = "http://127.0.0.1:4200/"
            subject = "【EngineersCore】仮登録が完了しました。\n"
            message = "EngineersCoreへのアカウント仮登録が完了しました。\n\n" \
                      "以下のURLからログインして、本登録を完了させると、ログインしてサービスをご利用いただけます。\n"\
                      + HOST + "signup/{}".format(token) + "このURLの有効期限は 1時間 です。\n" \
                      "あらかじめご了承ください。\n\n" \
                      "本メールに心当たりのない場合は、お手数ですが削除をお願いいたします。\n" \
                      "--------------------------------\n" \
                      "EngineersCore\n\n" \
                      "こちらのメールに返信はできませんので、ご注意ください。"
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
            HOST = "http://127.0.0.1:4200/"
            subject = "【EngineersCore】パスワード変更のご案内"
            message = "以下のURLからパスワードを変更いただけます。\n"\
                      + HOST + "password/reset/{}\n\n".format(token)\
                      + "このURLの有効期限は 1時間 です。\n" \
                      "あらかじめご了承ください。\n\n" \
                      "本メールに心当たりのない場合は、お手数ですが削除をお願いいたします。\n" \
                      "--------------------------------\n" \
                      "EngineersCore\n\n" \
                      "こちらのメールに返信はできませんので、ご注意ください。"
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
    permission_classes = (permissions.IsAuthenticated,)
    serializer = AuthUserSerializer

    def put(self, request, *args, **kwargs):
        update_username = request.data.get('username', None)
        print('update_username: ', update_username)
        if update_username is None:
            print('update_username is None')
            return Response(data={'message': 'usernameが指定されていません。', 'success': False},
                            status=status.HTTP_400_BAD_REQUEST)
        else:
            print('update_username is not None')
            # ログインしているユーザーのaccount_nameを更新する（AuthUserのusernameとUserのaccount_nameは、両方同じものである必要ある）
            logged_in_auth_user = request.user
            if logged_in_auth_user.id is None:
                print('logged_in_auth_user.id is None')
                return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False},
                                status=status.HTTP_401_UNAUTHORIZED)
            print('logged_in_auth_user.id is not None')
            # AuthUserとUserのusernameとaccount_nameを同じものに更新する。
            try:
                logged_in_auth_user = AuthUser.objects.filter(id=logged_in_auth_user.id).first()
                logged_in_auth_user.username = update_username
                logged_in_auth_user.save()
                logged_in_user = User.objects.filter(auth_user=logged_in_auth_user.id).first()
                logged_in_user.account_name = update_username
                logged_in_user.save()
                return Response(data={'message': 'アカウント名を更新しました', 'account_name': update_username, 'success': True},
                                status=status.HTTP_200_OK)
            except Exception as e:
                return Response(data={'message': e, 'account_name': update_username, 'success': True},
                                status=status.HTTP_400_BAD_REQUEST)


# TODO: トランザクションを貼る。
class AuthUserRegisterView(generics.CreateAPIView):
    serializer_class = AuthUserSerializer

    def post(self, request, *args, **kwargs):
        # TODO: APIを直に叩くとユーザー登録できてしまう問題解消必要。
        # AuthUserの登録
        print('request.data: ', request.data)
        serializer = AuthUserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            print('serializer.errors: ', serializer.errors)
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        email = serializer.validated_data['email']
        if email_address_exists(email):
            return Response(data={'message': '指定されたメールアドレスはすでに登録済みです。', 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()

        # Userの登録
        user = User()
        auth_user_id = serializer.data['id']
        auth_user = AuthUser.objects.filter(id=auth_user_id).first()
        user.auth_user = auth_user
        user.account_name = serializer.data['username']
        user.user_name = '吾輩は猫である'
        user.save()
        return Response(data={'message': 'ユーザーの登録が完了しました。', 'success': True}, status=status.HTTP_201_CREATED)


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


class BookListView(generics.ListAPIView):
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


class BookView(generics.RetrieveAPIView):
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


class BookDetailListView(generics.ListAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class BookDetailView(generics.RetrieveAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailSerializer


class BookDetailBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = BookDetail.objects.all()
    serializer_class = BookDetailBulkSerializer


class AuthorListView(generics.ListAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer

    def get_queryset(self):
        queryset = Book.objects.all()
        book_id = self.request.query_params.get('book_id', None)
        if book_id is not None:
            queryset = queryset.filter(book__book_id=book_id)
        return queryset


class AuthorView(generics.RetrieveAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer


class AuthorBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = Author.objects.all()
    serializer_class = AuthorBulkSerializer


class UserListView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = BookCommentSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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


# TODO: トランザクション貼る。
class UserView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'account_name'

    def put(self, request, *args, **kwargs):
        print('request.data: ', request.data)
        print('request.user.username: ', request.user.username)
        current_username = request.user.username
        if current_username == '' or current_username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        current_account_name = self.kwargs['account_name']
        if current_account_name != current_username:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)

        # account_nameを更新するとJWTのアクセストークンが無効になって再ログインが必要になるため、ここでは更新させずAuthUserViewで行う。
        user = get_user_by_acount_name(current_account_name)
        user_name = request.data['user_name']
        if user_name is not None:
            user.user_name = user_name
        description = request.data['description']
        if description is not None:
            user.description = description
        user.save()
        return Response(data={'message': 'ユーザーを更新しました。。', 'success': False}, status=status.HTTP_200_OK)


class BookAuthorListView(generics.ListAPIView):
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


class BookAuthorView(generics.RetrieveAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorSerializer


class BookAuthorBulkListView(ListBulkCreateUpdateDestroyAPIView):
    queryset = BookAuthor.objects.all()
    serializer_class = BookAuthorBulkSerializer


class BookCommentListView(generics.ListCreateAPIView):
    queryset = BookComment.objects.all()
    serializer_class = BookCommentWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = BookCommentSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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

    def delete(self, request, *args, **kwargs):
        serializer_class = BookCommentSerializer
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        comment_id = self.kwargs['pk']
        comment = BookComment.objects.filter(id=comment_id).first()
        if user.id != comment.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(comment)
        return Response(data={'message': 'コメントを削除しました。', 'success': True}, status=204)


class BookCommentReportListView(generics.ListCreateAPIView):
    queryset = BookCommentReport.objects.all()
    serializer_class = BookCommentReportWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = BookCommentReportSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

    def get_queryset(self):
        queryset = BookCommentReport.objects.all()
        return queryset


class CommentFavoriteListView(generics.ListCreateAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = CommentFavoriteSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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


class CommentFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommentFavorite.objects.all()
    serializer_class = CommentFavoriteSerializer

    def delete(self, request, *args, **kwargs):
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        favorite_id = self.kwargs['pk']
        favorite = CommentFavorite.objects.filter(id=favorite_id).first()
        if user.id != favorite.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(favorite)
        return Response(data={'message': 'いいねを削除しました。', 'success': True}, status=204)


class BookCommentReplyListView(generics.ListCreateAPIView):
    queryset = BookCommentReply.objects.all()
    serializer_class = BookCommentReplyWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = BookCommentReplySerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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

    def delete(self, request, *args, **kwargs):
        serializer_class = BookCommentReplySerializer
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        reply_id = self.kwargs['pk']
        reply = BookCommentReply.objects.filter(id=reply_id).first()
        if user.id != reply.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(reply)
        return Response(data={'message': '返信を削除しました。', 'success': True}, status=204)


class BookCommentReplyFavoriteListView(generics.ListCreateAPIView):
    queryset = BookCommentReplyFavorite.objects.all()
    serializer_class = BookCommentReplyFavoriteWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = BookCommentReplyFavoriteSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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


class BookCommentReplyFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = BookCommentReplyFavorite.objects.all()
    serializer_class = BookCommentReplyFavoriteSerializer

    def delete(self, request, *args, **kwargs):
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        favorite_id = self.kwargs['pk']
        favorite = BookCommentReplyFavorite.objects.filter(id=favorite_id).first()
        if user.id != favorite.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(favorite)
        return Response(data={'message': 'いいねを削除しました。', 'success': True}, status=204)


class BookCommentReplyReportListView(generics.ListCreateAPIView):
    queryset = BookCommentReplyReport.objects.all()
    serializer_class = BookCommentReplyReportWithForeignSerializer

    def get_queryset(self):
        queryset = BookCommentReplyReport.objects.all()
        return queryset

    def post(self, request, *args, **kwargs):
        serializer = BookCommentReplyReportSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)


class InterestedBookListView(generics.ListCreateAPIView):
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = InterestedBookSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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


class InterestedBookView(generics.RetrieveUpdateDestroyAPIView):
    queryset = InterestedBook.objects.all()
    serializer_class = InterestedBookSerializer

    def delete(self, request, *args, **kwargs):
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        interested_id = self.kwargs['pk']
        interested = InterestedBook.objects.filter(id=interested_id).first()
        if user.id != interested.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(interested)
        return Response(data={'message': '興味がある本を削除しました。', 'success': True}, status=204)


class ShelfListView(generics.ListCreateAPIView):
    queryset = Shelf.objects.all()
    serializer_class = ShelfWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = ShelfEditSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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


class ShelfView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Shelf.objects.all()
    serializer_class = ShelfWithForeignSerializer

    def put(self, request, *args, **kwargs):
        serializer_class = ShelfSerializer
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = ShelfEditSerializer(instance, data=request.data, partial=partial)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        serializer.is_valid()
        shelf_id = self.kwargs['pk']
        shelf = Shelf.objects.filter(id=shelf_id).first()
        if shelf is None:
            return Response(data={'message': '見つかりませんでした。', 'success': False}, status=status.HTTP_404_NOT_FOUND)
        logged_in_user = get_user_by_acount_name(username)
        if shelf.user.id != logged_in_user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.validated_data['user'] = logged_in_user
        self.perform_update(serializer)
        return Response(serializer.data)


class ShelfReportListView(generics.ListCreateAPIView):
    queryset = ShelfReport.objects.all()
    serializer_class = ShelfReportWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = ShelfReportSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

    def get_queryset(self):
        queryset = ShelfReport.objects.all()
        return queryset


class ShelfBookListView(generics.ListAPIView):
    queryset = ShelfBook.objects.all()
    serializer_class = ShelfBookWithForeignSerializer

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

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        shelf_ids = []
        for data in request.data:
            shelf_ids.append(data['shelf'])
        shelves = Shelf.objects.filter(id__in=shelf_ids)
        logged_in_user = get_user_by_acount_name(username)
        for shelf in shelves:
            if shelf.user.id != logged_in_user.id:
                return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        # 保存する
        self.perform_bulk_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = ShelfBookBulkSerializer(data=request.data)
        serializer.is_valid(raise_exception=False)
        shelf_id = self.request.query_params.get('shelf_id', None)
        if shelf_id is None:
            return Response(data={'message': '見つかりませんでした。', 'success': False}, status=status.HTTP_404_NOT_FOUND)
        else:
            shelf_books = ShelfBook.objects.filter(shelf_id=shelf_id)
            if len(shelf_books) == 0:
                return Response(data={'message': '見つかりませんでした。', 'success': False}, status=status.HTTP_404_NOT_FOUND)
            shelf = Shelf.objects.filter(id=shelf_id).first()
            if shelf is None:
                return Response(data={'message': '見つかりませんでした。', 'success': False}, status=status.HTTP_404_NOT_FOUND)
            logged_in_user = get_user_by_acount_name(username)
            if shelf.user.id != logged_in_user.id:
                return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
            shelf_books.delete()
            # TODO: 現状だと空のリストが返る。どうやったら削除したIDのリスト返せるのか...
            # 何も返らなくなるから明示的に空のリストを指定。
            return Response(data=[], status=status.HTTP_204_NO_CONTENT)


class ShelfFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfFavorite.objects.all()
    serializer_class = ShelfFavoriteSerializer

    def delete(self, request, *args, **kwargs):
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        favorite_id = self.kwargs['pk']
        favorite = ShelfFavorite.objects.filter(id=favorite_id).first()
        if user.id != favorite.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(favorite)
        return Response(data={'message': 'いいねを削除しました。', 'success': True}, status=204)


class ShelfFavoriteListView(generics.ListCreateAPIView):
    queryset = ShelfFavorite.objects.all()
    serializer_class = ShelfFavoriteWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = ShelfFavoriteSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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

    def delete(self, request, *args, **kwargs):
        serializer_class = ShelfCommentSerializer
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        comment_id = self.kwargs['pk']
        comment = ShelfComment.objects.filter(id=comment_id).first()
        if user.id != comment.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(comment)
        return Response(data={'message': 'コメントを削除しました。', 'success': True}, status=204)


class ShelfCommentListView(generics.ListCreateAPIView):
    queryset = ShelfComment.objects.all()
    serializer_class = ShelfCommentWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = ShelfCommentSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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


def get_user_by_acount_name(account_name):
    return User.objects.filter(account_name=account_name).first()


class ShelfCommentFavoriteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfCommentFavorite.objects.all()
    serializer_class = ShelfCommentFavoriteSerializer

    def delete(self, request, *args, **kwargs):
        serializer_class = ShelfCommentFavoriteSerializer
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        favorite_id = self.kwargs['pk']
        favorite = ShelfCommentFavorite.objects.filter(id=favorite_id).first()
        if user.id != favorite.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(favorite)
        return Response(data={'message': 'いいねを削除しました。', 'success': True}, status=204)


class ShelfCommentFavoriteListView(generics.ListCreateAPIView):
    queryset = ShelfCommentFavorite.objects.all()
    serializer_class = ShelfCommentFavoriteWithForeignSerializer

    def post(self, request, *args, **kwargs):
        serializer = ShelfCommentFavoriteSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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
        serializer = ShelfCommentReportSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)


class ShelfCommentReplyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ShelfCommentReply.objects.all()
    serializer_class = ShelfCommentReplyWithForeignSerializer

    def delete(self, request, *args, **kwargs):
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        reply_id = self.kwargs['pk']
        reply = ShelfCommentReply.objects.filter(id=reply_id).first()
        if user.id != reply.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(reply)
        return Response(data={'message': '返信を削除しました。', 'success': True}, status=204)


class ShelfCommentReplyListView(generics.ListCreateAPIView):
    queryset = ShelfCommentReply.objects.all()
    serializer_class = ShelfCommentReplyWithForeignSerializer

    # 登録処理ではuserとcommentのidだけ指定で行いたいので、ShelfCommentReplySerializerを使う。
    def post(self, request, *args, **kwargs):
        serializer = ShelfCommentReplySerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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

    def delete(self, request, *args, **kwargs):
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        user = get_user_by_acount_name(username)
        favorite_id = self.kwargs['pk']
        favorite = ShelfCommentReplyFavorite.objects.filter(id=favorite_id).first()
        if user.id != favorite.user.id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        self.perform_destroy(favorite)
        return Response(data={'message': 'いいねを削除しました。', 'success': True}, status=204)


class ShelfCommentReplyFavoriteListView(generics.ListCreateAPIView):
    queryset = ShelfCommentReplyFavorite.objects.all()
    serializer_class = ShelfCommentReplyFavoriteSerializer

    def post(self, request, *args, **kwargs):
        serializer = ShelfCommentReplyFavoriteSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)

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
        serializer = ShelfCommentReplyReportSerializer(data=request.data)
        username = request.user.username
        if username == '' or username is None:
            return Response(data={'message': 'ユーザー認証に失敗しました。', 'success': False}, status=status.HTTP_401_UNAUTHORIZED)
        logged_in_user = get_user_by_acount_name(username)
        try:
            serializer.is_valid(raise_exception=True)
        except exceptions.APIException as e:
            return Response(data={'message': serializer.errors, 'success': False}, status=status.HTTP_400_BAD_REQUEST)
        if logged_in_user.id != serializer.validated_data['user'].id:
            return Response(data={'message': 'アクセス権限がありません。', 'success': False}, status=status.HTTP_403_FORBIDDEN)
        serializer.save()
        return Response(serializer.data, status=201)
