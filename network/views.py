from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
import json

from .models import User, Posts

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import PostSerializer
from django.core.paginator import Paginator


def index(request):

    return render(request, "network/index.html")


@api_view(['GET', 'POST'])
def posts(request):

    if request.method == "POST":
    
        if request.user.is_authenticated:

            data = request.data.copy()
            data.update({'author': request.user.id})

            serializer = PostSerializer(data=data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        else:
            return Response({"error": "safsaf"}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method == "GET":
        
        posts = Posts.objects.all()

        # Paginator initialization
        paginator = Paginator(posts, 10)

        # Getting the requested page by the user
        page_number = request.GET.get('page')
        page_number = page_number if page_number else 1

        # Creating the paginator object
        page_obj = paginator.get_page(page_number)

        # Serializing the paginator object
        serializer = PostSerializer(page_obj, many=True)

        data = {
            "paginator": {
                "has_previous" : page_obj.has_previous(),
                "has_next" : page_obj.has_next(),
                "page_number" :page_number,
                "page_count" : paginator.num_pages
            },
            "serializer" : serializer.data
        }

        return Response(data, status=status.HTTP_200_OK)




def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
