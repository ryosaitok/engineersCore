from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import *


class AuthUserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AuthUser
        fields = ('id', 'username', 'email', 'password')

    write_only_fields = (['password'])
    read_only_fields = (['id'])

    def create(self, validated_data):
        password = validated_data.get('password')
        validated_data['password'] = make_password(password)
        return AuthUser.objects.create(**validated_data)


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


class BookAuthorSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    author = AuthorSerializer()

    class Meta:
        model = BookAuthor
        fields = ('id', 'book', 'author',)


class BookCommentSerializer(serializers.ModelSerializer):
    favorite_ids = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )
    reply_ids = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )

    class Meta:
        model = BookComment
        fields = ('id', 'user', 'book', 'comment_text', 'comment_date', 'tweet_flag', 'delete_flag', 'favorite_ids', 'reply_ids')


class BookCommentWithForeignSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    user = UserSerializer()
    favorite_ids = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )
    reply_ids = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )

    class Meta:
        model = BookComment
        fields = ('id', 'user', 'book', 'comment_text', 'comment_date', 'tweet_flag', 'delete_flag', 'favorite_ids', 'reply_ids')


class CommentFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentFavorite
        fields = ('id', 'user', 'comment', 'favorite_date', 'delete_flag')


class CommentFavoriteWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    comment = BookCommentWithForeignSerializer()

    class Meta:
        model = CommentFavorite
        fields = ('id', 'user', 'comment', 'favorite_date', 'delete_flag')


class BookCommentReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCommentReply
        fields = ('id', 'user', 'comment', 'comment_text', 'comment_date', 'tweet_flag', 'delete_flag',)


class BookCommentReplyWithForeignSerializer(serializers.ModelSerializer):
    comment = BookCommentSerializer()
    user = UserSerializer()

    class Meta:
        model = BookCommentReply
        fields = ('id', 'user', 'comment', 'comment_text', 'comment_date', 'tweet_flag', 'delete_flag',)


class BookCommentReplyFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCommentReplyFavorite
        fields = ('id', 'user', 'reply', 'favorite_date', 'delete_flag')


class BookCommentReplyFavoriteWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    reply = BookCommentReplySerializer()

    class Meta:
        model = BookCommentReplyFavorite
        fields = ('id', 'user', 'reply', 'favorite_date', 'delete_flag')


class ReadBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadBook
        fields = ('id', 'user', 'book', 'read_date', 'delete_flag')


class ReadBookWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    book = BookSerializer()

    class Meta:
        model = ReadBook
        fields = ('id', 'user', 'book', 'read_date', 'delete_flag')


class InterestedBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestedBook
        fields = ('id', 'user', 'book', 'interested_date', 'delete_flag')


class InterestedBookWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    book = BookSerializer()

    class Meta:
        model = InterestedBook
        fields = ('id', 'user', 'book', 'interested_date', 'delete_flag')
