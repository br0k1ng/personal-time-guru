
require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const cors = require('cors');
const schedule = require('node-schedule');
const fs = require('fs');

// Инициализация Express приложения
const app = express();
app.use(cors());
app.use(express.json());

// Локализация для бота
const locales = {
  ru: {
    greeting: 'Привет, %s! Я твой персональный планировщик. Используй мини-приложение для управления задачами, привычками и расписанием.',
    openApp: 'Вы можете открыть мини-приложение кнопкой ниже',
    noTasks: 'У вас нет активных задач.',
    tasks: 'Задачи',
    today: 'на сегодня',
    completed: 'выполнено',
    events: 'События',
    taskSummary: '📝 Активные задачи (%d):',
    eventSummary: '📅 События на сегодня (%d):',
    tomorrowEvents: '📅 События на завтра (%d):',
    noEvents: 'На сегодня нет запланированных событий.',
    noTomorrowEvents: 'Завтра у вас нет запланированных событий.',
    planTomorrow: 'Не забудьте спланировать задачи на завтра!',
    habits: 'Привычки',
    habitSummary: '🔄 Ваши привычки (%d):',
    noHabits: 'У вас пока нет отслеживаемых привычек.',
    reminderStart: '🔔 Напоминание о событии:',
    settingsCommand: '/settings - Настройки уведомлений',
    tasksCommand: '/tasks - Список задач',
    eventsCommand: '/events - События на сегодня',
    statsCommand: '/stats - Статистика по выполнению',
    habitsCommand: '/habits - Ваши привычки',
    helpCommand: '/help - Справка по командам',
    commandList: 'Список доступных команд:',
    settings: 'Настройки уведомлений:',
    morningOn: '✅ Утреннее напоминание (7:00)',
    morningOff: '❌ Утреннее напоминание (7:00)',
    eveningOn: '✅ Вечернее напоминание (21:00)',
    eveningOff: '❌ Вечернее напоминание (21:00)',
    reminderOn: '✅ Напоминания о событиях',
    reminderOff: '❌ Напоминания о событиях',
    toggleMorning: 'Переключить утреннее',
    toggleEvening: 'Переключить вечернее',
    toggleReminder: 'Переключить напоминания',
    statsTitle: 'Ваша статистика за 7 дней:',
    tasksCompleted: '✅ Выполнено задач: %d из %d (%d%%)',
    habitStreak: '🔥 Самая длинная серия: %d дней',
    eventStats: '📊 Количество событий: %d',
    markComplete: 'Отметить выполненным',
    markIncomplete: 'Отметить невыполненным',
    taskMarkedComplete: 'Задача отмечена как выполненная: %s',
    taskMarkedIncomplete: 'Задача отмечена как невыполненная: %s',
    language: 'Язык / Language / 语言',
    languageChanged: 'Язык изменен на Русский'
  },
  en: {
    greeting: 'Hello, %s! I am your personal planner. Use the mini-app to manage tasks, habits and schedule.',
    openApp: 'You can open the mini-app with the button below',
    noTasks: 'You have no active tasks.',
    tasks: 'Tasks',
    today: 'for today',
    completed: 'completed',
    events: 'Events',
    taskSummary: '📝 Active tasks (%d):',
    eventSummary: '📅 Events for today (%d):',
    tomorrowEvents: '📅 Events for tomorrow (%d):',
    noEvents: 'There are no scheduled events for today.',
    noTomorrowEvents: 'There are no scheduled events for tomorrow.',
    planTomorrow: 'Don\'t forget to plan tasks for tomorrow!',
    habits: 'Habits',
    habitSummary: '🔄 Your habits (%d):',
    noHabits: 'You don\'t have any tracked habits yet.',
    reminderStart: '🔔 Event reminder:',
    settingsCommand: '/settings - Notification settings',
    tasksCommand: '/tasks - Task list',
    eventsCommand: '/events - Today\'s events',
    statsCommand: '/stats - Completion statistics',
    habitsCommand: '/habits - Your habits',
    helpCommand: '/help - Command reference',
    commandList: 'List of available commands:',
    settings: 'Notification settings:',
    morningOn: '✅ Morning reminder (7:00)',
    morningOff: '❌ Morning reminder (7:00)',
    eveningOn: '✅ Evening reminder (21:00)',
    eveningOff: '❌ Evening reminder (21:00)',
    reminderOn: '✅ Event reminders',
    reminderOff: '❌ Event reminders',
    toggleMorning: 'Toggle morning',
    toggleEvening: 'Toggle evening',
    toggleReminder: 'Toggle reminders',
    statsTitle: 'Your statistics for 7 days:',
    tasksCompleted: '✅ Tasks completed: %d of %d (%d%%)',
    habitStreak: '🔥 Longest streak: %d days',
    eventStats: '📊 Number of events: %d',
    markComplete: 'Mark as completed',
    markIncomplete: 'Mark as incomplete',
    taskMarkedComplete: 'Task marked as completed: %s',
    taskMarkedIncomplete: 'Task marked as incomplete: %s',
    language: 'Язык / Language / 语言',
    languageChanged: 'Language changed to English'
  },
  zh: {
    greeting: '你好, %s! 我是你的个人规划师。使用迷你应用程序管理任务、习惯和日程安排。',
    openApp: '您可以使用下面的按钮打开迷你应用程序',
    noTasks: '您没有活动任务。',
    tasks: '任务',
    today: '今天',
    completed: '已完成',
    events: '事件',
    taskSummary: '📝 活动任务 (%d):',
    eventSummary: '📅 今天的事件 (%d):',
    tomorrowEvents: '📅 明天的事件 (%d):',
    noEvents: '今天没有安排事件。',
    noTomorrowEvents: '明天没有安排事件。',
    planTomorrow: '别忘了为明天计划任务！',
    habits: '习惯',
    habitSummary: '🔄 你的习惯 (%d):',
    noHabits: '你还没有跟踪习惯。',
    reminderStart: '🔔 事件提醒:',
    settingsCommand: '/settings - 通知设置',
    tasksCommand: '/tasks - 任务列表',
    eventsCommand: '/events - 今天的事件',
    statsCommand: '/stats - 完成统计',
    habitsCommand: '/habits - 你的习惯',
    helpCommand: '/help - 命令参考',
    commandList: '可用命令列表:',
    settings: '通知设置:',
    morningOn: '✅ 早晨提醒 (7:00)',
    morningOff: '❌ 早晨提醒 (7:00)',
    eveningOn: '✅ 晚上提醒 (21:00)',
    eveningOff: '❌ 晚上提醒 (21:00)',
    reminderOn: '✅ 事件提醒',
    reminderOff: '❌ 事件提醒',
    toggleMorning: '切换早晨提醒',
    toggleEvening: '切换晚上提醒',
    toggleReminder: '切换事件提醒',
    statsTitle: '您 7 天的统计数据:',
    tasksCompleted: '✅ 已完成任务: %d 个, 共 %d 个 (%d%%)',
    habitStreak: '🔥 最长连续记录: %d 天',
    eventStats: '📊 事件数量: %d',
    markComplete: '标记为已完成',
    markIncomplete: '标记为未完成',
    taskMarkedComplete: '任务标记为已完成: %s',
    taskMarkedIncomplete: '任务标记为未完成: %s',
    language: 'Язык / Language / 语言',
    languageChanged: '语言已更改为中文'
  }
};

