from django.conf.urls import url
from rest_framework.urlpatterns import format_suffix_patterns
from . import views

urlpatterns = [
    url(r'^(?P<post_id>\d+)/$', 'blog.views.post'),
    url(r'^api/$', views.PostList.as_view()),
    url(r'^api/(?P<pk>[0-9]+)/$', views.PostDetail.as_view()),
    url(r'^cpi/$', views.CommentList.as_view()),
    url(r'^login/$', 'django.contrib.auth.views.login'),
    url(r'^logout/$', 'django.contrib.auth.views.logout'),
    url(r'^', 'blog.views.post_index'),
    
]

urlpatterns = format_suffix_patterns(urlpatterns)
