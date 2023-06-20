from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator

from .models import User, Posts
from .forms import CreatePost

def index(request):

    posts = Posts.objects.all().order_by('-timestamp')

    paginator = Paginator(posts, 10)

    page_number = request.GET.get('page')
    page = paginator.get_page(page_number)


    return render(request, "network/index.html", {
        'page': page,
        "createpost" : CreatePost(),
    })

# def load(request, page):
#     if page == "home":
#         posts = Posts.objects.all().order_by("-timestamp")
#     else:
#         return JsonResponse({"error": "Invalid mailbox."}, status=400)

#     return JsonResponse([post.serialize() for post in posts], safe=False)


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
    

@login_required
def create(request):

    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)
    

    form = CreatePost(request.POST)

    if form.is_valid():
        form.instance.author = request.user
        form.save()
        return HttpResponseRedirect(reverse("index"))


def profile(request, username):

    try:
        user = User.objects.get(username=username)
    except:
        return JsonResponse({"error": "User not found."})


    return JsonResponse({"name": user.username})
