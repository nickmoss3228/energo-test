// src/components/Conference.tsx
import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store.ts';
import type { RootState } from '../types/types.ts';
import type { ConferenceParams } from '../types/types.ts';
import {
  initializeWebRTC,
  toggleMute,
  toggleVideoRequest,
  enableVideo,
  cleanupStream
} from '../store/webrtcSlice';

const Conference: React.FC = () => {
  const { id: taskId } = useParams<ConferenceParams>();
  const dispatch = useDispatch<AppDispatch>();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const {
    stream,
    isMuted,
    isVideoEnabled,
    loading,
    error,
    deviceInfo
  } = useSelector((state: RootState) => state.webrtc);

  // Инициализация WebRTC
  useEffect(() => {
    dispatch(initializeWebRTC());
  }, [dispatch]);

  // Установка видео потока в элемент video
  useEffect(() => {
    if (stream && videoRef.current && isVideoEnabled) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);
    }
  }, [stream, isVideoEnabled]);

  // Очистка ресурсов при размонтировании
  useEffect(() => {
    return () => {
      dispatch(cleanupStream());
    };
  }, [dispatch]);

  // Обработчики событий
  const handleToggleMute = (): void => {
    dispatch(toggleMute());
  };

  const handleToggleVideo = (): void => {
    if (isVideoEnabled) {
      if (stream) {
        const videoTracks: MediaStreamTrack[] = stream.getVideoTracks();
        videoTracks.forEach((track: MediaStreamTrack) => {
          track.stop();
        });
      }
      dispatch(toggleVideoRequest());
    } else {
      dispatch(enableVideo(stream));
    }
  };

  const handleRetry = (): void => {
    dispatch(initializeWebRTC());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-700 to-green-700 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-400 mx-auto mb-6"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border-2 border-purple-300 opacity-20"></div>
          </div>
          <p className="text-xl text-white font-medium">
            {isVideoEnabled === false && !error ? 
              'Включение видео...' : 
              'Инициализация видео-комнаты...'
            }
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Ошибка</h2>
            <p className="text-gray-600 mb-6">{error}</p>
          </div>
          
          <div className="space-y-3">
            <button 
              onClick={handleRetry} 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200"
            >
              Попробовать снова
            </button>
            <Link 
              to="/" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-colors duration-200 inline-block"
            >
              Вернуться к задачам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-red-700 to-green-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 pb-6 border-b border-gray-700">
          <h1 className="text-3xl md:text-3xl font-bold text-white mb-6 md:mb-0">
            Видео-комната для задачи #{taskId}
          </h1>
          <Link 
            to="/" 
            className="text-purple-300 hover:text-purple-100 font-semibold text-lg transition-colors duration-200 inline-flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Вернуться к списку задач
          </Link>
        </div>

        {/* Видео контейнер*/}
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl mb-8 max-w-5xl mx-auto relative">
          {isVideoEnabled && stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-h-[600px] object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-96 bg-gradient-to-r from-gray-800 to-gray-900">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl text-gray-400 font-medium">Видео отключено</span>
              </div>
            </div>
          )}
        </div>

        {/* Управление */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleToggleMute}
            disabled={!stream}
            className={`
              flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px]
              ${isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25'
              }
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMuted ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              )}
            </svg>
            {isMuted ? 'Включить микрофон' : 'Отключить микрофон'}
          </button>

          <button
            onClick={handleToggleVideo}
            disabled={loading}
            className={`
              flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed min-w-[250px]
              ${!isVideoEnabled 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/25' 
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              }
            `}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {!isVideoEnabled ? 'Включить видео' : 'Отключить видео'}
          </button>
        </div>

        {/* Device Info */}
        {deviceInfo && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Информация об устройствах
            </h3>
            <div className="space-y-2 text-gray-300">
              <p><span className="font-semibold text-purple-300">Видео:</span> {deviceInfo.video}</p>
              <p><span className="font-semibold text-purple-300">Аудио:</span> {deviceInfo.audio}</p>
            </div>
          </div>
        )}

        {/* Room Status */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-300 font-semibold">Подключен</span>
          </div>
          <p className="text-white mb-1">Комната задачи #{taskId}</p>
          <p className="text-gray-300">Участники: 1 (только вы)</p>
        </div>
      </div>
    </div>
  );
};

export default Conference;