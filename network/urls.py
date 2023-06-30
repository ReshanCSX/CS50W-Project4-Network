
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API paths
    path("posts", views.posts, name="posts"),
    path("<int:id>/posts", views.userposts, name="user_posts"),
    path("user/<int:id>", views.userinfo, name="user_info")
]
