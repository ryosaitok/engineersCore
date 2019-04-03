from rest_framework import serializers
from .models import Book, BookAuthor, BookComment, BookDetail, AmazonBook, Author, User, CommentFavorite, ReadBook, InterestedBook


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
    amazon_book = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='data_asin'
    )

    class Meta:
        model = Book
        fields = ('id', 'title', 'book_status', 'sale_date', 'pages_count', 'offer_price', 'amazon_book',)


class BookDetailSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = BookDetail
        fields = ('id', 'book', 'summary',)


class BookCommentSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    user = UserSerializer()

    class Meta:
        model = BookComment
        fields = ('id', 'user', 'book', 'comment_text', 'comment_date', 'tweet_flag', 'delete_flag',)


class BookAuthorSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    author = AuthorSerializer()

    class Meta:
        model = BookAuthor
        fields = ('id', 'book', 'author',)


class CommentFavoriteSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    comment = BookCommentSerializer()

    class Meta:
        model = CommentFavorite
        fields = ('id', 'user', 'comment', 'favorite_date', 'delete_flag')


class ReadBookSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    book = BookSerializer()

    class Meta:
        model = ReadBook
        fields = ('id', 'user', 'book', 'read_date', 'delete_flag')


class InterestedBookSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    book = BookSerializer()

    class Meta:
        model = InterestedBook
        fields = ('id', 'user', 'book', 'interested_date', 'delete_flag')