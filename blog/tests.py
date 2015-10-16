import warnings
warnings.filterwarnings("ignore", category = DeprecationWarning)

from django.test import Client, SimpleTestCase
from blog.models import Post, Comment
from django.contrib.auth.models import User

client = Client(enforce_csrf_checks = True)

class TestBlog(SimpleTestCase):
    "Blog tests"
    def setUp(self):
        self.user = User.objects.create_user(username = 'tester', email = 'itsdark@night.com', password = 'top_secret')
        
    def test_basic_urls(self):
        assert client.get('/').status_code == 200
        assert client.get('/blog/').status_code == 200
        assert client.get('/api/').status_code == 200
        assert client.get('/cpi/').status_code == 200
        assert client.get('/blog/login/').status_code == 200
        assert client.get('/logout/').status_code == 200
        
        post = Post(author = self.user, title = "Sample", body = "This is a test post")
        post.save()
        assert client.get('/api/1/').status_code == 200
        assert client.get('/blog/1/').status_code == 200
        
    def test_posts(self):
        post = Post(author = self.user, title = "Sample", body = "This is a test post")
        post.save()
        self.assertEqual(Post.objects.all().count(), 1)
        post = Post(author = self.user, title = "Sample2", body = "This is a another test post")
        post.save()
        self.assertEqual(Post.objects.all().count(), 2)
        
        response = client.get('/blog/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'postList.html')

    def test_comments(self):
        post = Post(author = self.user, title = "Sample", body = "This is a test post")
        post.save()
        
        comment = Comment(post = post, name = "Commenter", email = "e@mail.com", title = "Sample Comment", comment = "This is a sample comment")
        comment.save()
        
        self.assertEqual(Comment.objects.all().count(), 1)
        postId = str(post._get_pk_val())
        
        response = client.get('/blog/' + postId + '/')
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'post.html')
        
        self.assertEqual(client.get('/cpi/').status_code, 200)
        
    def tearDown(self):
        self.user.delete()
