import json


# Overwrites files for simplification
def push(_dict, file_path):
    if type(_dict) is dict:
        try:
            serialized = json.dumps(_dict)
            with open(file_path, "w") as file:
                file.write(serialized)
            return _dict
        except IOError:
            return False
    else:
        return None


def pull(file_path):
    with open(file_path, "r") as file:
        serialized = file.read()
    try:
        deserialized = json.loads(serialized)
        return deserialized
    except json.JSONDecodeError:
        return None
