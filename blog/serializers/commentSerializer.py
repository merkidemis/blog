from rest_framework import serializers
from blog.models import Comment

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'post', 'name', 'email', 'title', 'comment', 'date']
        
    def create(self, validated_data):
        post = validated_data.get('post', None)
        name = validated_data.get('name', None)
        email = validated_data.get('email', None)
        title = validated_data.get('title', None)
        comment = validated_data.get('comment', None)
        date = validated_data.get('date', None)
        
        return Comment.objects.create(post = post, name = name, email = email, title = title, comment = comment, date = date) 