## Сборка

nodejs > 14

### web

1. npm i
2. IS_NOTION=false npm run build

### notion

1. npm i
2. IS_NOTION=false npm run build

Для хостинга будут нужны файлы index.js, violations.json и папка dist

## Редактирование данных

Данные по нарушениям находятся в файле violations.json.
Формат данны: 
```json
{
  "Имя региона, как на карте": [
    {
      "date" : "Дата инцедента в формате DD.MM.YYYY ",
      "description" : "Описание инцедента",
      "region" : "Имя региона, как на карте",
      "source" : "Источник",
      "type" : "Категория",
      "where" : "Город"
    },
    ...etc
  ],
  ...etc
}
```

Имена всех регионов можно увидеть в файле [regions.json](scripts%2Fregions.json). Важно, чтобы имя региона в violations.json совпадало с регионом из regions.json 

Чтобы изменить данные, достаточно внести изменения в файле violations.json, который находится на хостинге

