const express = require('express');
const router = express.Router();
const upload = require('../../services/file-upload');
const Video = require('../../models/Video');

// 'video' is key where the video will be sent to the server on request
const singleUpload = upload.single('video');

router.get('/videos', (req, res) => {
    Video.find()
        .then(videos => res.json(videos))
        .catch(error => res.status(404).json({ noVideos: 'No videos found' }))
});

router.get('/videos/:video_id', (req, res) => {
    Video.findById(req.params.id)
        .then(video => res.json(video))
        .catch(error => res.status(404).json({ noVideo: 'No video found with that id' }))
});

//Create (upload) video route
router.post('/videos', singleUpload, (req, res) => {

    video = new Video({
        title: req.body.title,
        user_id: req.body.user_id,
        videoURL: req.file.location
    });
    console.log("uploaded video", video);

    video.save()
        .then((video) => res.send(video))
});

router.get('/results', (req, res) => {
    Video.includes({title: req.params.body})
        .then(videos => res.json(videos))
        .catch(error => res.status(404).json({ noVideos: "No videos found" }))
})

module.exports = router;