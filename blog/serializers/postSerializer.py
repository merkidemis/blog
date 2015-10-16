from rest_framework import serializers
from blog.models import Post
from blog.serializers.commentSerializer import CommentSerializer

class PostSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True)
    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'date', 'body', 'comments']
        
    def create(self, validated_data):
        user = self.context.get("user")
        date = validated_data.get('date', None)
        title = validated_data.get('title', None)
        body = validated_data.get('body', None)
        
        return Post.objects.create(title = title, author = user, body = body, date = date)