# coding=utf-8

from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.contrib.auth.models import User as AuthUser


class EmailVerification(models.Model):
    email = models.CharField(max_length=128, db_index=True)
    token = models.CharField(max_length=128, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'email_verification'

    def __str__(self):
        return self.email


class PasswordReminder(models.Model):
    email = models.CharField(max_length=128, db_index=True)
    token = models.CharField(max_length=128, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'password_reminder'

    def __str__(self):
        return self.email


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


class File(models.Model):
    user = models.BigIntegerField()
    file = models.FileField(blank=False, null=False)

    def __str__(self):
        return self.file.name


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
    pages_count = models.IntegerField(null=True)
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
    sales_rank = models.IntegerField(null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'amazon_book'

    def __str__(self):
        return self.book.title


class BookComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, related_name='book_comments', on_delete=models.CASCADE)
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


class BookCommentReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book_comment = models.ForeignKey(BookComment, related_name='report_users', on_delete=models.CASCADE)
    report_date = models.DateField(auto_now=True)
    report_reasons = [
        ['VLT', 'Violent'],
        ['SPM', 'Spam'],
        ['POM', 'Violate Public Order And Morals'],
        ['SVL', 'Service Violation'],
    ]
    reason_code = models.CharField(choices=report_reasons, default='SVL', max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "book_comment")
        db_table = 'book_comment_report'


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
    comment = models.ForeignKey(BookComment, related_name='reply_users', on_delete=models.CASCADE)
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
    book_comment_reply = models.ForeignKey(BookCommentReply, related_name='favorite_users', on_delete=models.CASCADE)
    favorite_date = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "book_comment_reply")
        db_table = 'book_comment_reply_favorite'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.book_comment_reply.comment_text


class BookCommentReplyReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    book_comment_reply = models.ForeignKey(BookCommentReply, related_name='report_users', on_delete=models.CASCADE)
    report_date = models.DateField(auto_now=True)
    report_reasons = [
        ['VLT', 'Violent'],
        ['SPM', 'Spam'],
        ['POM', 'Violate Public Order And Morals'],
        ['SVL', 'Service Violation'],
    ]
    reason_code = models.CharField(choices=report_reasons, default='SVL', max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "book_comment_reply")
        db_table = 'book_comment_reply_report'


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


class Shelf(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    books = models.ManyToManyField(Book, through='ShelfBook')
    shelf_name = models.TextField(max_length=1000)
    shelf_cd = models.CharField(max_length=128, unique=True, null=True)
    display_order = models.IntegerField(null=True)
    shelf_status_choices = [
        ['OPN', 'Open'],
        ['DFT', 'Draft'],
        ['NOT', 'Not Open'],
    ]
    shelf_status = models.CharField(choices=shelf_status_choices, default='DFT', max_length=8)
    description = models.TextField(max_length=1000, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shelf'

    def __str__(self):
        return self.shelf_name


class ShelfReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shelf = models.ForeignKey(Shelf, related_name='report_users', on_delete=models.CASCADE)
    report_date = models.DateField(auto_now=True)
    report_reasons = [
        ['VLT', 'Violent'],
        ['SPM', 'Spam'],
        ['POM', 'Violate Public Order And Morals'],
        ['SVL', 'Service Violation'],
    ]
    reason_code = models.CharField(choices=report_reasons, default='SVL', max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "shelf")
        db_table = 'shelf_report'


class ShelfBook(models.Model):
    shelf = models.ForeignKey(Shelf, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    display_order = models.IntegerField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shelf_book'
        unique_together = ("shelf", "book")

    def __str__(self):
        return str(self.display_order)


class ShelfFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shelf = models.ForeignKey(Shelf, related_name='favorite_users', on_delete=models.CASCADE)
    favorite_date = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "shelf")
        db_table = 'shelf_favorite'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.shelf.shelf_name


class ShelfComment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shelf = models.ForeignKey(Shelf, related_name='comment_users', on_delete=models.CASCADE)
    comment_text = models.TextField(max_length=10000)
    comment_date = models.DateField(auto_now=True)
    tweet_flag = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shelf_comment'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.shelf.shelf_name, self.comment_text


class ShelfCommentFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shelf_comment = models.ForeignKey(ShelfComment, related_name='favorite_users', on_delete=models.CASCADE)
    favorite_date = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "shelf_comment")
        db_table = 'shelf_comment_favorite'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.shelf_comment.comment_text


class ShelfCommentReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shelf_comment = models.ForeignKey(ShelfComment, related_name='report_users', on_delete=models.CASCADE)
    report_date = models.DateField(auto_now=True)
    report_reasons = [
        ['VLT', 'Violent'],
        ['SPM', 'Spam'],
        ['POM', 'Violate Public Order And Morals'],
        ['SVL', 'Service Violation'],
    ]
    reason_code = models.CharField(choices=report_reasons, default='SVL', max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "shelf_comment")
        db_table = 'shelf_comment_report'


class ShelfCommentReply(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(ShelfComment, related_name='reply_users', on_delete=models.CASCADE)
    comment_text = models.TextField(max_length=10000)
    comment_date = models.DateField(auto_now=True)
    tweet_flag = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shelf_comment_reply'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.comment.comment_text


class ShelfCommentReplyFavorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shelf_comment_reply = models.ForeignKey(ShelfCommentReply, related_name='favorite_users', on_delete=models.CASCADE)
    favorite_date = models.DateField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "shelf_comment_reply")
        db_table = 'shelf_comment_reply_favorite'

    def __str__(self):
        return '【' + self.user.user_name + '】', self.shelf_comment_reply.comment_text


class ShelfCommentReplyReport(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shelf_comment_reply = models.ForeignKey(ShelfCommentReply, related_name='report_users', on_delete=models.CASCADE)
    report_date = models.DateField(auto_now=True)
    report_reasons = [
        ['VLT', 'Violent'],
        ['SPM', 'Spam'],
        ['POM', 'Violate Public Order And Morals'],
        ['SVL', 'Service Violation'],
    ]
    reason_code = models.CharField(choices=report_reasons, default='SVL', max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "shelf_comment_reply")
        db_table = 'shelf_comment_reply_report'
