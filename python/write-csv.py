import csv
import random

first_names = ('John', 'Andy', 'Joe', 'Locus', 'Nice', 'Hello', 'Me',
               'Ha', 'World', 'Morona', 'Miruke', 'Ymaki', 'Mel', 'Kina', 'Repu')
last_names = ('Johnson', 'Smith', 'Williams', 'Ali', 'Beatriz',
              'Charles', 'Diya', 'Eric', 'Fatima', 'Gabriel', 'Hanna')
role_names = ('Admin', 'User', 'Guest')


header = ['First Name', 'Last Name', 'Email', 'Role']

with open('countries.local.csv', 'w', encoding='UTF8') as f:
    writer = csv.writer(f)
    # write the header
    writer.writerow(header)
    for i in range(10_000):
        data = [random.choice(first_names) + " " + random.choice(last_names), random.choice(
            first_names) + " " + random.choice(last_names), 'example@example.com', random.choice(role_names)]
        # write the data
        writer.writerow(data)
