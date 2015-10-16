var postId;

var PostBox = React.createClass({
	getInitialState: function() {
    	return {data: []};
  	},
  	loadPostsFromServer: function() {
    	$.ajax({
      		url: this.props.url,
      		dataType: 'json',
      		cache: false,
      		success: function(data) {
        		this.setState({data: data});
      		}.bind(this),
      		error: function(xhr, status, err) {
        		console.error(this.props.url, status, err.toString());
      		}.bind(this)
    	});
  	},
  	componentDidMount: function() {
    	this.loadPostsFromServer();
    	setInterval(this.loadPostsFromServer, this.props.pollInterval);
 	},
 	render: function() {
    	return (
      		<div className="postBox">
        		<PostList data={this.state.data}/>
        	</div>
    	);
  	}
});

var Post = React.createClass({
 	render: function() {
    	return (
      		<div className="post" style={{paddingBottom: '50px'}}>
      		<h1>{this.props.title}</h1>
        	<p>{this.props.body}</p>
        	<p><a href={this.props.link}>Read More</a></p> 
      		</div>
    	);
  	}
});

var PostList = React.createClass({
	render: function() {
    	var postNodes = this.props.data.map(function (post) {
    		var title = post.title;
    		var body = post.body;
    		if(body.length > 300) {
    			body = post.body.substring(0, post.body.indexOf(" ", 300))
    			if(body.length > 300) {
    				body = body + "...";
    			}
    		}
    		var link = '/blog/' + post.id + '/';
      		return (
      			<Post title={title} body={body} link={link} key={post.id}></Post>
      		);
    	});
    	return (
      		<div className="postList" >
        	{postNodes}
      		</div>
    	);
 	}
});
    
ReactDOM.render(
  <PostBox url="/blog/api.json" pollInterval={2000} />,
  document.getElementById('content')
);