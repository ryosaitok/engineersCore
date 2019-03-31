# coding=utf-8
from enum import Enum

from django.db import models
from django.contrib.auth.models import User


class Author(models.Model):
    author_name = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.author_name


class FontSizeEnum(Enum):
    LARGER = 'BIG'
    NORMAL = 'MID'
    SMALL = 'SMALL'


class Book(models.Model):
    title = models.CharField(max_length=1000)
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
    data_asin = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.book.title
