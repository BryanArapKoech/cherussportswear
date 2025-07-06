# RECOVERY.md

This document outlines the procedure for restoring the `ecommerce_admin_db` from a backup file.

## Prerequisites

1.  A valid, compressed backup file (e.g., `ecommerce_admin_db-YYYY-MM-DD_HH-MM-SS.sql.gz`).
2.  The `psql` and `gunzip` command-line tools must be installed and available in your system's PATH.
3.  The target PostgreSQL server must be running.

## Recovery Steps

1.  **Stop the Application:** Ensure the Node.js API server is stopped to prevent any new connections or data modifications during the restore process.

    ```bash
    # (In the API server terminal)
    Ctrl+C
    ```

2.  **Decompress the Backup File:** Use `gunzip` to decompress the backup file.

    ```bash
    gunzip < path/to/your/backup.sql.gz > restore.sql
    ```

    _Replace `path/to/your/backup.sql.gz` with the actual path to your backup file._

3.  **Drop the Existing Database (Optional but Recommended):** To ensure a clean restore, it's best to drop the existing database.

    ```bash
    dropdb -U your_username ecommerce_admin_db
    ```

4.  **Create a New, Empty Database:**

    ```bash
    createdb -U your_username ecommerce_admin_db
    ```

5.  **Restore the Database from the SQL File:** Use `psql` to execute the decompressed SQL file against the new, empty database.

    ```bash
    psql -U your_username -d ecommerce_admin_db -f restore.sql
    ```

    _Replace `your_username` with your PostgreSQL username (e.g., `postgres`)._

6.  **Verification:**

    - Connect to the database: `psql -U your_username -d ecommerce_admin_db`
    - List the tables: `\dt`
    - Verify that all tables (`admins`, `products`, `orders`, etc.) exist and contain data.

7.  **Restart the Application:** Once the database is verified, you can restart the Node.js API server.
