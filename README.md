# Setup Guide for Mac and Windows

## On Windows

### I. To Run `everything.ipynb` (DDL, DML, DQL)

1. Install Python from the official site if not already installed:  
   > [https://www.python.org/downloads/windows/](https://www.python.org/downloads/windows/)

   > Find Python 3.13.5, under that download the one that match your window system

2. In our git folder, create venv environment by running commands below:

   ```bash
   python -m venv .venv
   .venv\Scripts\activate
   python -m pip install faker ipykernel mysql-connector-python schedule
   ```

3. Run `everything.ipynb` or `everythingLocal.ipynb` if you want to create the `pos_management_db` locally.

4.  When executing code blocks, select the Python interpreter from `.venv`.

---

### II. To Run the Web App

1. Navigate and run:

   ```bash
   cd web
   npm install
   npm run dev
   ```

2. Open [http://localhost:5001](http://localhost:5001) in your browser.

---

### III. To Run Backup and Recovery Inside backup_recovery.ipynb

1. Download MySQL for Windows here:  
   > [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)  

   > Choose this one - Windows (x86, 64-bit), ZIP Archive  (You can download this even if you already have MySQL installed)

2. Extract the ZIP archive anywhere you prefer.

3. Inside the extracted folder, navigate to the `bin` directory — you'll find `.exe` files.

#### To Run Backup

4. Locate `mysqldump.exe` and copy its full path, e.g.:

   ```
   C:\\path\\to\\mysql\\bin\\mysqldump.exe
   ```

5. Replace this code in `backup_recovery.ipynb`:

   ```python
   command = [
       "mysqldump",  # <-- Change This Command If on Windows
   ]
   ```

   with:

   ```python
   command = [
       "C:\\path\\to\\mysql\\bin\\mysqldump.exe",  # <-- Change This Command If on Windows
   ]
   ```

#### To Run Recovery

6. Locate `mysql.exe` and copy its full path, e.g.:

   ```
   C:\\path\\to\\mysql\\bin\\mysql.exe
   ```

7. Replace this code:

   ```python
   command = [
       "mysql",  # <-- Change This Command If on Windows
   ]
   ```

   with:

   ```python
   command = [
       "C:\\path\\to\\mysql\\bin\\mysql.exe",  # <-- Change This Command If on Windows
   ]
   ```

## On Mac

### I. To Run `everything.ipynb` (DDL, DML, DQL)

1. Ensure you have Python 3 installed. If not, install it with:

   ```bash
   brew install python3
   ```

2. Set up the virtual environment using:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   python3 -m pip install faker ipykernel mysql-connector-python schedule
   ```

3. Now, you can run `everything.ipynb` or `everythingLocal.ipynb` to create the `pos_database` on your local MySQL server.

4. When running each code block, ensure the kernel is set to the Python interpreter from the `.venv` environment.

---

### II. To Run the Web App

1. Use the following commands:

   ```bash
   cd web
   npm install
   npm run dev
   ```

2. Open [http://localhost:5001](http://localhost:5001) in your browser.

---

### III. To Run Backup and Recovery Inside backup_recovery.ipynb

1. Make sure MySQL is installed:

   ```bash
   brew install mysql
   ```

2. Then run the `backup_recovery.ipynb` file using the Python environment you set up above.

---
