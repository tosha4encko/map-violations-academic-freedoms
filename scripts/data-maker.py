import csv
import json
import os
print("Текущая рабочая директория:", os.getcwd())
# Создаем пустой список для хранения данных из CSV
# data = []
#
# with open("../scripts/regions.json", "r") as regions_file:
#     regions = json.load(regions_file)
#
#     with open("../scripts/region-to-location.json") as to_locations_file:
#         to_locations = json.load(to_locations_file)
#
#         r_to_locations = to_locations.values()
#         for rr in r_to_locations:
#             if rr not in regions:
#                 print(rr)

# # Список файлов CSV, которые нужно объединить
# csv_files = ["../scripts/table1.csv", "../scripts/table2.csv", "../scripts/table3.csv"]
#
# # Читаем данные из каждого файла CSV и добавляем их в список data
# for csv_file in csv_files:
#     with open(csv_file, "r", newline="") as file:
#         reader = csv.DictReader(file)
#         for row in reader:
#             if row['где'] != '':
#                 data.append(row)
#
# citys = set(map(lambda d: d['где'], data))
# print("Данные успешно объединены в файл output.json")

regions_map_f = open('../scripts/region-to-location.json', 'r')
violations_f = open('../scripts/output.json', 'r')

regions_map = json.load(regions_map_f)
violations = json.load(violations_f)

res = {}

for violation in violations:
    region = regions_map.get(violation["где"].strip())
    if res.get(region) is None:
        res[region] = []

    res[region].append({
        "date": violation['дата'],
        "where":  violation['где'],
        "type": violation['что'],
        "description": violation['пояснение'],
        "source": violation['источник'],
        "region": region,
    })

json.dump(res, open('../scripts/all-violations.json', 'w', encoding='utf8'), ensure_ascii=False)