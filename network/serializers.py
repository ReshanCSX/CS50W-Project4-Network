from rest_framework import serializers
from .models import Posts, User
from django.contrib.humanize.templatetags.humanize import naturaltime

class PostSerializer(serializers.ModelSerializer):

    timestamp = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    
    class Meta:
        model = Posts
        fields = ['id', 'timestamp', 'author_name', 'like_count', 'is_liked', 'content', 'author']

    def get_author_name(self, object):
        return object.author.username
    
    def get_timestamp(self, object):
        return naturaltime(object.timestamp)
    
    def get_like_count(self, object):
        if object.liked_by.count() > 0:
            return object.liked_by.count()
        return False
    
    def get_is_liked(self, object):
        user = self.context['request'].user
        return object.liked_by.filter(id=user.id).exists()
    
class UserSerializer(serializers.ModelSerializer):

    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'id', 'followers', 'following']


    def get_followers(self, object):
        return object.following.count()
    
    def get_following(self, object):
        return object.follower.count()

        