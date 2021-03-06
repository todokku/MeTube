import React from 'react';

export default class Comment extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            numLikes: 0,
            numDislikes: 0,
            liked: false,
            disliked: false
        };
        this.createLike = this.createLike.bind(this);
        this.createDislike = this.createDislike.bind(this);
        this.likeButton = this.likeButton.bind(this);
        this.dislikeButton = this.dislikeButton.bind(this);
    };

    componentDidMount(){
        this.props.fetchCommentLikes(this.props.comment._id)
            .then(() => this.setState(
                {
                    numLikes: this.props.likes.length,
                    numDislikes: this.props.dislikes.length,
                    liked: this.props.likes.filter(like => like.userId === this.props.user.id).length > 0,
                    disliked: this.props.dislikes.filter(dislike => dislike.userId === this.props.user.id).length > 0
                })
            )
    };

    createLike(){
        if (!this.state.liked){
            this.props.createLike({
                dislike: false,
                likeable_type: 'comment',
                likeable_id: this.props.comment._id,
                user_id: this.props.user.id
            })
                .then(() => this.setState(
                    {
                        numLikes: this.state.numLikes + 1,
                        liked: true
                    })
                );
        } else {
            const like = this.props.likes.filter(like => like.userId === this.props.user.id);
            if (like.length > 0){
                this.props.deleteLike(like[0]._id)
                    .then(() => this.setState(
                        {
                            numLikes: this.state.numLikes - 1,
                            liked: false
                        })
                    )
                }
        }
    }

    createDislike(){
        if (!this.state.disliked){
            this.props.createLike({
                dislike: true,
                likeable_type: 'comment',
                likeable_id: this.props.comment._id,
                user_id: this.props.user.id
            }).then(() => {
                this.setState({
                    numDislikes: this.state.numDislikes + 1,
                    disliked: true
                })
            });
        } else {
            const dislike = this.props.dislikes.filter(dislike => dislike.userId === this.props.user.id);
            if (dislike.length > 0){
                this.props.deleteLike(dislike[0]._id)
                    .then(() => this.setState(
                        {
                            numDislikes: this.state.numDislikes - 1,
                            disliked: false
                        }
                    ))
            }
        }
    }

    likeButton(){
        let button;
        if (this.state.liked){
            button = <i class="fas fa-thumbs-up liked" onClick={this.createLike}></i>
        } else {
            button = <i class="fas fa-thumbs-up" onClick={this.createLike}></i>
        }
        return button;
    }

    dislikeButton(){
        let button;
        if (this.state.disliked){
            button = <i class="fas fa-thumbs-down disliked" onClick={this.createDislike}></i>
        } else {
            button = <i class="fas fa-thumbs-down" onClick={this.createDislike}></i>
        }
        return button;
    }

    render(){
        return (
            <div className="comment">
                <span className="comment-username">{this.props.comment.username}</span>
                <div className="comment-likes">
                    {this.props.comment.body}
                    <div>
                        {this.likeButton()}
                        {this.state.numLikes}
                        {this.dislikeButton()}
                        {this.state.numDislikes}
                    </div>
                </div>
            </div>
        )
    }
};