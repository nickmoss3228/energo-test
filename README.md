React + TypeScript + Vite
Требования к системе / System Requirements
Прежде чем начать, убедитесь, что у вас установлено следующее на вашей системе:

Before you begin, ensure you have the following installed on your system:

Node.js (версия 16.0 или выше / version 16.0 or higher)
npm (поставляется с Node.js / comes with Node.js) или yarn package manager
Git (для клонирования репозитория / for cloning the repository)
Шаги установки / Installation Steps
1. Клонирование репозитория / Clone the Repository
git clone <repository-url>
cd <project-directory-name>
2. Установка зависимостей / Install Dependencies
Используя npm / Using npm:

npm install
3. Запуск сервера разработки / Start the Development Server
Используя npm / Using npm:

npm run dev
Приложение запустится и обычно будет доступно по адресу / The application will start and typically be available at http://localhost:5173

4. Сборка для продакшена / Build for Production
Для создания production сборки / To create a production build:

Используя npm / Using npm:

npm run build
Требования к браузеру / Browser Requirements
Это приложение требует современный веб-браузер с поддержкой WebRTC:

This application requires a modern web browser with WebRTC support:

Chrome 60+
Firefox 60+
Safari 11+
Edge 79+
Разрешения / Permissions
Приложению требуются следующие разрешения браузера:

The application requires the following browser permissions:

Доступ к камере / Camera access - для функций видеоконференций / for video conferencing features
Доступ к микрофону / Microphone access - для аудио в конференциях / for audio in conferences
Примечание: URL http://localhost:5173 доступен только при запущенном сервере разработки на локальной машине.

Note: The URL http://localhost:5173 is only accessible when the development server is running on your local machine.
