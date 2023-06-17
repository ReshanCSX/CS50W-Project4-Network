from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Posts(models.Model):
    post = models.CharField(max_length=1000)
    timestamp = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")

    def serialize(self):
        return {
            'id': self.id,
            'post': self.post,
            'author' : self.author,
            'timestamp' : self.timestamp
        }