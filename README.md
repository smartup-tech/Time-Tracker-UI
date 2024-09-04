# Timetracker
Timetracker - сервис учета рабочего времени. Продукт предназначен для компаний, стремящихся наладить почасовую оплату и сделать прозрачным прогресс по решению задач.

&copy; Разработано [Smart Up](https://smartup.ru/ "Smartup")

### Репозитории
Timetracker - это клиент-серверное приложение с двумя репозиториями:
- [Timetracker-UI](https://github.com/smartup-tech/Time-Tracker-UI "Timetracker-UI")
- [Timetracker-BE](https://github.com/smartup-tech/Time-Tracker "Timetracker-BE")

### Преимущества
- Быстрое внедрение системы учета времени сотрудников в свой бизнес
- Беспрепятсвенное расширение продукта

### Функционал
- Учет отработаных часов
- Недельный отчет отработанного времени
- Подробный отчет по каждому сотруднику за рабочий период
- Персональный и проектный отчет
- Производственный календарь
***
# [Документация пользователя](./docs/main.md)

# Как использовать Timetracker UI

### Локальный запуск

1) Установите [node js 18](https://nodejs.org/en/download/current "node js 18")  для вашей операционной системы.
2) Перейдите в директорию timetracker-ui.
3) Установите зависимости проекта ``npm install && npm run prepare``
4) Запустите проект ``npm run dev``

### CI/CD
1) Откройте директорию ``./ops-tools``
2) Запустите скрипт ``./build-image.sh`` для сборки и публикации docker образа. Вы должны изменить имя репозитория, чтобы иметь возможность опубликовать изображение.
3) Запустите ``./run-image.sh`` для запуска подготовленного образа. Вы можете изменять переменные окружения как Вам необходимо.
