import './App.css';
import React from 'react';

const VideoCard = ({
  video,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  likedVideos,
  dislikedVideos,
}) => {
  /*const vid = {
    id: 523523,
    title: 'Never Gonna Give You Up',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likes: 23,
    dislikes: 2,
    uploader: 'Simba',
  };*/

  const shortenString = (string, length) => {
    if (string.length <= length) {
      return string;
    }
    return string.slice(0, length) + '...';
  };

  const formatVotes = (votes) => {
    if (votes > 999999999) {
      return `${Math.floor(votes / 1000000000)}B`;
    } else if (votes > 999999) {
      return `${Math.floor(votes / 1000000)}M`;
    } else if (votes > 999) {
      return `${Math.floor(votes / 1000)}K`;
    } else {
      return votes;
    }
  };

  return (
    <div className='card-container shadow bg-white rounded'>
      <div className='video-container'>
        <iframe
          className='video-frame'
          title='YouTube Video Player'
          src={video.url.replace('watch?v=', `embed/`)}
          allowFullScreen
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        ></iframe>
      </div>
      <div className='title-container side-margins'>
        <span className='video-title'>{shortenString(video.title, 55)}</span>
      </div>
      {/* <hr className='divider-line side-margins' />*/}
      <div className='actions-container shadow-lg bg-white rounded'>
        <div className='author-container sharp-border-radius'>
          <i className='fas fa-user-edit user-icon inactive-button'></i>
          <span className='author-name'>
            {shortenString(video.uploader, 12)}
          </span>
        </div>
        <button
          className='like-container sharp-border-radius'
          data-id={video.id}
          onClick={likeVideo}
        >
          <i
            className={
              likedVideos.includes(video.id)
                ? 'fas fa-thumbs-up like-icon active-button'
                : 'fas fa-thumbs-up like-icon inactive-button'
            }
          ></i>
          <span className='like-count'>{formatVotes(video.likes)}</span>
        </button>
        <button
          className='dislike-container sharp-border-radius'
          data-id={video.id}
          onClick={dislikeVideo}
        >
          <i
            className={
              dislikedVideos.includes(video.id)
                ? 'fas fa-thumbs-down dislike-icon active-button'
                : 'fas fa-thumbs-down dislike-icon inactive-button'
            }
          ></i>
          <span className='dislike-count'>{formatVotes(video.dislikes)}</span>
        </button>
        <button
          className='delete-container sharp-border-radius'
          data-id={video.id}
          onClick={deleteVideo}
        >
          <i className='fas fa-trash delete-icon inactive-button'></i>
          <span className='delete-text'>Delete</span>
        </button>
      </div>
      {/* <hr className='divider-line side-margins' />*/}
    </div>
  );
};
export default VideoCard;
