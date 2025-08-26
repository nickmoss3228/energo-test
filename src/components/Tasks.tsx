// src/components/Tasks.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import type { Task, TaskStatus } from '../types/types';
import type { StatusStyleMap } from '../types/types';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock API
  const mock: Task[] = [
    { id: 1, title: "Разработать компонент входа", status: "В процессе" },
    { id: 2, title: "Настроить WebRTC", status: "Завершено" },
    { id: 3, title: "Тестирование API", status: "Ожидает" },
    { id: 4, title: "Оптимизация производительности", status: "В процессе" },
    { id: 5, title: "Документация проекта", status: "Ожидает" },
  ];

  useEffect(() => {
    const fetchTasks = (): void => {
      setLoading(true);

      setTimeout(() => {
        setTasks(mock);
        setLoading(false);
      }, 1000);
    };
    fetchTasks();
  }, []);

  const getStatusStyle = (status: TaskStatus): string => {
    const statusStyles: StatusStyleMap = {
      "Завершено": "bg-emerald-500 text-white",
      "В процессе": "bg-amber-500 text-white", 
      "Ожидает": "bg-rose-500 text-white",
      "default": "bg-gray-400 text-white"
    };
    
    return statusStyles[status] || statusStyles.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Загрузка задач...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-300 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-3 lg:px-8">
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Список задач
          </h1>
          <div className="w-60 h-2 bg-gradient-to-r from-indigo-500 to-purple-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid gap-6 md:gap-5">
          {tasks.map((task: Task) => (
            <div 
              key={task.id} 
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                      #{task.id} - {task.title}
                    </h3>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${getStatusStyle(task.status)}`}>
                      {task.status === "В процессе" && (
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      )}
                      {task.status}
                    </span>
                  </div>
                  
                  <Link 
                    to={`/video-room/${task.id}`} 
                    className="bg-gradient-to-r from-indigo-400 to-purple-700 hover:from-indigo-600 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center inline-flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Перейти в видео-комнату
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;