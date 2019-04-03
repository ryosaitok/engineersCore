from django.contrib import admin
from .models import User, Author, Book, BookReport, BookAuthor, BookDetail, AmazonBook

admin.site.register(User)
admin.site.register(Author)
admin.site.register(Book)
admin.site.register(BookReport)
admin.site.register(BookAuthor)
admin.site.register(BookDetail)
admin.site.register(AmazonBook)