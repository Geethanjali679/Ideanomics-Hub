# 🛡️ ShieldX: Android Malware Detection System

**Your Personal Security Guard for Android Apps**

Welcome to **ShieldX**! Think of this project as a high-tech security scanner for your smartphone. It is a professional web application designed to analyze Android apps and detect hidden malware (viruses, spyware, or dangerous code) before they can harm your device.

---

## 📖 What is this Project About? (Simple Explanation)

Every day, people download thousands of apps onto their phones. Unfortunately, some of these apps secretly contain dangerous code perfectly disguised to steal your passwords, access your photos, or damage your phone. 

**ShieldX is built to catch them.**

It provides a beautiful, easy-to-use digital dashboard where:
1. **You (the User)** can upload any Android app file (known as an APK).
2. **The System (ShieldX)** scans the app comprehensively, acting like an airport security scanner for software.
3. **The Result** is displayed instantly on your screen, letting you know with clear, visual alerts if the app is **Dangerous (Malware)** or **Safe to install**.

---

## 🛤️ Step-by-Step Flow of the Project

Here is the simple step-by-step journey of how someone uses ShieldX:

### 1. The Welcome Screen
- You open the website and land on the **Home Page**, a beautifully designed premium dashboard.
- You are greeted with a clear, easy-to-use "Upload" button.

### 2. Uploading the App
- You click the button and select the Android App file (APK file) from your computer that you want to test.
- Click "Scan".

### 3. The Digital Detective (Scanning Phase)
- Once uploaded, ShieldX's powerful "brain" (the backend) takes over in the background.
- It acts like a digital detective. It examines the app's permissions, code logic, and hidden features to identify suspicious malware patterns.

### 4. The Final Security Report
- Within moments, ShieldX generates a clean, non-technical visual report.
- The screen will vividly alert you with exactly whether the app is **Safe** or if it detected **Malware**.

---

## 🛠️ For Developers & Evaluators

*(This section is for anyone (like your professors) who wants to run the ShieldX system on their own computer)*

### How to Start the App on Your Computer:

**1. Open your Terminal (PowerShell) and go to the project folder:**
```powershell
cd C:\Users\bunny\OneDrive\Desktop\android_malware_detection
```

**2. Activate the Virtual Environment (The Python workspace):**
```powershell
.\venv\Scripts\activate
```

**3. Install Requirements** *(Only needed if this is your very first time running it)*:
```powershell
pip install -r requirements.txt
```

**4. Start the ShieldX Server:**
```powershell
python app.py
```

**5. Access the Website:**
Open any web browser (like Chrome or Edge) and type the following address into the top bar:
`http://127.0.0.1:5000`
