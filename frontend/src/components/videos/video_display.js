import React from 'react'
import '../stylesheets/video_display.css';
import VideoIndexItemContainer from './video_index_item_container';
import CommentFormContainer from '../comments/comment_form_container';
import CommentContainer from '../comments/comment_container';

class VideoDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.upNextVideos = this.upNextVideos.bind(this);
        this.state = {
            numLikes: 0,
            numDislikes: 0,
            liked: false,
            disliked: false,
            errors: ''
        }
        this.createLike = this.createLike.bind(this);
        this.createDislike = this.createDislike.bind(this);
        this.likeButton = this.likeButton.bind(this);
        this.dislikeButton = this.dislikeButton.bind(this);
        this.displayErrors = this.displayErrors.bind(this);
        this.comments = this.comments.bind(this);
    }

    componentDidMount() {
        this.props.fetchVideos()
            .then(() => this.props.fetchVideoLikes(this.props.video._id)
                .then(() => this.setState(
                    {
                        numLikes: this.props.likes.length,
                        numDislikes: this.props.dislikes.length,
                        liked: this.props.likes.filter(like => like.userId === this.props.user.id).length > 0,
                        disliked: this.props.dislikes.filter(dislike => dislike.userId === this.props.user.id).length > 0
                    })
                )
            )
            .then(() => this.props.fetchVideoComments(this.props.video._id))
    }

    upNextVideos(){
        if ((Object.keys(this.props.videos).length > 0)){
            return (
                <ul>
                    {this.props.videos.map(video => 
                        <li>
                            <VideoIndexItemContainer key={video._id} video={video} />
                        </li>    
                    )}
                </ul>
            )
        } else {
            return (
                <p>Loading...</p>
            )
        }
    }

    createLike(){
        if (!this.props.user.id){
            this.setState({ errors: 'You must be logged in to like or dislike' })
        } else if (!this.state.liked){
            this.props.createLike({
                dislike: false,
                likeable_type: 'video',
                likeable_id: this.props.video._id,
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
        if (!this.props.user.id){
            this.setState({ errors: 'You must be logged in to like or dislike' })
        } else if (!this.state.disliked){
            this.props.createLike({
                dislike: true,
                likeable_type: 'video',
                likeable_id: this.props.video._id,
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
            button = <i className="fas fa-thumbs-up liked" onClick={this.createLike}></i>
        } else {
            button = <i className="fas fa-thumbs-up" onClick={this.createLike}></i>
        }
        return button;
    }

    dislikeButton(){
        let button;
        if (this.state.disliked){
            button = <i className="fas fa-thumbs-down disliked" onClick={this.createDislike}></i>
        } else {
            button = <i className="fas fa-thumbs-down" onClick={this.createDislike}></i>
        }
        return button;
    }

    displayErrors(){
        if (this.state.errors != ''){
            return (
                <div className="like-errors">
                    {this.state.errors}
                </div>
            )
        } else {
            return
        }
    }

    comments(){
        if (!this.props.comments) return '';
        return this.props.comments.map(comment => 
            <CommentContainer comment={comment} user={this.props.user}/>
        )
    }

    render() {
        const { video } = this.props;
        if (!video) return null;
        return (
            <div className="entire-video-display-view">
                <div className="video-display-view">
                    <div className="main-section">
                        <div className="video-box">
                            <video key={video._id} className="video-display" controls height="540" width="900">
                                <source src={video.videoURL}></source>
                            </video>
                            <div className="video-description">
                                <div>
                                    <h1>{video.title}</h1>
                                    <h2>{video._id}</h2>
                                </div>
                                {this.displayErrors()}
                                <div className="likes-dislikes">
                                    {this.likeButton()}
                                    {this.state.numLikes}
                                    {this.dislikeButton()}
                                    {this.state.numDislikes}
                                </div>
                            </div>
                        </div>
                        <div className="comments">
                            <CommentFormContainer user={this.props.user} videoId={this.props.video._id} />
                            <div className="comment-div">
                                {this.comments()}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightside-vids">
                    <h1 className="up-next">Up next</h1>
                    {this.upNextVideos()}
                </div>
            </div>
        )
    }
}

export default VideoDisplay;