// Токен из .env файла
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

// Хранилище пользователей и их данных (в продакшн лучше использовать БД)
const usersFile = 'users.json';
let users = {};

// Загрузка пользователей из файла при старте
try {
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile, 'utf8');
    users = JSON.parse(data);
    console.log('Пользователи загружены из файла');
  }
} catch (err) {
  console.log('Ошибка чтения файла пользователей:', err);
}

// Сохранение пользователей в файл
function saveUsers() {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Приветственное сообщение при старте бота
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  const firstName = msg.from.first_name;
  
  // Добавляем пользователя в наше хранилище
  if (!users[userId]) {
    users[userId] = {
      chatId: chatId,
      firstName: firstName,
      tasks: [],
      events: [],
      habits: [],
      settings: {
        morningNotification: true,
        eveningNotification: true,
        reminderNotification: true
      },
      language: 'ru'
    };
    saveUsers();
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  // Приветственное сообщение и инструкция
  bot.sendMessage(chatId, t.greeting.replace('%s', firstName));
  
  // Отправка кнопки для открытия мини-приложения
  bot.sendMessage(chatId, t.openApp, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '📱 App / Приложение', web_app: { url: 'https://ваш_url_приложения' } }]
      ]
    }
  });
});

// Команда для получения списка задач
bot.onText(/\/tasks/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  
  if (!users[userId]) {
    initUser(userId, chatId, msg.from.first_name);
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  const pendingTasks = (users[userId].tasks || []).filter(task => task.status === 'pending');
  
  if (pendingTasks.length === 0) {
    bot.sendMessage(chatId, t.noTasks);
    return;
  }
  
  let message = t.taskSummary.replace('%d', pendingTasks.length) + '\n\n';
  
  pendingTasks.forEach((task, index) => {
    message += `${index + 1}. ${task.title}\n`;
  });
  
  // Отправка списка задач с интерактивными кнопками
  pendingTasks.forEach((task) => {
    bot.sendMessage(chatId, `${task.title}${task.description ? '\n' + task.description : ''}`, {
      reply_markup: {
        inline_keyboard: [
          [{ 
            text: t.markComplete, 
            callback_data: JSON.stringify({ 
              type: 'complete_task', 
              id: task.id 
            })
          }]
        ]
      }
    });
  });
});

