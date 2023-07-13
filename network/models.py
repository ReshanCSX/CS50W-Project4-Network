from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Posts(models.Model):
    content = models.CharField(max_length=1000, blank=False)
    timestamp = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    liked_by = models.ManyToManyField("User", blank=True, related_name="likes")

    def __str__(self):
        return f"{self.content} by {self.author} at {self.timestamp.strftime('%b %d %Y, %I:%M %p')}"
    
    class Meta:
        ordering = ['-timestamp']

class Followers(models.Model):
    follower = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
    following = models.ForeignKey("User", on_delete=models.CASCADE, related_name="following")

    def __str__(self):
        return f"{self.follower} follows {self.following}"