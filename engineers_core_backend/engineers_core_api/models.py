# coding=utf-8
from enum import Enum

from django.db import models
from django.contrib.auth.models import User


class User(models.Model):
    user_name = models.CharField(max_length=128)
    account_name = models.CharField(max_length=128, unique=True, db_index=True)
    description = models.TextField(max_length=512, null=True)
    profile_image_link = models.ImageField(unique=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user_name


class Author(models.Model):
    author_name = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.author_name


class Book(models.Model):
    title = models.CharField(max_length=1024)
    author = models.ForeignKey(Author, on_delete=models.CASCADE)
    book_status_choices = [
        ['PRE', 'Pre-Sales'],
        ['PUB', 'Published'],
        ['OOP', 'Out Of Print'],
    ]
    book_status = models.CharField(choices=book_status_choices,
                   default='PUB',
                   max_length=10)
    sale_date = models.DateField()
    pages_count = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class BookDetail(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    summary = models.TextField(max_length=10000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.book.title


class AmazonBook(models.Model):
    book = models.ForeignKey(Book, related_name='amazon_book', on_delete=models.CASCADE)
    data_asin = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.book.title
