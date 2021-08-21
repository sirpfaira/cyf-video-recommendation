import './App.css';
import React, { useState, useEffect } from 'react';
import VideoCard from './VideoCard';
import Header from './Header';

const App = () => {
  const [videos, setVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const [dislikedVideos, setDislikedVideos] = useState([]);
  const [descending, setDescending] = useState(true);

  useEffect(() => {
    console.log(`run: ${descending}`);
    const callApi = async () => {
      const res = await fetch(`/videos?order=${descending ? 'desc' : 'asc'}`);
      const body = await res.json();
      if (res.status !== 200) throw Error(body.message);
      return body;
    };

    callApi()
      .then((data) => {
        //console.log(`Data: ${data}`);
        setVideos(data);
      })
      .catch((err) => console.log(err));
  }, [descending]);

  const deleteVideo = async (e) => {
    if (videos.length > 1) {
      const tempArr = [...videos];
      let targetId = Number(e.currentTarget.getAttribute('data-id'));

      if (targetId) {
        await fetch(`/videos/${targetId}`, {
          method: 'DELETE',
        });
        setVideos(tempArr.filter((vid) => vid.id !== targetId));
      } else {
        console.log(`Id not found!`);
      }
    } else {
      setVideos([]);
    }
  };

  const likeVideo = async (e) => {
    const addLike = async (id) => {
      const vid = videos.find((el) => Number(el.id) === Number(id));
      if (vid) {
        const newVid = {
          likes: vid.likes + 1,
          dislikes: vid.dislikes,
        };
        const res = await fetch(`/videos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVid),
        });
        console.log(res);
      }
    };

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
          addLike(videoId);
          setVideos(tempArr);
        }
      });
    }
  };
  const dislikeVideo = (e) => {
    const addDislike = async (id) => {
      const vid = videos.find((el) => Number(el.id) === Number(id));
      if (vid) {
        const newVid = {
          likes: vid.likes,
          dislikes: vid.dislikes + 1,
        };
        await fetch(`/videos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVid),
        });
      }
    };

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
          addDislike(videoId);
        }
      });
    }
  };

  const addVideo = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const title = data.get('title');
    const url = data.get('url');
    const author = data.get('author');

    if (title && url) {
      if (url.includes('https://www.youtube.com/watch?v=')) {
        let tempArr = [...videos];
        const newVideo = {
          id: getId(videos),
          title: title,
          url: url,
          uploader: author || 'Anonymous',
          likes: 0,
          dislikes: 0,
        };

        await fetch('/videos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newVideo),
        });

        Array.from(document.querySelectorAll('input')).forEach(
          (input) => (input.value = '')
        );
        tempArr.push(newVideo);
        setVideos(tempArr);
      } else {
        alert('Invalid Url!');
      }
    } else {
      alert('Fill all required fields!');
    }
  };

  const changeSortOrder = () => {
    setDescending(!descending);
  };

  const getId = (arr) => {
    if (arr.length > 0) {
      const sortedArr = arr.sort((a, b) =>
        a.id > b.id ? 1 : b.id > a.id ? -1 : 0
      );
      return sortedArr[sortedArr.length - 1].id + 1;
    } else {
      return 1;
    }
  };

  if (videos.length > 0) {
    return (
      <div className='main-container'>
        <Header addVideo={addVideo} changeSortOrder={changeSortOrder} />
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
        <Header addVideo={addVideo} />
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

export default App;
