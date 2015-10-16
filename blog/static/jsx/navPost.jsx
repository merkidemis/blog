function AddPostEvent() {
	var event = document.createEvent('Event');
	event.initEvent('addPostNav', true, true);
	document.dispatchEvent(event);
}

var AddPost = React.createClass({
	getInitialState: function() {
		return {showModal: 'none'}
	},
	componentDidMount: function() {
		var self = this;
		document.addEventListener('addPostNav', function(e) {
			self.showModal();
		}, false);
	},
	showModal: function() {
		this.setState({showModal: 'inherit'});
	},
	closeModal: function() {
		this.setState({showModal: 'none'});
	},
	addPost: function() {
		var self = this;
		var date = new Date();
		date = date.toISOString();
		var sendData = {author: "", title: $('#addPostModalTitle').val(), body: $('#addPostModalBody').val(), date: date};
		$.ajax({
			url: 'http://127.0.0.1:8000/blog/api/',
			dataType: 'json',
			method: 'POST',
			data: sendData,
			success: function (data) {
				var id = data.id;
				window.location.href = "http://127.0.0.1:8000/blog/" + id + "/";
				if (!("Notification" in window)) {
					alert("This browser does not support desktop notification");
				} else if (Notification.permission === "granted") {
					var notification = new Notification("New blog post!");
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
		var style = {display: this.state.showModal, top: '50px' };
		var close = <button className="btn btn-default" onClick={this.closeModal}>Close</button>;
		var addPostBody = <div>
			<label>Title:</label>
			<input type="text" className="form-control" id="addPostModalTitle"/>
			<label>Content:</label>
			<textarea type="text" className="form-control" id="addPostModalBody" style={{height: '350px', wordBreak: 'break-word', verticalAlign: 'text-top'}}></textarea>
			<button style={{marginTop: '20px'}} className="btn btn-primary" onClick={this.addPost}>Add Post</button>
			</div>;
		return (
			<div>
				<AddPostModal title="Add a new post" style={style} close={close} body={addPostBody} />
			</div>
		);
	}
});

var AddPostModal = React.createClass({
	render: function() {
		return (
			<div id="addPostModal" className="modal" style={this.props.style}>
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

ReactDOM.render(
		<AddPost />,
		document.getElementById('addPost')
		)