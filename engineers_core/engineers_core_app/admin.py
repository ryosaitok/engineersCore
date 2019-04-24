from django.contrib import admin
from .models import User, Author, Book, BookComment, BookAuthor, BookDetail, AmazonBook, ReadBook, InterestedBook

admin.site.register(User)
admin.site.register(Author)
admin.site.register(Book)
admin.site.register(BookComment)
admin.site.register(BookAuthor)
admin.site.register(BookDetail)
admin.site.register(AmazonBook)
admin.site.register(InterestedBook)
admin.site.register(ReadBook)
