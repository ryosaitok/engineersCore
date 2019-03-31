from django.contrib import admin
from .models import Author, Book, BookDetail, AmazonBook

admin.site.register(Author)
admin.site.register(Book)
admin.site.register(BookDetail)
admin.site.register(AmazonBook)