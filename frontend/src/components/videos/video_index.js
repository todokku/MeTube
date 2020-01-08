import React, { Component } from 'react';
import VideoIndexItemContainer from './video_index_item_container';

export class VideoIndex extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {
        debugger;
        this.props.fetchVideos();
    }
    
    render() {
        debugger;
        return (
            <div>
                <ul>
                    {this.props.videos.map(video =>
                        <li>
                            <VideoIndexItemContainer key={video.id} video={video} />
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

export default VideoIndex
