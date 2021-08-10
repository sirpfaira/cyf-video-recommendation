import './App.css';
import React, { useState } from 'react';
import VideoCard from './VideoCard';
import Header from './Header';

const App = () => {
  const [videos, setVideos] = useState(fetchedVideos);
  const [likedVideos, setLikedVideos] = useState([]);
  const [dislikedVideos, setDislikedVideos] = useState([]);

  const deleteVideo = (e) => {
    if (videos.length > 1) {
      const tempArr = [...videos];
      let targetId = Number(e.currentTarget.getAttribute('data-id'));

      if (targetId) {
        let targetIndex = -1;
        for (var x = 0; x < tempArr.length; x++) {
          if (targetId === tempArr[x].id) {
            targetIndex = x;
            break;
          }
        }

        if (targetIndex >= 0) {
          tempArr.splice(targetIndex, 1);
          setLikedVideos(likedVideos.filter((id) => id !== targetId));
          setDislikedVideos(dislikedVideos.filter((id) => id !== targetId));
          setVideos(tempArr);
        } else {
          console.log(`Id not found!`);
        }
      }
    } else {
      setVideos([]);
    }
  };

  const likeVideo = (e) => {
    const videoId = Number(e.currentTarget.getAttribute('data-id'));

    if (videoId) {
      let tempArr = [...videos];
      tempArr.forEach((video) => {
        if (video.id === videoId) {
          var oldLikes = video.likes;

          if (likedVideos.includes(videoId)) {
            video.likes = oldLikes - 1;
            setLikedVideos(likedVideos.filter((id) => id !== videoId));
          } else {
            if (dislikedVideos.includes(videoId)) {
              var oldDislikes = video.dislikes;
              video.dislikes = oldDislikes - 1;
              setDislikedVideos(dislikedVideos.filter((id) => id !== videoId));
            }
            video.likes = oldLikes + 1;
            setLikedVideos((preState) => preState.concat(videoId));
          }
          setVideos(tempArr);
          return;
        }
      });
    }
  };
  const dislikeVideo = (e) => {
    const videoId = Number(e.currentTarget.getAttribute('data-id'));

    if (videoId) {
      let tempArr = [...videos];
      tempArr.forEach((video) => {
        if (video.id === videoId) {
          var oldDislikes = video.dislikes;

          if (dislikedVideos.includes(videoId)) {
            video.dislikes = oldDislikes - 1;
            setDislikedVideos(dislikedVideos.filter((id) => id !== videoId));
          } else {
            if (likedVideos.includes(videoId)) {
              var oldLikes = video.likes;
              video.likes = oldLikes - 1;
              setLikedVideos(likedVideos.filter((id) => id !== videoId));
            }
            video.dislikes = oldDislikes + 1;
            setDislikedVideos((preState) => preState.concat(videoId));
          }
          setVideos(tempArr);
          return;
        }
      });
    }
  };

  const addVideo = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const title = data.get('title');
    const url = data.get('url');
    const author = data.get('author');

    if (title && url) {
      if (url.includes('https://www.youtube.com/watch?v=')) {
        let tempArr = [...videos];
        tempArr.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
        const newVideo = {
          id: tempArr[tempArr.length - 1].id + 1,
          title: title,
          url: url,
          likes: 0,
          dislikes: 0,
          uploader: author || 'Anonymous',
        };
        //console.log(newVideo);
        //tempArr.push(newVideo);
        Array.from(document.querySelectorAll('input')).forEach(
          (input) => (input.value = '')
        );

        tempArr.splice(0, 0, newVideo);
        setVideos(tempArr);
      } else {
        alert('Invalid Url!');
      }
    } else {
      alert('Fill all required fields!');
    }
  };

  if (videos.length > 0) {
    //videos.sort((a, b) => (a.id > b.id ? -1 : b.id > a.id ? 1 : 0));
    videos.sort((a, b) => (a.likes > b.likes ? -1 : b.likes > a.likes ? 1 : 0));

    return (
      <div className='main-container'>
        <Header addVideo={addVideo} />
        <div className='all-cards-container'>
          {videos.map((video, index) => (
            <VideoCard
              video={video}
              deleteVideo={deleteVideo}
              likeVideo={likeVideo}
              dislikeVideo={dislikeVideo}
              key={index}
              likedVideos={likedVideos}
              dislikedVideos={dislikedVideos}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div className='main-container'>
        <div className='empty-container'>
          <p className='empty-text'>
            There are no videos to show please click on add video to create a
            list.
          </p>
        </div>
      </div>
    );
  }
};

const fetchedVideos = [
  {
    id: 1,
    title: 'Never Gonna Give You Up',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likes: 23,
    dislikes: 2,
    uploader: 'Simba Pfaira',
  },
  {
    id: 2,
    title: 'The Coding Train',
    url: 'https://www.youtube.com/watch?v=HerCR8bw_GE',
    likes: 2006,
    dislikes: 29,
    uploader: 'Daryl Simon',
  },
  {
    id: 3,
    title: 'Mac & Cheese | Basics with Babish',
    url: 'https://www.youtube.com/watch?v=FUeyrEN14Rk',
    likes: 790789,
    dislikes: 950000,
    uploader: 'Carl Master Chibaba Chenyuchi',
  },
  {
    id: 4,
    title: 'Videos for Cats to Watch - 8 Hour Bird Bonanza',
    url: 'https://www.youtube.com/watch?v=xbs7FT7dXYc',
    likes: 3468798563,
    dislikes: 567789,
    uploader: 'Cat Lover',
  },
  {
    id: 5,
    title:
      "Learn Unity - Beginner's Game Development Course For Those People Who Love Games like Me And Naison Chikati",
    url: 'https://www.youtube.com/watch?v=gB1F9G0JXOo',
    likes: 78234563,
    dislikes: 22345,
    uploader: 'Game Boy',
  },
];
export default App;
