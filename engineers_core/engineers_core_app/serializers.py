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
    favorite_users = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='user_id'
    )
    reply_ids = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )

    class Meta:
        model = BookComment
        fields = ('id', 'user', 'book', 'comment_text', 'comment_date', 'tweet_flag', 'favorite_users', 'reply_ids')


class BookCommentWithForeignSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    user = UserSerializer()
    favorite_users = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='user_id'
    )
    reply_ids = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='id'
    )

    class Meta:
        model = BookComment
        fields = ('id', 'user', 'book', 'comment_text', 'comment_date', 'tweet_flag', 'favorite_users', 'reply_ids')


class CommentFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommentFavorite
        fields = ('id', 'user', 'comment', 'favorite_date')


class CommentFavoriteWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    comment = BookCommentWithForeignSerializer()

    class Meta:
        model = CommentFavorite
        fields = ('id', 'user', 'comment', 'favorite_date')


class BookCommentReplySerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCommentReply
        fields = ('id', 'user', 'comment', 'comment_text', 'comment_date', 'tweet_flag',)


class BookCommentReplyWithForeignSerializer(serializers.ModelSerializer):
    comment = BookCommentSerializer()
    user = UserSerializer()

    class Meta:
        model = BookCommentReply
        fields = ('id', 'user', 'comment', 'comment_text', 'comment_date', 'tweet_flag',)


class BookCommentReplyFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookCommentReplyFavorite
        fields = ('id', 'user', 'reply', 'favorite_date')


class BookCommentReplyFavoriteWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    reply = BookCommentReplySerializer()

    class Meta:
        model = BookCommentReplyFavorite
        fields = ('id', 'user', 'reply', 'favorite_date',)


class InterestedBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterestedBook
        fields = ('id', 'user', 'book', 'interested_date',)


class InterestedBookWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    book = BookSerializer()

    class Meta:
        model = InterestedBook
        fields = ('id', 'user', 'book', 'interested_date',)
