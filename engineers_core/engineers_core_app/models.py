# coding=utf-8
from enum import Enum
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser, _user_has_perm, AbstractUser
)

from django.db import models
from django.contrib.auth.models import User as AuthUser


class User(models.Model):
    auth_user = models.ForeignKey(AuthUser, on_delete=models.CASCADE, null=True)
    user_name = models.CharField(max_length=128)
    account_name = models.CharField(max_length=128, unique=True, db_index=True)
    description = models.TextField(max_length=512, null=True)
    profile_image_link = models.ImageField(unique=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_name


class Author(models.Model):
    author_name = models.CharField(max_length=128, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.author_name


class Book(models.Model):
    title = models.CharField(max_length=255, db_index=True)
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

    def __str__(self):
        return self.title


class BookAuthor(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("book", "author")

    def __str__(self):
        return self.book.title


class BookDetail(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    summary = models.TextField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.book.title


class AmazonBook(models.Model):
    book = models.ForeignKey(Book, related_name='amazon_book', on_delete=models.CASCADE)
    data_asin = models.CharField(max_length=64, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.book.title


class BookComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    comment_text = models.TextField(max_length=10000)
    comment_date = models.DateField(auto_now=True)
    tweet_flag = models.BooleanField(default=False)
    delete_flag = models.BooleanField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '【' + self.user.user_name + '】', self.book.title


class CommentFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(BookComment, on_delete=models.CASCADE)
    favorite_date = models.DateField(auto_now=True)
    delete_flag = models.BooleanField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "comment")

    def __str__(self):
        return '【' + self.user.user_name + '】', self.comment.comment_text


class ReadBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    read_date = models.DateField(null=True)
    delete_flag = models.BooleanField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return '【' + self.user.user_name + '】', self.book.title


class InterestedBook(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    interested_date = models.DateField(auto_now=True)
    delete_flag = models.BooleanField(null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "book")

    def __str__(self):
        return '【' + self.user.user_name + '】', self.book.title
