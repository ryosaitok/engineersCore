from rest_framework import serializers
from rest_framework_bulk import BulkListSerializer, BulkSerializerMixin
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


class AuthorBulkSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Author
        list_serializer_class = BulkListSerializer
        fields = ('id', 'author_name',)


class AmazonBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = AmazonBook
        fields = ('id', 'book', 'data_asin', 'sales_rank')


class AmazonBookBulkSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = AmazonBook
        list_serializer_class = BulkListSerializer
        fields = ('id', 'book', 'data_asin', 'sales_rank')


class BookSerializer(serializers.ModelSerializer):
    amazon_book = AmazonBookSerializer(many=True, read_only=True)
    authors = AuthorSerializer(many=True)

    class Meta:
        model = Book
        fields = ('id', 'title', 'book_status', 'sale_date', 'pages_count', 'offer_price', 'amazon_book', 'authors')


class BookBulkSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = Book
        list_serializer_class = BulkListSerializer
        fields = ('id', 'title', 'book_status', 'sale_date', 'pages_count', 'offer_price',)


class BookDetailSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = BookDetail
        fields = ('id', 'book', 'summary',)


class BookDetailBulkSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = BookDetail
        list_serializer_class = BulkListSerializer
        fields = ('id', 'book', 'summary',)


class BookAuthorSerializer(serializers.ModelSerializer):
    book = BookSerializer()
    author = AuthorSerializer()

    class Meta:
        model = BookAuthor
        fields = ('id', 'book', 'author',)


class BookAuthorBulkSerializer(BulkSerializerMixin, serializers.ModelSerializer):
    class Meta:
        model = BookAuthor
        list_serializer_class = BulkListSerializer
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


class ShelfSerializer(serializers.ModelSerializer):
    books = BookSerializer(many=True)
    user = UserSerializer()
    favorite_users = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='user_id'
    )
    comment_users = serializers.SlugRelatedField(
        many=True,
        read_only=True,
        slug_field='user_id'
    )

    class Meta:
        model = Shelf
        fields = ('id', 'user', 'books', 'shelf_cd', 'shelf_name', 'display_order', 'shelf_status', 'description',
                  'favorite_users', 'comment_users',)


class ShelfBookSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelfBook
        fields = ('id', 'shelf', 'book', 'display_order',)


class ShelfBookWithForeignSerializer(serializers.ModelSerializer):
    shelf = ShelfSerializer()
    book = BookSerializer()

    class Meta:
        model = ShelfBook
        fields = ('id', 'shelf', 'book', 'display_order',)


class ShelfFavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelfFavorite
        fields = ('id', 'shelf', 'user', 'favorite_date',)


class ShelfFavoriteWithForeignSerializer(serializers.ModelSerializer):
    shelf = ShelfSerializer()
    user = UserSerializer()

    class Meta:
        model = ShelfFavorite
        fields = ('id', 'shelf', 'user', 'favorite_date',)


class ShelfCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShelfComment
        fields = ('id', 'user', 'shelf', 'favorite_date',)


class ShelfCommentWithForeignSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    shelf = ShelfSerializer()

    class Meta:
        model = ShelfComment
        fields = ('id', 'user', 'shelf', 'favorite_date',)
