$('#addCommentButton').click(function() {
	AddCommentEvent(postID);
});

function AddCommentEvent(post_id) {
	postId = post_id;
	var event = document.createEvent('Event');
	event.initEvent('addCommentNav', true, true);
	document.dispatchEvent(event);
}

var CommentBox = React.createClass({
	getInitialState: function() {
		return {showModal: 'none'}
	},
	componentDidMount: function() {
		var self = this;
		document.addEventListener('addCommentNav', function(e) {
			self.showModal();
		}, false);
	},
	showModal: function() {
		this.setState({showModal: 'inherit'});
	},
	closeModal: function() {
		this.setState({showModal: 'none'});
	},
	addComment: function() {
		var self = this;
		var date = new Date();
		date = date.toISOString();
	    
		var sendData = { 
				title: $('#addCommentModalTitle').val(), 
				comment: $('#addCommentModalBody').val(),
				email: $('#addCommentModalEmail').val(),
				name: $('#addCommentModalName').val(),
				post: postId,
				date: date};
		$.ajax({
			url: 'http://127.0.0.1:8000/blog/cpi/',
			dataType: 'json',
			method: 'POST',
			data: sendData,
			success: function (data) {
				window.location.href = "http://127.0.0.1:8000/blog/" + postId + "/";
				if (!("Notification" in window)) {
					alert("This browser does not support desktop notification");
				} else if (Notification.permission === "granted") {
					var notification = new Notification("New comment");
					setTimeout(notification.close.bind(notification), 4000);
				}
 			}.bind(this),
			error: function(xhr, status, err) {
				console.log(xhr.responseText);
				console.error(status, err.toString());
			}.bind(this)
		});
	},
	render: function() {
		var style = {display: this.state.showModal, top: '10px' };
		var close = <button className="btn btn-default" onClick={this.closeModal}>Close</button>;
		var addPostBody = <div>
			<label>Name:</label>
			<input type="text" className="form-control" id="addCommentModalName"/>
			<label>Email Addres:</label>
			<input type="text" className="form-control" id="addCommentModalEmail"/>
			<label>Title:</label>
			<input type="text" className="form-control" id="addCommentModalTitle"/>
			<label>Comment:</label>
			<textarea type="text" className="form-control" id="addCommentModalBody" style={{height: '100px'}}></textarea>
			<button style={{marginTop: '20px'}} className="btn btn-primary" onClick={this.addComment}>Add Comment</button>
			</div>;
		return (
			<div>
				<AddCommentModal title="Add a New Comment" style={style} close={close} body={addPostBody} />
			</div>
		);
	}
});

var AddCommentModal = React.createClass({
	render: function() {
		return (
			<div id="addCommentModal" className="modal" style={this.props.style}>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close"></button>
							<h4 className="modal-title">{this.props.title}</h4>
						</div>
						<div className="modal-body">
							{this.props.body}
						</div>
						<div className="modal-footer" style={{clear: 'both'}}>
							{this.props.close}
						</div>
					</div>
				</div>
			</div>
		)
	}
});

React.render(
  <CommentBox />,
  document.getElementById('addComment')
);