import json
from pathlib import Path


# Function to merge JSON files

original = []
fake = []
def merge_json_files(file_list, output_file):
    merged_data = []

    for file in file_list:
        # Open and read each JSON file
        with open(file, 'r') as f:
            data = json.load(f)
            print(data)
            # for i in data:
            #     if i['original'] not in original:
            #         original.append(i['original'])
            #     else:
            #         print('found duplicate original')
            #         print(i, file)
            #     for j in i['fakes']:
            #         if j not in fake:
            #             fake.append(j)
            #         else:
            #             print('Duplicate fake')
            #             print(i, j, file)

            # Merge current data into the merged_data dictionary
            merged_data = merged_data + data

    print('merged_data')
    print(merged_data)
    # Write the merged data to the output file
    with open(output_file, 'w') as f:
        json.dump(merged_data, f, indent=4)


# List of JSON files to merge
json_files = ['final_dataset/selected_videos_new_format_46.json', 'final_dataset/selected_videos_new_format_47.json',
              'final_dataset/selected_videos_new_format_48.json', 'final_dataset/selected_videos_new_format_49.json']

# Output file name
output_file = 'merged_output_selected_videos_new_format.json'

# Merge the JSON files
merge_json_files(json_files, output_file)

print(f'Merged JSON saved to {output_file}')
