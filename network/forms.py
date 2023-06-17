from django.forms import ModelForm, Textarea
from .models import Posts



class CreatePost(ModelForm):
    
    class Meta:
        model = Posts
        fields = ['post']

        widgets = {
            'post' : Textarea(attrs={"class" : "form-control", "rows" : 3, "placeholder": "Share your thoughts with friends."})
        }