// Команда для получения событий на сегодня
bot.onText(/\/events/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  
  if (!users[userId]) {
    initUser(userId, chatId, msg.from.first_name);
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayEvents = (users[userId].events || []).filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= today && eventDate < tomorrow;
  });
  
  if (todayEvents.length === 0) {
    bot.sendMessage(chatId, t.noEvents);
    return;
  }
  
  let message = t.eventSummary.replace('%d', todayEvents.length) + '\n\n';
  
  todayEvents.forEach((event, index) => {
    const time = new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    message += `${index + 1}. ${time} - ${event.title}${event.location ? ' (' + event.location + ')' : ''}\n`;
  });
  
  bot.sendMessage(chatId, message);
});

// Команда для получения списка привычек
bot.onText(/\/habits/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  
  if (!users[userId]) {
    initUser(userId, chatId, msg.from.first_name);
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  const habits = users[userId].habits || [];
  
  if (habits.length === 0) {
    bot.sendMessage(chatId, t.noHabits);
    return;
  }
  
  let message = t.habitSummary.replace('%d', habits.length) + '\n\n';
  
  habits.forEach((habit, index) => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habit.completions.some(c => c.date === today && c.completed);
    const statusEmoji = completedToday ? '✅' : '⬜️';
    
    message += `${index + 1}. ${statusEmoji} ${habit.name} (${habit.streak} ${t.completed})\n`;
  });
  
  bot.sendMessage(chatId, message);
});

// Команда для получения статистики
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  
  if (!users[userId]) {
    initUser(userId, chatId, msg.from.first_name);
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  // Подсчет статистики задач
  const tasks = users[userId].tasks || [];
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // Поиск самой длинной серии привычек
  const habits = users[userId].habits || [];
  let maxStreak = 0;
  habits.forEach(habit => {
    if (habit.streak > maxStreak) {
      maxStreak = habit.streak;
    }
  });
  
  // Подсчет количества событий
  const events = users[userId].events || [];
  
  let message = `${t.statsTitle}\n\n`;
  message += t.tasksCompleted.replace('%d', completedTasks).replace('%d', totalTasks).replace('%d', completionRate) + '\n';
  message += t.habitStreak.replace('%d', maxStreak) + '\n';
  message += t.eventStats.replace('%d', events.length) + '\n';
  
  bot.sendMessage(chatId, message);
});

// Команда для настройки уведомлений
bot.onText(/\/settings/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  
  if (!users[userId]) {
    initUser(userId, chatId, msg.from.first_name);
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  const settings = users[userId].settings;
  
  let message = `${t.settings}\n\n`;
  message += settings.morningNotification ? t.morningOn : t.morningOff;
  message += '\n';
  message += settings.eveningNotification ? t.eveningOn : t.eveningOff;
  message += '\n';
  message += settings.reminderNotification ? t.reminderOn : t.reminderOff;
  
  bot.sendMessage(chatId, message, {
    reply_markup: {
      inline_keyboard: [
        [{ 
          text: t.toggleMorning, 
          callback_data: JSON.stringify({ type: 'toggle_morning' })
        }],
        [{ 
          text: t.toggleEvening, 
          callback_data: JSON.stringify({ type: 'toggle_evening' })
        }],
        [{ 
          text: t.toggleReminder, 
          callback_data: JSON.stringify({ type: 'toggle_reminder' })
        }],
        [{ 
          text: t.language, 
          callback_data: JSON.stringify({ type: 'change_language' })
        }]
      ]
    }
  });
});

