import { createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

// информация про устройства
interface DeviceInfo {
  video: string;
  audio: string;
}

// определить интерфейс состояния WebRTC
interface WebRTCState {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
  loading: boolean;
  error: string | null;
  deviceInfo: DeviceInfo | null;
}

// изначальное состояние
const initialState: WebRTCState = {
  stream: null,
  isMuted: false,
  isVideoEnabled: true,
  loading: false,
  error: null,
  deviceInfo: null
};

// возращаемый тип для инициализации WebRTC
interface InitializeWebRTCReturn {
  stream: MediaStream;
  deviceInfo: DeviceInfo;
}

// фсинхронное действие для инициализации WebRTC
export const initializeWebRTC = createAsyncThunk<
  InitializeWebRTCReturn,
  void,
  { rejectValue: string }
>(
  'webrtc/initialize',
  async (_, { rejectWithValue }) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Получение информации об устройствах
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevice = devices.find(device => device.kind === 'videoinput');
      const audioDevice = devices.find(device => device.kind === 'audioinput');

      return {
        stream: mediaStream,
        deviceInfo: {
          video: videoDevice ? videoDevice.label || 'Камера доступна' : 'Камера не найдена',
          audio: audioDevice ? audioDevice.label || 'Микрофон доступен' : 'Микрофон не найден'
        }
      };
    } catch (error: unknown) {
      let errorMessage = 'Неизвестная ошибка';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Доступ к камере и микрофону запрещен';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'Камера или микрофон не найдены';
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Устройства уже используются другим приложением';
        }
      }
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Асинхронное действие для повторного включения видео
export const enableVideo = createAsyncThunk<
  MediaStream,
  MediaStream | null,
  { rejectValue: string }
>(
  'webrtc/enableVideo',
  async (currentStream, { rejectWithValue }) => {
    try {
      // Если есть текущий поток, получаем аудио дорожки
      const audioTracks = currentStream ? currentStream.getAudioTracks() : [];
      
      // Получаем новый видео поток
      const newVideoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        },
        audio: audioTracks.length > 0 ? false : { // Если аудио уже есть, не запрашиваем
          echoCancellation: true,
          noiseSuppression: true
        }
      });

      // Создаем новый MediaStream
      const combinedStream = new MediaStream();
      
      // Добавляем видео дорожки
      newVideoStream.getVideoTracks().forEach(track => {
        combinedStream.addTrack(track);
      });
      
      // Добавляем существующие аудио дорожки или новые
      if (audioTracks.length > 0) {
        audioTracks.forEach(track => {
          combinedStream.addTrack(track);
        });
      } else {
        newVideoStream.getAudioTracks().forEach(track => {
          combinedStream.addTrack(track);
        });
      }

      return combinedStream;
    } catch (error: unknown) {
      return rejectWithValue('Не удалось включить видео');
    }
  }
);

const webrtcSlice = createSlice({
  name: 'webrtc',
  initialState,
  reducers: {
    toggleMute: (state) => {
      if (state.stream) {
        const audioTracks = state.stream.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = state.isMuted;
        });
        state.isMuted = !state.isMuted;
      }
    },
    
    toggleVideoRequest: (state) => {
      state.isVideoEnabled = !state.isVideoEnabled;
    },

    cleanupStream: (state) => {
      if (state.stream) {
        state.stream.getTracks().forEach(track => {
          track.stop();
        });
      }
      state.stream = null;
      state.isMuted = false;
      state.isVideoEnabled = true;
      state.deviceInfo = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    }
  },
  
  extraReducers: (builder) => {
    builder
      // Инициализация WebRTC
      .addCase(initializeWebRTC.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeWebRTC.fulfilled, (state, action: PayloadAction<InitializeWebRTCReturn>) => {
        state.loading = false;
        state.stream = action.payload.stream;
        state.deviceInfo = action.payload.deviceInfo;
        state.isVideoEnabled = true;
        state.isMuted = false;
      })
      .addCase(initializeWebRTC.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка при инициализации';
      })
      
      // Включение видео
      .addCase(enableVideo.pending, (state) => {
        state.loading = true;
      })
      .addCase(enableVideo.fulfilled, (state, action: PayloadAction<MediaStream>) => {
        state.loading = false;
        state.stream = action.payload;
        state.isVideoEnabled = true;
      })
      .addCase(enableVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Произошла ошибка при включении видео';
        state.isVideoEnabled = false;
      });
  }
});

export const { 
  toggleMute, 
  toggleVideoRequest, 
  cleanupStream, 
  clearError 
} = webrtcSlice.actions;

export default webrtcSlice.reducer;
export type { WebRTCState, DeviceInfo };