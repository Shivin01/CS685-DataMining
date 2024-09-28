import json
import os
import shutil


def identify_fake_videos(json_file):
    # Read the JSON data from the file
    print(f'JSON FIle  ={json_file}')
    with open(json_file, 'r') as file:
        data = json.load(file)

    print(data)

    # Create a dictionary to store original videos and their fakes
    original_to_fakes = {}

    # Iterate through the data to find fake videos and their originals
    for video, info in data.items():
        if info['label'] == 'FAKE':
            original = info['original']
            if original not in original_to_fakes:
                original_to_fakes[original] = []
            original_to_fakes[original].append(video)

    # Create the result list
    result = []
    for original, fakes in original_to_fakes.items():
        # Only add to result if there are at least two fake videos
        if len(fakes) >= 2:
            selected_fakes = fakes[:2]  # Select up to two fake videos
            result.append([original] + selected_fakes)

    return result


def create_directory_and_move_files(result, source_directory, target_directory):
    # Create the target directory if it does not exist
    if not os.path.exists(target_directory):
        os.makedirs(target_directory)

    # Move the selected files to the target directory
    for group in result:
        for video in group:
            source_path = os.path.join(source_directory, video)
            target_path = os.path.join(target_directory, video)
            if os.path.exists(source_path):
                print(f"Moving {source_path} to {target_path}")
                shutil.move(source_path, target_path)
            else:
                print(f"Warning: {source_path} does not exist and cannot be moved.")


def main():
    # Define the JSON file path
    json_file = "./dfdc_train_part_0/metadata.json"
    source_directory = "./dfdc_train_part_0"
    target_directory = "./selected_videos"

    print('Inside')

    try:
        # Run the function and get the result
        result = identify_fake_videos(json_file)
        print(result)
        # Print the result
        for group in result:
            print(group)

        # Create directory and move files
        create_directory_and_move_files(result, source_directory, target_directory)
    except FileNotFoundError:
        print(f"Error: The file '{json_file}' was not found.")
    except json.JSONDecodeError:
        print(f"Error: The file '{json_file}' is not a valid JSON file.")
    except Exception as e:
        print(f"An unexpected error occurred: {str(e)}")


if __name__ == "__main__":
    main()