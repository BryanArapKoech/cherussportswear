#!/bin/bash
# backup.sh

# --- Configuration ---
DB_NAME="ecommerce_admin_db"
DB_USER="postgres"
DB_HOST="localhost"
BACKUP_DIR="./backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")
FILENAME="$BACKUP_DIR/$DB_NAME-$DATE.sql.gz"

# --- Script ---

# 1. Create the backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# 2. Inform the user
echo "Starting backup of database '$DB_NAME'..."

# 3. Run pg_dump. It will use the PGPASSWORD environment variable.
#    The output is piped to gzip for compression and saved to the file.
pg_dump -U "$DB_USER" -h "$DB_HOST" -d "$DB_NAME" | gzip > "$FILENAME"

# 4. Check if the backup was successful
if [ ${PIPESTATUS[0]} -eq 0 ]; then
  echo "Backup successful: $FILENAME"
else
  echo "Backup failed!"
  # remove the failed (and likely empty) backup file
  rm -f "$FILENAME"
fi