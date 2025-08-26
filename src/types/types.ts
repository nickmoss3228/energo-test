
export type TaskStatus = 'Завершено' | 'В процессе' | 'Ожидает';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

export interface DeviceInfo {
  video: string;
  audio: string;
}

export interface WebRTCState {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
  loading: boolean;
  error: string | null;
  deviceInfo: DeviceInfo | null;
}


export interface RootState {
  webrtc: WebRTCState;
}

// import type { Task, TaskStatus } from '../types/types';
// import { WebRTCState } from '../store/webrtcSlice'

// Tasks component types
export interface TasksProps {}

export interface TasksState {
  tasks: Task[];
  loading: boolean;
}

// Conference component types  
export interface ConferenceProps {}

export type ConferenceParams = {
  id: string;
} & Record<string, string | undefined>;

// Utility type for status styling
export type StatusStyleMap = Record<TaskStatus | 'default', string>;