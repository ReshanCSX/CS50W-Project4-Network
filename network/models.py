from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Posts(models.Model):
    content = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")

    def __str__(self):
        return f"{self.content} by {self.author} at {self.timestamp.strftime('%b %d %Y, %I:%M %p')}"
    
    def serialize(self):
        return {
            "content" : self.content,
            "timestamp" : self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "author" : self.author.id
        }