import csv
import json
import os
print("Текущая рабочая директория:", os.getcwd())
# Создаем пустой список для хранения данных из CSV

#
# with open("regions.json", "r") as regions_file:
#     regions = json.load(regions_file)
#
#     with open("region-to-location.json") as to_locations_file:
#         to_locations = json.load(to_locations_file)
#
#         r_to_locations = to_locations.values()
#         for rr in r_to_locations:
#             if rr not in regions:
#                 print(rr)

# Список файлов CSV, которые нужно объединить
# csv_files = ["table1.csv", "table2.csv"]
# data = []
# # Читаем данные из каждого файла CSV и добавляем их в список data
# for csv_file in csv_files:
#     with open(csv_file, "r", newline="") as file:
#         reader = csv.DictReader(file)
#         for row in reader:
#             if row['где'] != '':
#                 data.append(row)
#
# json.dump(data, open("output.json", "w", encoding='utf8'), ensure_ascii=False)
# print("Данные успешно объединены в файл output.json")

# citys = set(map(lambda d: d['где'], data))
regions_map_f = open('region-to-location.json', 'r')
violations_f = open('output.json', 'r')

regions_map = json.load(regions_map_f)
violations = json.load(violations_f)

res = {}

for violation in violations:
    region = regions_map.get(violation["где"].strip())
    if region is None:
        print(violation["где"])
    if res.get(region) is None:
        res[region] = []

    res[region].append({
        "date": violation['дата'].replace('/', '.'),
        "where":  violation['где'],
        "type": violation['что'],
        "description": violation['пояснение'],
        "source": violation['источник'],
        "region": region,
    })

json.dump(res, open('all-violations.json', 'w', encoding='utf8'), ensure_ascii=False)