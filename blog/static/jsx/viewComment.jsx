var postId;

var CommentBox = React.createClass({
	getInitialState: function() {
    	return {data: []};
  	},
  	handleCommentSubmit: function(comment) {
  	var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});
    	$.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  	},
  	loadCommentsFromServer: function() {
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
    	this.loadCommentsFromServer();
    	setInterval(this.loadCommentsFromServer, this.props.pollInterval);
 	},
 	render: function() {
    	return (
      		<div className="commentBox">
        		<h1>Comments</h1>
        		<CommentList data=data={this.state.data} />
        		<CommentForm onCommentSubmit={this.handleCommentSubmit} />
      		</div>
    	);
  	}
});

var Comment = React.createClass({
 	render: function() {
    	return (
      		<div className="comment">
        		<h2 className="commentAuthor">
          		{this.props.author}
        		</h2>
        		{this.props.children}
      		</div>
    	);
  	}
});

var CommentList = React.createClass({
	render: function() {
    	var commentNodes = this.props.data.map(function (comment) {
      		return (
      			//post, name, email, title, comment, date
        		<Comment author={comment.name}>
          		{comment.comment}
        		</Comment>
      		);
    	});
    	return (
      		<div className="commentList">
        	{commentNodes}
      		</div>
    	);
 	}
});
    
var CommentForm = React.createClass({
 	handleSubmit: function(e) {
    	e.preventDefault();
    	var author = this.refs.author.value.trim();
    	var text = this.refs.text.value.trim();
    	if (!text || !author) {
      		return;
    	}
    	this.props.onCommentSubmit({author: author, text: text});
    	this.refs.author.value = '';
    	this.refs.text.value = '';
    	return;
  	},
  	render: function() {
   		return (
      	<form className="commentForm" onSubmit={this.handleSubmit}>
        	<input type="text" placeholder="Your name" ref="author" />
        	<input type="text" placeholder="Say something..." ref="text" />
        	<input type="submit" value="Post" />
      	</form>
    	);
	}
});
ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
);