// Команда для получения справки
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id.toString();
  
  if (!users[userId]) {
    initUser(userId, chatId, msg.from.first_name);
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  let message = `${t.commandList}\n\n`;
  message += `${t.tasksCommand}\n`;
  message += `${t.eventsCommand}\n`;
  message += `${t.habitsCommand}\n`;
  message += `${t.statsCommand}\n`;
  message += `${t.settingsCommand}\n`;
  message += `${t.helpCommand}\n`;
  
  bot.sendMessage(chatId, message);
});

// Обработка callback-запросов от интерактивных кнопок
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id.toString();
  const data = JSON.parse(callbackQuery.data);
  
  if (!users[userId]) {
    initUser(userId, chatId, callbackQuery.from.first_name);
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  switch (data.type) {
    case 'complete_task':
      // Отметить задачу выполненной
      const taskIndex = users[userId].tasks.findIndex(task => task.id === data.id);
      if (taskIndex !== -1) {
        users[userId].tasks[taskIndex].status = 'completed';
        users[userId].tasks[taskIndex].updatedAt = new Date();
        saveUsers();
        
        // Обновляем сообщение, чтобы убрать кнопку и изменить текст
        bot.editMessageText(
          `✅ ${users[userId].tasks[taskIndex].title}`,
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
              inline_keyboard: [
                [{ 
                  text: t.markIncomplete, 
                  callback_data: JSON.stringify({ 
                    type: 'incomplete_task', 
                    id: data.id 
                  })
                }]
              ]
            }
          }
        );
        
        bot.answerCallbackQuery(callbackQuery.id, { 
          text: t.taskMarkedComplete.replace('%s', users[userId].tasks[taskIndex].title.substring(0, 20))
        });
      }
      break;
      
    case 'incomplete_task':
      // Отметить задачу невыполненной
      const incompleteTaskIndex = users[userId].tasks.findIndex(task => task.id === data.id);
      if (incompleteTaskIndex !== -1) {
        users[userId].tasks[incompleteTaskIndex].status = 'pending';
        users[userId].tasks[incompleteTaskIndex].updatedAt = new Date();
        saveUsers();
        
        // Обновляем сообщение, меняем кнопку
        bot.editMessageText(
          `${users[userId].tasks[incompleteTaskIndex].title}`,
          {
            chat_id: chatId,
            message_id: callbackQuery.message.message_id,
            reply_markup: {
              inline_keyboard: [
                [{ 
                  text: t.markComplete, 
                  callback_data: JSON.stringify({ 
                    type: 'complete_task', 
                    id: data.id 
                  })
                }]
              ]
            }
          }
        );
        
        bot.answerCallbackQuery(callbackQuery.id, { 
          text: t.taskMarkedIncomplete.replace('%s', users[userId].tasks[incompleteTaskIndex].title.substring(0, 20))
        });
      }
      break;
      
    case 'toggle_morning':
      // Переключить утреннее напоминание
      users[userId].settings.morningNotification = !users[userId].settings.morningNotification;
      saveUsers();
      updateSettingsMessage(chatId, callbackQuery.message.message_id, userId);
      bot.answerCallbackQuery(callbackQuery.id);
      break;
      
    case 'toggle_evening':
      // Переключить вечернее напоминание
      users[userId].settings.eveningNotification = !users[userId].settings.eveningNotification;
      saveUsers();
      updateSettingsMessage(chatId, callbackQuery.message.message_id, userId);
      bot.answerCallbackQuery(callbackQuery.id);
      break;
      
    case 'toggle_reminder':
      // Переключить напоминания о событиях
      users[userId].settings.reminderNotification = !users[userId].settings.reminderNotification;
      saveUsers();
      updateSettingsMessage(chatId, callbackQuery.message.message_id, userId);
      bot.answerCallbackQuery(callbackQuery.id);
      break;
      
    case 'change_language':
      // Показать меню выбора языка
      bot.editMessageReplyMarkup({
        inline_keyboard: [
          [{ 
            text: '🇷🇺 Русский', 
            callback_data: JSON.stringify({ type: 'set_language', lang: 'ru' })
          }],
          [{ 
            text: '🇬🇧 English', 
            callback_data: JSON.stringify({ type: 'set_language', lang: 'en' })
          }],
          [{ 
            text: '🇨🇳 中文', 
            callback_data: JSON.stringify({ type: 'set_language', lang: 'zh' })
          }]
        ]
      }, {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id
      });
      bot.answerCallbackQuery(callbackQuery.id);
      break;
      
    case 'set_language':
      // Установить выбранный язык
      users[userId].language = data.lang;
      saveUsers();
      
      const newLang = locales[data.lang];
      bot.sendMessage(chatId, newLang.languageChanged);
      
      // Обновить сообщение с настройками на новом языке
      updateSettingsMessage(chatId, callbackQuery.message.message_id, userId);
      bot.answerCallbackQuery(callbackQuery.id);
      break;
  }
});

