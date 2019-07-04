from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token

from .views import *

urlpatterns = [
    path('profile/image/upload/', ProfileImageUploadView.as_view()),
    path('auth/', obtain_jwt_token),
    path('auth/me/', AuthInfoGetView.as_view()),
    path('email/verification/send/', EmailVerificationView.as_view()),
    path('verify/email/', EmailVerifyView.as_view()),
    path('password/reminder/send/', PasswordReminderView.as_view()),
    path('verify/password/reminder/', VerifyPasswordReminderView.as_view()),
    path('password/reset/', PasswordResetView.as_view()),
    path('books/', BookListView.as_view()),
    path('book/<int:pk>/', BookView.as_view()),
    path('authors/', AuthorListView.as_view()),
    path('author/<int:pk>/', AuthorView.as_view()),
    path('auth/users/', AuthUserListView.as_view()),
    path('auth/user/', AuthUserView.as_view()),
    path('users/', UserListView.as_view()),
    path('user/<str:account_name>/', UserView.as_view(), name='account_name'),
    path('book/comments/', BookCommentListView.as_view()),
    path('book/comment/<int:pk>/', BookCommentView.as_view()),
    path('book/comment/reports/', BookCommentReportListView.as_view()),
    path('comment/favorites/', CommentFavoriteListView.as_view()),
    path('comment/favorite/<int:pk>/', CommentFavoriteView.as_view()),
    path('book/comment/replies/', BookCommentReplyListView.as_view()),
    path('book/comment/reply/<int:pk>/', BookCommentReplyView.as_view()),
    path('book/comment/reply/favorites/', BookCommentReplyFavoriteListView.as_view()),
    path('book/comment/reply/favorite/<int:pk>/', BookCommentReplyFavoriteView.as_view()),
    path('book/comment/reply/reports/', BookCommentReplyReportListView.as_view()),
    path('book/details/', BookDetailListView.as_view()),
    path('book/detail/<int:pk>/', BookDetailView.as_view()),
    path('book/authors/', BookAuthorListView.as_view()),
    path('book/author/<int:pk>/', BookAuthorView.as_view()),
    path('interested/books/', InterestedBookListView.as_view()),
    path('interested/book/<int:pk>/', InterestedBookView.as_view()),
    path('shelves/', ShelfListView.as_view()),
    path('shelf/<int:pk>/', ShelfView.as_view()),
    path('shelf/reports/', ShelfReportListView.as_view()),
    path('shelf/books/', ShelfBookListView.as_view()),
    path('shelf/book/<int:pk>/', ShelfBookView.as_view()),
    path('shelf/favorites/', ShelfFavoriteListView.as_view()),
    path('shelf/favorite/<int:pk>/', ShelfFavoriteView.as_view()),
    path('shelf/comments/', ShelfCommentListView.as_view()),
    path('shelf/comment/<int:pk>/', ShelfCommentView.as_view()),
    path('shelf/comment/favorites/', ShelfCommentFavoriteListView.as_view()),
    path('shelf/comment/favorite/<int:pk>/', ShelfCommentFavoriteView.as_view()),
    path('shelf/comment/reports/', ShelfCommentReportListView.as_view()),
    path('shelf/comment/replies/', ShelfCommentReplyListView.as_view()),
    path('shelf/comment/reply/<int:pk>/', ShelfCommentReplyView.as_view()),
    path('shelf/comment/reply/favorites/', ShelfCommentReplyFavoriteListView.as_view()),
    path('shelf/comment/reply/favorite/<int:pk>/', ShelfCommentReplyFavoriteView.as_view()),
    path('shelf/comment/reply/reports/', ShelfCommentReplyReportListView.as_view()),
    path('bulk/book/', BookBulkListView.as_view()),
    path('bulk/amazon/book/', AmazonBookBulkListView.as_view()),
    path('bulk/author/', AuthorBulkListView.as_view()),
    path('bulk/book/author/', BookAuthorBulkListView.as_view()),
    path('bulk/book/detail/', BookDetailBulkListView.as_view()),
    path('shelf/books/bulk/', ShelfBookBulkView.as_view()),
]
