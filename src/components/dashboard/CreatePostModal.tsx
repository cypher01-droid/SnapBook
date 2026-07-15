import React, { useState, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  onPostCreated: () => void;
}

type MediaTab = 'photo' | 'video';

const CreatePostModal: React.FC<Props> = ({ onClose, onPostCreated }) => {
  const [caption, setCaption] = useState('');
  const [activeTab, setActiveTab] = useState<MediaTab>('photo');

  // Photo state
  const [selectedImages, setSelectedImages] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Video state
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');

  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Reset fields when switching tabs
  const switchTab = (tab: MediaTab) => {
    setActiveTab(tab);
    if (tab === 'photo') {
      setSelectedVideo(null);
      setVideoPreview('');
      if (videoInputRef.current) videoInputRef.current.value = '';
    } else {
      setSelectedImages(null);
      setImagePreviews([]);
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 10) {
        toast.error('You can select up to 10 images');
        return;
      }
      setSelectedImages(files);
      setImagePreviews(Array.from(files).map(f => URL.createObjectURL(f)));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a video file');
        return;
      }
      setSelectedVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'photo' && (!selectedImages || selectedImages.length === 0)) {
      toast.error('Select at least one image');
      return;
    }
    if (activeTab === 'video' && !selectedVideo) {
      toast.error('Select a video');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (activeTab === 'photo' && selectedImages) {
        Array.from(selectedImages).forEach(file => formData.append('images', file));
      } else if (activeTab === 'video' && selectedVideo) {
        formData.append('video', selectedVideo);
      }

      // Upload to backend
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Create post
      const postData: any = { caption };
      if (activeTab === 'photo' && uploadRes.data.urls) {
        postData.images = uploadRes.data.urls;
      } else if (activeTab === 'video' && uploadRes.data.videoUrl) {
        postData.video = uploadRes.data.videoUrl;
      }

      await api.post('/posts', postData);
      toast.success('Post created!');
      onPostCreated();
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.error || err.message || 'Upload failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedImages(null);
    setImagePreviews([]);
    setSelectedVideo(null);
    setVideoPreview('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content glass-modal" onClick={e => e.stopPropagation()}>
        <h3 className="modal-title">Create New Post</h3>

        {/* Tabs */}
        <div className="media-tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'photo' ? 'active' : ''}`}
            onClick={() => switchTab('photo')}
          >
            📷 Photos
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => switchTab('video')}
          >
            🎬 Video
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Caption</label>
            <textarea
              placeholder="Describe your work..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              rows={3}
              className="modal-textarea"
            />
          </div>

          {/* Photo section */}
          {activeTab === 'photo' && (
            <div className="form-group">
              <label>Select up to 10 photos</label>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={imageInputRef}
                onChange={handleImageChange}
                className="file-input-hidden"
                id="image-input"
              />
              <label htmlFor="image-input" className="file-label">📁 Choose photos</label>
              {selectedImages && <span className="file-count">{selectedImages.length} file(s)</span>}

              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((url, i) => (
                    <img key={i} src={url} alt={`Preview ${i + 1}`} className="preview-thumb" />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video section */}
          {activeTab === 'video' && (
            <div className="form-group">
              <label>Select 1 video</label>
              <input
                type="file"
                accept="video/*"
                ref={videoInputRef}
                onChange={handleVideoChange}
                className="file-input-hidden"
                id="video-input"
              />
              <label htmlFor="video-input" className="file-label">🎥 Choose video</label>
              {selectedVideo && <span className="file-count">1 file</span>}

              {videoPreview && (
                <div className="video-preview-container">
                  <video src={videoPreview} controls className="video-preview" />
                </div>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={handleClose} className="btn-outline">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Uploading…' : 'Share Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;