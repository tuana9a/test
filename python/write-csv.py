import csv
import random

fnames = ('John', 'Andy', 'Joe', 'Locus', 'Nice', 'Hello', 'Me',
          'Ha', 'World', 'Morona', 'Miruke', 'Ymaki', 'Mel', 'Kina', 'Repu')

lnames = ('Johnson', 'Smith', 'Williams', 'Ali', 'Beatriz',
          'Charles', 'Diya', 'Eric', 'Fatima', 'Gabriel', 'Hanna')

roles = ('Admin', 'User', 'Guest')


header = ['First Name', 'Last Name', 'Email', 'Role']
filepath = 'countries.local.csv'

with open(filepath, 'w', encoding='UTF8') as f:
    writer = csv.writer(f)
    # write the header
    writer.writerow(header)
    for i in range(10_000):
        data = [random.choice(fnames) + " " + random.choice(lnames), random.choice(
            fnames) + " " + random.choice(lnames), 'example@example.com', random.choice(roles)]
        # write the data
        writer.writerow(data)
