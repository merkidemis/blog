var PostBox = React.createClass({
	getInitialState: function() {
    	return {data: []};
  	},
  	loadPostsFromServer: function() {
  		var blogURL = this.props.url + postID + '.json';
    	$.ajax({
      		url: blogURL,
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
 		if (!this.state.data) {
 		    return <div>Loading...</div>;
 		}
    	return (
      		<div className="postBox">
        		<Post data={this.state.data} author={authorName} />
        		<CommentList data={this.state.data} />
        	</div>
    	);
  	}
});

var Post = React.createClass({
 	render: function() {
 		var smallText = {fontSize: '0.7em'};
 		var date = new Date(this.props.data.date);
 		var formattedDate = moment(date).format('YYYY-MM-DD h:mm:ss a');
    	return (
      		<div className="post">
      		<h1>{this.props.data.title}</h1>
        	<p>{this.props.data.body}</p>
        	<p style={smallText} className="postAuthor"><b>{this.props.author}</b><br />
        	{formattedDate}</p>
      		</div>
    	);
  	}
});
   
var Comment = React.createClass({
 	render: function() {
 		var smallText = {fontSize: '0.7em'};
 		var date = new Date(this.props.date);
 		var formattedDate = moment(date).format('YYYY-MM-DD h:mm:ss a');
    	return (
      		<div className="comment">
      		<h4>{this.props.title}</h4>
      		<p>{this.props.comment}</p>
        	<p style={smallText}>
        	<b>{this.props.name}</b><br />
        	{this.props.email}<br />
        	{formattedDate}</p>
      		</div>
    	);
  	}
});

var CommentList = React.createClass({
	render: function() {
		if (!this.props.data) {
 		    return <div>Loading...</div>;
 		}
		var commentNodes = [];
		if (JSON.stringify(this.props.data) !== '[]' ) {
			var jsonString = JSON.stringify(this.props.data);
			var json = JSON.parse(jsonString);
			
			for (i=0; i < json.comments.length; i++) {
				var title = json.comments[i].title;
				var name = json.comments[i].name;
				var email = json.comments[i].email;
				var date = json.comments[i].date;
				var commentBody = json.comments[i].comment;
				commentNodes.push(<Comment title={title} comment={commentBody} name={name} email={email} date={date} key={json.comments[i].id}></Comment>);
			}
			return (
				<div className="commentList" style={{marginTop: '50px'}}>
				<h3>Comments</h3>
				{commentNodes}
				</div>
			);
		} else {
			return <div>Loading...</div>;
		}
	}
});

ReactDOM.render(
  <PostBox url="/blog/api/" pollInterval={60000} />,
  document.getElementById('content')
);