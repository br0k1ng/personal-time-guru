
# Инструкция по развертыванию приложения

В этой инструкции описаны различные способы развертывания приложения, от локальной разработки до полноценного промышленного окружения.

## Содержание

1. [Требования](#требования)
2. [Локальная разработка](#локальная-разработка)
3. [Варианты размещения](#варианты-размещения)
   - [Вариант 1: Статический хостинг + Backend на VPS](#вариант-1-статический-хостинг--backend-на-vps)
   - [Вариант 2: Облачные платформы (PaaS)](#вариант-2-облачные-платформы-paas)
   - [Вариант 3: Контейнеризация с Docker](#вариант-3-контейнеризация-с-docker)
   - [Вариант 4: Полный VPS](#вариант-4-полный-vps)
4. [Настройка базы данных](#настройка-базы-данных)
5. [Настройка Telegram бота](#настройка-telegram-бота)
6. [Настройка HTTPS](#настройка-https)
7. [Настройка CI/CD](#настройка-cicd)
8. [Мониторинг и логирование](#мониторинг-и-логирование)

## Требования

### Frontend
- Node.js 16+ 
- npm или yarn

### Backend
- Node.js 16+
- npm или yarn
- MongoDB (или другая БД по выбору)

### Разработка
- Git
- Редактор кода (VS Code, WebStorm, и т.д.)

## Локальная разработка

### Запуск Frontend

1. Клонировать репозиторий:
   ```bash
   git clone <url-репозитория>
   cd <название-проекта>
   ```

2. Установить зависимости:
   ```bash
   npm install
   # или
   yarn install
   ```

3. Запустить режим разработки:
   ```bash
   npm run dev
   # или
   yarn dev
   ```

4. Приложение будет доступно по адресу `http://localhost:5173`

### Запуск Backend

1. Перейти в директорию сервера:
   ```bash
   cd server
   ```

2. Установить зависимости:
   ```bash
   npm install
   # или
   yarn install
   ```

3. Создать файл `.env` с необходимыми переменными окружения:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/personal_time_guru
   JWT_SECRET=ваш_секретный_ключ
   ```

4. Запустить сервер:
   ```bash
   npm start
   # или
   yarn start
   ```

5. API будет доступно по адресу `http://localhost:3000`

## Варианты размещения

### Вариант 1: Статический хостинг + Backend на VPS

#### Frontend (Netlify/Vercel/GitHub Pages)

1. Сборка проекта:
   ```bash
   npm run build
   # или
   yarn build
   ```

2. Размещение на Netlify:
   - Создайте аккаунт на [Netlify](https://www.netlify.com/)
   - Нажмите "New site from Git"
   - Выберите репозиторий
   - Укажите команду сборки: `npm run build`
   - Укажите директорию публикации: `dist`
   - Добавьте переменную окружения: `VITE_API_URL=https://ваш-бэкенд-домен.com`
   - Нажмите "Deploy site"

3. Размещение на Vercel:
   - Создайте аккаунт на [Vercel](https://vercel.com/)
   - Импортируйте проект из репозитория
   - Vercel автоматически определит Vite проект
   - Добавьте переменную окружения: `VITE_API_URL=https://ваш-бэкенд-домен.com`
   - Нажмите "Deploy"

#### Backend (VPS)

1. Создайте VPS у любого провайдера (DigitalOcean, Linode, Vultr, и т.д.)
2. Установите Node.js:
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Установите PM2 для управления процессами:
   ```bash
   npm install -g pm2
   ```

4. Клонируйте репозиторий:
   ```bash
   git clone <url-репозитория>
   cd <название-проекта>/server
   ```

5. Установите зависимости:
   ```bash
   npm install
   ```

6. Создайте файл `.env` с переменными окружения:
   ```
   PORT=3000
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   MONGODB_URI=mongodb://localhost:27017/personal_time_guru
   JWT_SECRET=ваш_секретный_ключ
   CLIENT_URL=https://ваш-фронтенд-домен.com
   ```

7. Запустите сервер с PM2:
   ```bash
   pm2 start index.js --name "personal-time-guru-api"
   pm2 save
   pm2 startup
   ```

8. Настройте Nginx для проксирования запросов:
   ```bash
   sudo apt-get install nginx
   ```

9. Создайте конфигурацию Nginx:
   ```bash
   sudo nano /etc/nginx/sites-available/personal-time-guru
   ```

10. Добавьте конфигурацию:
    ```nginx
    server {
        listen 80;
        server_name api.ваш-домен.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
    }
    ```

11. Активируйте конфигурацию:
    ```bash
    sudo ln -s /etc/nginx/sites-available/personal-time-guru /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

### Вариант 2: Облачные платформы (PaaS)

#### Heroku

1. Создайте аккаунт на [Heroku](https://www.heroku.com/)
2. Установите Heroku CLI:
   ```bash
   npm install -g heroku
   ```

3. Создайте файл `Procfile` в корне проекта:
   ```
   web: cd server && npm start
   ```

4. Создайте приложение Heroku:
   ```bash
   heroku create personal-time-guru
   ```

5. Настройте переменные окружения:
   ```bash
   heroku config:set TELEGRAM_BOT_TOKEN=ваш_токен_бота
   heroku config:set JWT_SECRET=ваш_секретный_ключ
   heroku config:set CLIENT_URL=https://ваш-фронтенд-домен.com
   heroku config:set MONGODB_URI=mongodb+srv://...
   ```

6. Разверните приложение:
   ```bash
   git push heroku main
   ```

#### Railway

1. Создайте аккаунт на [Railway](https://railway.app/)
2. Подключите репозиторий GitHub
3. Создайте новый проект и выберите репозиторий
4. Настройте переменные окружения:
   - `PORT=3000`
   - `TELEGRAM_BOT_TOKEN=ваш_токен_бота`
   - `JWT_SECRET=ваш_секретный_ключ`
   - `CLIENT_URL=https://ваш-фронтенд-домен.com`
   - `MONGODB_URI=mongodb+srv://...`
5. Укажите команду запуска: `cd server && npm start`
6. Railway автоматически развернет приложение и предоставит домен

### Вариант 3: Контейнеризация с Docker

1. Создайте `Dockerfile` для Frontend:
   ```dockerfile
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. Создайте `nginx.conf`:
   ```nginx
   server {
       listen 80;
       server_name localhost;
       root /usr/share/nginx/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. Создайте `Dockerfile` для Backend:
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY server/package*.json ./
   RUN npm install
   COPY server/ .
   EXPOSE 3000
   CMD ["node", "index.js"]
   ```

4. Создайте `docker-compose.yml`:
   ```yaml
   version: '3'
   services:
     frontend:
       build:
         context: .
         dockerfile: Dockerfile.frontend
       ports:
         - "80:80"
       restart: always
       depends_on:
         - backend
     
     backend:
       build:
         context: .
         dockerfile: Dockerfile.backend
       ports:
         - "3000:3000"
       restart: always
       environment:
         - PORT=3000
         - TELEGRAM_BOT_TOKEN=ваш_токен_бота
         - JWT_SECRET=ваш_секретный_ключ
         - MONGODB_URI=mongodb://mongo:27017/personal_time_guru
         - CLIENT_URL=http://localhost
       depends_on:
         - mongo
     
     mongo:
       image: mongo:latest
       ports:
         - "27017:27017"
       volumes:
         - mongo_data:/data/db
       restart: always

   volumes:
     mongo_data:
   ```

5. Запустите контейнеры:
   ```bash
   docker-compose up -d
   ```

### Вариант 4: Полный VPS

1. Создайте VPS у любого провайдера (DigitalOcean, Linode, Vultr, и т.д.)
2. Обновите систему:
   ```bash
   sudo apt-get update
   sudo apt-get upgrade
   ```

3. Установите Node.js:
   ```bash
   curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. Установите MongoDB:
   ```bash
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

5. Установите Nginx:
   ```bash
   sudo apt-get install -y nginx
   ```

6. Клонируйте репозиторий:
   ```bash
   git clone <url-репозитория>
   cd <название-проекта>
   ```

7. Установите зависимости и соберите Frontend:
   ```bash
   npm install
   npm run build
   ```

8. Создайте конфигурацию Nginx для Frontend:
   ```bash
   sudo nano /etc/nginx/sites-available/personal-time-guru-frontend
   ```

9. Добавьте конфигурацию:
   ```nginx
   server {
       listen 80;
       server_name ваш-домен.com www.ваш-домен.com;
       root /path/to/project/dist;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

10. Активируйте конфигурацию:
    ```bash
    sudo ln -s /etc/nginx/sites-available/personal-time-guru-frontend /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl restart nginx
    ```

11. Настройте Backend:
    ```bash
    cd server
    npm install
    ```

12. Создайте файл `.env`:
    ```
    PORT=3000
    TELEGRAM_BOT_TOKEN=ваш_токен_бота
    JWT_SECRET=ваш_секретный_ключ
    MONGODB_URI=mongodb://localhost:27017/personal_time_guru
    CLIENT_URL=https://ваш-домен.com
    ```

13. Установите PM2 и запустите сервер:
    ```bash
    npm install -g pm2
    pm2 start index.js --name "personal-time-guru-api"
    pm2 save
    pm2 startup
    ```

## Настройка базы данных

### MongoDB Atlas (облачное решение)

1. Создайте аккаунт на [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Создайте новый кластер (бесплатный тир доступен)
3. Добавьте пользователя базы данных:
   - Перейдите в "Database Access" → "Add New Database User"
   - Создайте пользователя с паролем и соответствующими правами
4. Настройте сетевой доступ:
   - Перейдите в "Network Access" → "Add IP Address"
   - Добавьте IP-адрес вашего сервера или `0.0.0.0/0` для доступа отовсюду
5. Получите строку подключения:
   - Нажмите "Connect" на странице кластера
   - Выберите "Connect your application"
   - Скопируйте строку подключения и замените `<password>` на пароль пользователя
6. Обновите `.env` файл на сервере:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/personal_time_guru
   ```

### Локальная MongoDB

1. Установите MongoDB:
   ```bash
   sudo apt-get install -y mongodb
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

2. Создайте базу данных и пользователя:
   ```bash
   mongo
   ```
   ```javascript
   use personal_time_guru
   db.createUser({
     user: "admin",
     pwd: "secure_password",
     roles: [{ role: "readWrite", db: "personal_time_guru" }]
   })
   ```

3. Обновите `.env` файл:
   ```
   MONGODB_URI=mongodb://admin:secure_password@localhost:27017/personal_time_guru
   ```

## Настройка Telegram бота

1. Создайте нового бота у [BotFather](https://t.me/botfather):
   - Напишите `/newbot`
   - Введите имя бота
   - Введите username бота (должен заканчиваться на "bot")
   - Сохраните полученный токен

2. Настройте вебхуки (если используются):
   ```bash
   curl -F "url=https://api.ваш-домен.com/telegram-webhook" https://api.telegram.org/bot<ТОКЕН>/setWebhook
   ```

3. Обновите `.env` файл:
   ```
   TELEGRAM_BOT_TOKEN=ваш_токен_бота
   ```

## Настройка HTTPS

### Let's Encrypt с Certbot

1. Установите Certbot:
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. Получите сертификат:
   ```bash
   sudo certbot --nginx -d ваш-домен.com -d www.ваш-домен.com
   ```

3. Автоматическое обновление сертификата:
   ```bash
   sudo certbot renew --dry-run
   ```

## Настройка CI/CD

### GitHub Actions

1. Создайте файл `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '16'
             
         - name: Install dependencies
           run: npm ci
           
         - name: Build
           run: npm run build
           
         - name: Deploy Frontend to Netlify
           uses: nwtgck/actions-netlify@v1.2
           with:
             publish-dir: './dist'
             production-branch: main
             github-token: ${{ secrets.GITHUB_TOKEN }}
             deploy-message: "Deploy from GitHub Actions"
           env:
             NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
             NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
           
         - name: Deploy Backend to VPS
           uses: appleboy/ssh-action@master
           with:
             host: ${{ secrets.VPS_HOST }}
             username: ${{ secrets.VPS_USERNAME }}
             key: ${{ secrets.VPS_SSH_KEY }}
             script: |
               cd /path/to/project/server
               git pull
               npm ci
               pm2 restart personal-time-guru-api
   ```

2. Добавьте секреты в настройках репозитория:
   - `NETLIFY_AUTH_TOKEN`: токен аутентификации Netlify
   - `NETLIFY_SITE_ID`: ID вашего сайта на Netlify
   - `VPS_HOST`: IP-адрес или домен вашего VPS
   - `VPS_USERNAME`: имя пользователя SSH
   - `VPS_SSH_KEY`: приватный SSH ключ

## Мониторинг и логирование

### PM2 для мониторинга Node.js приложения

1. Установите PM2:
   ```bash
   npm install -g pm2
   ```

2. Запустите приложение с PM2:
   ```bash
   pm2 start index.js --name "personal-time-guru-api"
   ```

3. Мониторинг в реальном времени:
   ```bash
   pm2 monit
   ```

4. Настройте логирование:
   ```bash
   pm2 start index.js --name "personal-time-guru-api" --log /var/log/personal-time-guru.log
   ```

### Настройка nginx логов

1. Логи доступа и ошибок:
   ```bash
   sudo nano /etc/nginx/sites-available/personal-time-guru
   ```

2. Добавьте конфигурацию:
   ```nginx
   access_log /var/log/nginx/personal-time-guru-access.log;
   error_log /var/log/nginx/personal-time-guru-error.log;
   ```

3. Перезапустите Nginx:
   ```bash
   sudo systemctl restart nginx
   ```
