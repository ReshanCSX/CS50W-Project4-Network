from rest_framework import serializers
from .models import Posts, User
from django.contrib.humanize.templatetags.humanize import naturaltime

class PostSerializer(serializers.ModelSerializer):

    timestamp = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Posts
        fields = '__all__'

    def get_author_name(self, object):
        return object.author.username
    
    def get_timestamp(self, object):
        return naturaltime(object.timestamp)
    
class UserSerializer(serializers.ModelSerializer):

    followers = serializers.SerializerMethodField()
    following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['username', 'followers', 'following']

    def get_followers(self, object):
        return object.follower.count()
    
    def get_following(self, object):
        return object.following.count()

        