// Функция для обновления сообщения с настройками
function updateSettingsMessage(chatId, messageId, userId) {
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  const settings = users[userId].settings;
  
  let message = `${t.settings}\n\n`;
  message += settings.morningNotification ? t.morningOn : t.morningOff;
  message += '\n';
  message += settings.eveningNotification ? t.eveningOn : t.eveningOff;
  message += '\n';
  message += settings.reminderNotification ? t.reminderOn : t.reminderOff;
  
  bot.editMessageText(message, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: {
      inline_keyboard: [
        [{ 
          text: t.toggleMorning, 
          callback_data: JSON.stringify({ type: 'toggle_morning' })
        }],
        [{ 
          text: t.toggleEvening, 
          callback_data: JSON.stringify({ type: 'toggle_evening' })
        }],
        [{ 
          text: t.toggleReminder, 
          callback_data: JSON.stringify({ type: 'toggle_reminder' })
        }],
        [{ 
          text: t.language, 
          callback_data: JSON.stringify({ type: 'change_language' })
        }]
      ]
    }
  });
}

// Инициализация пользователя
function initUser(userId, chatId, firstName) {
  users[userId] = {
    chatId: chatId,
    firstName: firstName,
    tasks: [],
    events: [],
    habits: [],
    settings: {
      morningNotification: true,
      eveningNotification: true,
      reminderNotification: true
    },
    language: 'ru'
  };
  saveUsers();
}

// Обработка данных от мини-приложения
app.post('/webhook', (req, res) => {
  const { userId, type, data } = req.body;
  
  if (!userId || !type || !data) {
    return res.status(400).json({ success: false, error: 'Неверные данные' });
  }
  
  // Проверяем существование пользователя
  if (!users[userId]) {
    users[userId] = {
      chatId: userId,
      tasks: [],
      events: [],
      habits: [],
      settings: {
        morningNotification: true,
        eveningNotification: true,
        reminderNotification: true
      },
      language: 'ru'
    };
  }
  
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  // Обрабатываем разные типы данных
  switch (type) {
    case 'task':
      // Добавление новой задачи
      users[userId].tasks.push(data);
      break;
    case 'task_status_change':
      // Изменение статуса задачи
      const taskIndex = users[userId].tasks.findIndex(task => task.id === data.task.id);
      if (taskIndex !== -1) {
        users[userId].tasks[taskIndex].status = data.task.status;
        users[userId].tasks[taskIndex].updatedAt = new Date();
      }
      break;
    case 'event':
      // Добавление нового события
      users[userId].events.push(data);
      // Если нужно напоминание, планируем его
      if (data.reminder !== 'none' && users[userId].settings.reminderNotification) {
        scheduleReminder(userId, data);
      }
      break;
    case 'habit':
      // Добавление новой привычки
      users[userId].habits.push(data);
      break;
    case 'habit_completion':
      // Отметка о выполнении привычки
      const habitIndex = users[userId].habits.findIndex(habit => habit.id === data.habit.id);
      if (habitIndex !== -1) {
        const today = new Date().toISOString().split('T')[0];
        const existingCompletionIndex = users[userId].habits[habitIndex].completions.findIndex(c => c.date === today);
        
        if (existingCompletionIndex >= 0) {
          users[userId].habits[habitIndex].completions[existingCompletionIndex].completed = data.completed;
        } else {
          users[userId].habits[habitIndex].completions.push({ date: today, completed: data.completed });
        }
        
        if (data.completed) {
          users[userId].habits[habitIndex].streak += 1;
        } else {
          users[userId].habits[habitIndex].streak = 0;
        }
      }
      break;
    case 'notification_settings':
      // Обновление настроек уведомлений
      users[userId].settings = data.settings;
      break;
    case 'language_change':
      // Изменение языка
      users[userId].language = data.language;
      break;
    default:
      return res.status(400).json({ success: false, error: 'Неизвестный тип данных' });
  }
  
  // Сохраняем обновленные данные
  saveUsers();
  
  // Отправляем подтверждение
  if (type !== 'task_status_change' && type !== 'habit_completion') {
    bot.sendMessage(users[userId].chatId, `${t.openApp}`);
  }
  
  return res.json({ success: true });
});

