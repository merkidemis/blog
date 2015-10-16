from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    author = models.ForeignKey(User, null = True, blank = True)
    title = models.CharField(max_length = 256)
    body = models.TextField()
    date = models.DateTimeField(auto_now_add = True)  
  
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name = 'comments')
    name = models.CharField(max_length = 256)
    email = models.CharField(max_length = 256)
    title = models.CharField(max_length = 256)
    comment = models.TextField()
    date = models.DateTimeField(auto_now_add = True)
