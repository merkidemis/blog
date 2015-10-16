from blog.models import Post, Comment
from blog.serializers.commentSerializer import CommentSerializer
from blog.serializers.postSerializer import PostSerializer
from django.shortcuts import render, render_to_response
from rest_framework import generics, status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from django.template import RequestContext
from endless_pagination.decorators import page_template
 
def post(request, post_id):
    currentPost = Post.objects.get(id = post_id)
    return render(request, 'post.html', {'id': post_id, 'authorName': currentPost.author.username})

class PostList(generics.ListCreateAPIView):
    serializer_class = PostSerializer
    def get(self, request, format = None):
        postSet = Post.objects.all().order_by('-date')
        serializer = PostSerializer(postSet, many = True)
        return Response(serializer.data)

    @permission_classes((IsAdminUser,))
    def post(self, request, format = None):
        serializer = PostSerializer(data = request.data, context = {'user': request.user})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return  Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)

class PostDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    

class CommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    def get(self, request, format = None):
        commentSet = Comment.objects.all().order_by('-date')
        serializer = CommentSerializer(commentSet, many = True)
        return Response(serializer.data)

    def post(self, request, format = None):
        serializer = CommentSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return  Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    
    
@page_template('postList_page.html')
def post_index (
    request,
    template = 'postList.html',
    extra_context = None):
    context = {
               'entries': Post.objects.all().order_by('-date'),
    }
    if extra_context is not None:
        context.update(extra_context)
    return render_to_response(
        template, context, context_instance = RequestContext(request))    
