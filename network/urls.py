
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API routes

    path("newpost", views.create, name="createpost"),
    # path("posts/<str:page>", views.load, name="posts"),
    path("user/<str:username>", views.profile, name="user")
]
