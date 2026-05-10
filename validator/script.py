import json
import os
import datetime
from typing import Dict, List, Set

"""
SyncBoard Data Validator & Analytics Tool
-----------------------------------------
A high-performance maintenance utility to validate Firebase Realtime Database
exports, audit board integrity, and generate usage metrics.
"""

# Global Stats
stats = {
    "total_boards": 0,
    "total_users": 0,
    "total_files": 0,
    "locked_boards": 0,
    "ephemeral_boards": 0,
    "active_boards": 0,  # Boards with 1+ users
}

# Current project data schema
ALLOWED_SUB_KEYS = {
    "text",
    "images",
    "lastUpdated",
    "users",
    "expirationTime",
    "passwordHash"
}

def print_header(title: str):
    print("\n" + "="*50)
    print(f" {title.center(48)} ")
    print("="*50)

def validate_syncboard_data(file_path: str) -> bool:
    global stats
    
    if not os.path.exists(file_path):
        print(f"\n[ERROR] File not found: {file_path}")
        return False

    try:
        with open(file_path, encoding='utf-8') as f:
            data = json.load(f)
    except Exception as e:
        print(f"\n[ERROR] Failed to parse JSON: {str(e)}")
        return False

    # Standard Firebase exports might have a root node like "rooms" or be flat
    # based on where the export was taken from. We handle both.
    rooms = data.get("rooms", data) if isinstance(data, dict) else {}
    
    if not isinstance(rooms, dict):
        print("\n[ERROR] Invalid database structure. Expected a dictionary of rooms.")
        return False

    print(f"\n[INFO] Starting validation for {len(rooms)} potential boards...")
    
    errors = []
    unique_users = set()

    for board_id, board_data in rooms.items():
        # 1. Validate Board ID (Must be 5 characters)
        if len(board_id) != 5:
            errors.append(f"Invalid ID length: '{board_id}' (Expected 5)")
            continue

        stats["total_boards"] += 1

        if not isinstance(board_data, dict):
            errors.append(f"Board '{board_id}' contains non-object data.")
            continue

        # 2. Key Validation
        actual_keys = set(board_data.keys())
        unexpected_keys = actual_keys - ALLOWED_SUB_KEYS
        if unexpected_keys:
            errors.append(f"Board '{board_id}' has unexpected keys: {unexpected_keys}")

        # 3. Presence Analytics
        users = board_data.get("users", {})
        if users:
            stats["active_boards"] += 1
            if isinstance(users, dict):
                for u_id in users.keys():
                    unique_users.add(u_id)

        # 4. Storage Analytics
        images = board_data.get("images", [])
        if isinstance(images, list):
            stats["total_files"] += len(images)

        # 5. Security & Expiration Analytics
        if board_data.get("passwordHash"):
            stats["locked_boards"] += 1
        
        if board_data.get("expirationTime"):
            stats["ephemeral_boards"] += 1

    stats["total_users"] = len(unique_users)

    if errors:
        print_header("VALIDATION ERRORS")
        for err in errors[:10]: # Limit output
            print(f"  [!] {err}")
        if len(errors) > 10:
            print(f"  ... and {len(errors)-10} more errors.")
        return False
    
    return True

def create_archive_structure():
    for folder in ['passed', 'failed']:
        os.makedirs(f'./validator/{folder}', exist_ok=True)

if __name__ == '__main__':
    create_archive_structure()
    
    target_file = "./validator/syncboard-default-rtdb-export.json"
    
    print_header("SYNCBOARD DATA VALIDATOR v2.0")
    
    success = validate_syncboard_data(target_file)
    
    if success:
        print_header("ANALYTICS SUMMARY")
        print(f"  Total Boards:     {stats['total_boards']}")
        print(f"  Active Users:     {stats['total_users']} (Unique IDs)")
        print(f"  Files Shared:     {stats['total_files']}")
        print(f"  Locked (PIN):     {stats['locked_boards']}")
        print(f"  Ephemeral:        {stats['ephemeral_boards']}")
        print(f"  Active Presence:  {stats['active_boards']} boards")
        print("-" * 50)
        print("  RESULT: SUCCESS (Data structure is healthy)")
    else:
        print_header("RESULT: VALIDATION FAILED")
        print("  Please check the error log above.")

    # File archival
    if os.path.exists(target_file):
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d_T_%H-%M-IST")
        status = "passed" if success else "failed"
        new_name = f"syncboard-export-{timestamp}.json"
        dest_path = f"./validator/{status}/{new_name}"
        
        os.rename(target_file, dest_path)
        print(f"\n[INFO] File archived to: {dest_path}")

    print("\n" + "="*50 + "\n")
