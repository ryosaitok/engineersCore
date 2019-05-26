# coding=utf-8

from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import User as AuthUser


class AuthUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Users must have a email address')
        email = AuthUserManager.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        return self.create_user(email, password)


class User(models.Model):
    auth_user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=True)
    user_name = models.CharField(max_length=128)
    account_name = models.CharField(max_length=128, unique=True, db_index=True)
    description = models.TextField(max_length=128, null=True)
    profile_image_link = models.CharField(max_length=128, unique=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'user'

    def __str__(self):
        return self.user_name


class Author(models.Model):
    author_name = models.CharField(max_length=128, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'author'

    def __str__(self):
        return self.author_name


class Book(models.Model):
    title = models.CharField(max_length=255, db_index=True)
    authors = models.ManyToManyField(Author, through='BookAuthor')
    book_status_choices = [
        ['PRE', 'Pre-Sales'],
        ['PUB', 'Published'],
        ['OOP', 'Out Of Print'],
    ]
    book_status = models.CharField(choices=book_status_choices,
                   default='PUB',
                   max_length=10)
    sale_date = models.DateField(null=True)
    pages_count = models.IntegerField()
    # 一旦税込価格とする
    offer_price = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'book'

    def __str__(self):
        return self.title


class BookAuthor(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("book", "author")
        db_table = 'book_author'

    def __str__(self):
        return self.book.title


class BookDetail(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    summary = models.TextField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'book_detail'

    def __str__(self):
        return self.book.title


class AmazonBook(models.Model):
    book = models.ForeignKey(Book, related_name='amazon_book', on_delete=models.CASCADE)
    data_asin = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'amazon_book'

    def __str__(self):
        return self.book.title


class BookComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    comment_text = models.TextField(max_length=10000)
    comment_date = models.DateField(auto_now=True)
    read_date = models.DateField(auto_now=True)
    tweet_flag = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'book_comment'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.book.title


class CommentFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(BookComment, related_name='favorite_users', on_delete=models.CASCADE)
    favorite_date = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "comment")
        db_table = 'comment_favorite'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.comment.comment_text


class BookCommentReply(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(BookComment, related_name='reply_ids', on_delete=models.CASCADE)
    comment_text = models.TextField(max_length=10000)
    comment_date = models.DateField(auto_now=True)
    tweet_flag = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'book_comment_reply'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.comment.comment_text


class BookCommentReplyFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reply = models.ForeignKey(BookCommentReply, on_delete=models.CASCADE)
    favorite_date = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'book_comment_reply_favorite'

    # Django標準API画面で表示できない...
    # def __str__(self):
    #     return '【' + self.user.user_name + '】', self.user.user_name


class InterestedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    interested_date = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'interested_book'
        unique_together = ("user", "book")

    def __str__(self):
        return '【' + self.user.user_name + '】', self.book.title


class BookFeatureCategory(models.Model):
    category_name = models.TextField(max_length=1000)
    category_cd = models.CharField(max_length=128, unique=True)
    display_order = models.IntegerField(null=True)
    feature_status_choices = [
        ['OPN', 'Open'],
        ['DFT', 'Draft'],
        ['NOT', 'Not Open'],
    ]
    feature_status = models.CharField(choices=feature_status_choices, default='DFT', max_length=8)
    description = models.TextField(max_length=1000, null=True)
    books = models.ManyToManyField(Book, through='BookFeature')
    producer = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'book_feature_category'

    def __str__(self):
        return self.category_name


class BookFeature(models.Model):
    book_feature_category = models.ForeignKey(BookFeatureCategory, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    display_order = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'book_feature'
        unique_together = ("book_feature_category", "book")

    def __str__(self):
        return str(self.display_order)