// Функция для планирования напоминаний
function scheduleReminder(userId, event) {
  if (!users[userId].settings.reminderNotification) return;
  
  let reminderDate = new Date(event.startTime);
  const lang = users[userId].language || 'ru';
  const t = locales[lang];
  
  // Рассчитываем время напоминания в зависимости от настройки
  switch (event.reminder) {
    case '15min':
      reminderDate.setMinutes(reminderDate.getMinutes() - 15);
      break;
    case '1hour':
      reminderDate.setHours(reminderDate.getHours() - 1);
      break;
    case '1day':
      reminderDate.setDate(reminderDate.getDate() - 1);
      break;
  }
  
  // Если дата напоминания уже прошла, не планируем
  if (reminderDate <= new Date()) return;
  
  // Планируем напоминание
  schedule.scheduleJob(reminderDate, function() {
    const currentLang = users[userId].language || 'ru';
    const currentT = locales[currentLang];
    
    const time = new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const message = `${currentT.reminderStart} "${event.title}" ${time}`;
    
    bot.sendMessage(users[userId].chatId, message);
  });
}

// Настройка утренних уведомлений (каждый день в 7:00)
schedule.scheduleJob('0 7 * * *', function() {
  for (const userId in users) {
    if (users[userId].settings.morningNotification) {
      sendMorningNotification(userId);
    }
  }
});

// Настройка вечерних уведомлений (каждый день в 21:00)
schedule.scheduleJob('0 21 * * *', function() {
  for (const userId in users) {
    if (users[userId].settings.eveningNotification) {
      sendEveningNotification(userId);
    }
  }
});

// Функция для отправки утреннего уведомления
function sendMorningNotification(userId) {
  const user = users[userId];
  const lang = user.language || 'ru';
  const t = locales[lang];
  
  // Получаем сегодняшние события
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todayEvents = user.events.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= today && eventDate < tomorrow;
  });
  
  // Получаем активные задачи
  const pendingTasks = user.tasks.filter(task => task.status === 'pending');
  
  // Формируем сообщение
  let message = `🌞 ${t.greeting.replace('%s', user.firstName || 'друг')}!\n\n`;
  
  if (todayEvents.length > 0) {
    message += `${t.eventSummary.replace('%d', todayEvents.length)}\n`;
    todayEvents.forEach((event, index) => {
      const time = new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      message += `${index + 1}. ${time} - ${event.title}\n`;
    });
    message += '\n';
  } else {
    message += `${t.noEvents}\n\n`;
  }
  
  if (pendingTasks.length > 0) {
    message += `${t.taskSummary.replace('%d', pendingTasks.length)}\n`;
    pendingTasks.slice(0, 5).forEach((task, index) => {
      message += `${index + 1}. ${task.title}\n`;
    });
    
    if (pendingTasks.length > 5) {
      message += `... ${t.tasks} ${pendingTasks.length - 5}\n`;
    }
  } else {
    message += `${t.noTasks}\n`;
  }
  
  // Отправляем сообщение
  bot.sendMessage(user.chatId, message);
}

// Функция для отправки вечернего уведомления
function sendEveningNotification(userId) {
  const user = users[userId];
  const lang = user.language || 'ru';
  const t = locales[lang];
  
  // Получаем завтрашние события
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
  
  const tomorrowEvents = user.events.filter(event => {
    const eventDate = new Date(event.startTime);
    return eventDate >= tomorrow && eventDate < dayAfterTomorrow;
  });
  
  // Формируем сообщение
  let message = `🌙 ${t.greeting.replace('%s', user.firstName || 'друг')}!\n\n`;
  
  if (tomorrowEvents.length > 0) {
    message += `${t.tomorrowEvents.replace('%d', tomorrowEvents.length)}\n`;
    tomorrowEvents.forEach((event, index) => {
      const time = new Date(event.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      message += `${index + 1}. ${time} - ${event.title}\n`;
    });
  } else {
    message += `${t.noTomorrowEvents}\n`;
  }
  
  // Добавляем напоминание о планировании
  message += `\n${t.planTomorrow}`;
  
  // Отправляем сообщение
  bot.sendMessage(user.chatId, message);
}

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.log('Ошибка бота:', error);
});
