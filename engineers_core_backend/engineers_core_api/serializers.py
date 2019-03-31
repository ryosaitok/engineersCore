from rest_framework import serializers
from .models import Book, BookDetail, AmazonBook, Author, User


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'user_name', 'account_name', 'description', 'profile_image_link')


class AuthorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Author
        fields = ('id', 'author_name',)


class AmazonBookSerializer(serializers.ModelSerializer):

    class Meta:
        model = AmazonBook
        fields = ('id', 'data_asin',)


class BookSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()
    amazon_book = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='data_asin'
    )

    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'book_status', 'sale_date', 'pages_count', 'amazon_book',)


class BookDetailSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = BookDetail
        fields = ('id', 'book', 'summary',)
