import './App.css';
import React from 'react';
import Logo from './logo.png';

const Header = ({ addVideo }) => {
  return (
    <nav className='navbar navbar-expand-lg py-3 navbar-light shadow-lg  bg-white rounded sticky-top'>
      <div className='container'>
        <a
          className='navbar-brand'
          href='#/'
          onClick={(e) => e.preventDefault()}
        >
          <img
            src={Logo}
            width='45'
            alt=''
            className='d-inline-block align-middle mr-2'
          />
          <span className='font-weight-bold logo-text'>
            Video Recommendations
          </span>
        </a>

        <button
          type='button'
          data-toggle='collapse'
          data-target='#navbarSupportedContent'
          aria-controls='navbarSupportedContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
          className='navbar-toggler'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div id='navbarSupportedContent' className='collapse navbar-collapse'>
          <ul className='navbar-nav ml-auto'>
            <li className='nav-item'>
              <button
                className='btn add-vid-button-toggler'
                data-toggle='collapse'
                data-target='#addVideo'
                aria-expanded='false'
                aria-controls='addVideo'
              >
                Add Video
              </button>
            </li>
            <li className='nav-item active'>
              <a
                href='#/'
                onClick={(e) => e.preventDefault()}
                className='nav-link'
              >
                Pricing
              </a>
            </li>
            <li className='nav-item active'>
              <a
                href='#/'
                onClick={(e) => e.preventDefault()}
                className='nav-link'
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
      <form
        className='add-video-container collapse form-group shadow-lg  bg-dark rounded p-3'
        id='addVideo'
        onSubmit={addVideo}
      >
        <div className='add-video-title-container form-outline'>
          <input
            type='text'
            id='title-input'
            className='title-input form-control'
            placeholder='Title of the video'
            name='title'
            required
          />
        </div>
        <div className='add-video-url-container form-outline'>
          <input
            type='url'
            className='url-input form-control'
            id='typeURL'
            placeholder='Url - https://www.youtube.com/watch?v=...'
            name='url'
            required
          />
        </div>
        <div className='add-video-author-container form-outline'>
          <input
            type='text'
            id='author-input'
            className='author-input form-control'
            placeholder={`Uploader's name - optional`}
            name='author'
          />
        </div>
        <div className='add-video-button-container form-outline'>
          <button
            className='btn btn-secondary add-video-button form-control'
            id='submit-button'
            type='submit'
          >
            Upload
          </button>
        </div>
      </form>
    </nav>
  );
};
export default Header;
