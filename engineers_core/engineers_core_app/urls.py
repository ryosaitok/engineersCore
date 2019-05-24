from django.urls import path
from rest_framework_jwt.views import obtain_jwt_token

from .views import *

urlpatterns = [
    path('auth/', obtain_jwt_token),
    path('auth/me/', AuthInfoGetView.as_view()),
    path('books/', BookListView.as_view()),
    path('book/<int:pk>/', BookView.as_view()),
    path('authors/', AuthorListView.as_view()),
    path('author/<int:pk>/', AuthorView.as_view()),
    path('authuser/register/', AuthUserRegisterView.as_view()),
    path('users/', UserListView.as_view()),
    path('user/<str:account_name>/', UserView.as_view(), name='account_name'),
    path('bookcomments/', BookCommentListView.as_view()),
    path('bookcomment/<int:pk>/', BookCommentView.as_view()),
    path('commentfavorites/', CommentFavoriteListView.as_view()),
    path('commentfavorite/<int:pk>/', CommentFavoriteView.as_view()),
    path('bookcommentreplies/', BookCommentReplyListView.as_view()),
    path('bookcommentreply/<int:pk>/', BookCommentReplyView.as_view()),
    path('bookcommentreplyfavorites/', BookCommentReplyFavoriteListView.as_view()),
    path('bookcommentreplyfavorite/<int:pk>/', BookCommentReplyFavoriteView.as_view()),
    path('bookdetails/', BookDetailListView.as_view()),
    path('bookdetail/<int:pk>/', BookDetailView.as_view()),
    path('bookauthors/', BookAuthorListView.as_view()),
    path('bookauthor/<int:pk>/', BookAuthorView.as_view()),
    path('interestedbooks/', InterestedBookListView.as_view()),
    path('interestedbook/<int:pk>/', InterestedBookView.as_view()),
    path('bookfeaturecategories/', BookFeatureCategoryListView.as_view()),
    path('bookfeaturecategory/<int:pk>/', BookFeatureCategoryView.as_view()),
    path('bookfeatures/', BookFeatureListView.as_view()),
    path('bookfeature/<int:pk>/', BookFeatureView.as_view()),
]
