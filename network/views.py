from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.http import JsonResponse
import json

from .models import User, Posts, Followers

from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from .serializers import PostSerializer, UserSerializer
from django.core.paginator import Paginator
from django.contrib.auth.decorators import login_required


def index(request):

    return render(request, "network/index.html")


@api_view(['PUT'])
@login_required
def editpost(request, id):
    
    try:
        post = Posts.objects.get(pk=id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if post.author != request.user:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    data = json.loads(request.body)

    content = data.get('content', '')

    if not content or len(content) > 1000:
        return Response(status=status.HTTP_400_BAD_REQUEST)

    try:
        post.content = content
        post.save()

        serialize = PostSerializer(post)

        return Response(serialize.data, status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    


@api_view(['GET'])
def userinfo(request, id):

    try:
        user = User.objects.get(pk=id)
    except:
        return Response(status=status.HTTP_404_NOT_FOUND)
    

    is_follower = user.following.filter(follower=request.user).exists() if request.user.is_authenticated else None

    serializer = UserSerializer(user)

    data = {
        "username": serializer.data["username"],
        "id": serializer.data["id"],
        "followers": serializer.data["followers"],
        "following": serializer.data["following"],
        "is_follower" : is_follower,
        "requested_by" : request.user.id if request.user.is_authenticated else None
    }
    

    return Response(data, status=status.HTTP_200_OK)


def serializedata(request, posts):

    # creating paginator
    paginator = Paginator(posts, 10)

    # getting requested page
    page_number = request.GET.get('page') or 1

    # creating page object
    page_obj = paginator.get_page(page_number)

    # serializing the page object
    serializer = PostSerializer(page_obj, many=True)

    # Adding other information
    data = {
        "requested_by" : request.user.id if request.user.is_authenticated else None,
        "paginator": {
            "has_previous" : page_obj.has_previous(),
            "has_next" : page_obj.has_next(),
            "page_number" : page_number,
            "page_count" : paginator.num_pages
        },
        "serializer" : serializer.data
    }

    return data


@api_view(['GET'])
@login_required
def followingsposts(request):

    user_following = User.objects.get(pk=request.user.id).follower.all().values("following")
    posts = Posts.objects.filter(author__in=user_following)

    data = serializedata(request, posts)

    return Response(data, status=status.HTTP_200_OK)


@api_view(['POST'])
@login_required
def follow(request, id):

    user = request.user
    follow_user = User.objects.get(pk=id)

    # Check if the user is trying to follow themselves.
    if user == follow_user:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    # Load data
    data = request.data
    action = data.get('action')

    # Check if the valid action.
    if action not in ['follow', 'unfollow']:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
 
    if action == "follow":

        # Check if the user is already following other user.
        if Followers.objects.filter(follower=user, following=follow_user).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # Create a new followers object
        Followers.objects.create(follower=user, following=follow_user)


    elif action == "unfollow":

        # Check if the user is not following other user.
        if not Followers.objects.filter(follower=user, following=follow_user).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # Deleting the followers object
        Followers.objects.filter(follower=user, following=follow_user).delete()

    
    return Response({'id' : follow_user.id}, status=status.HTTP_200_OK)


@api_view(['GET'])
def userposts(request, id):

    posts = Posts.objects.filter(author=id)

    data = serializedata(request, posts)

    return Response(data, status=status.HTTP_200_OK)


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
            return Response({"error": "You have to be logged in"}, status=status.HTTP_403_FORBIDDEN)
        
    if request.method == "GET":
        
        posts = Posts.objects.all()

        data = serializedata(request, posts)

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
