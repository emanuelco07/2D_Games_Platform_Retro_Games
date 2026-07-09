# 📘 **README.md — Retro Games**

## 🎮 Retro Games — A Modern Platform for Classic 2D Retro Games

**Retro Games** is a modern web platform that brings back the charm of classic 2D retro games such as **Snake**, **Tetris**, **Brick Breaker**, **Goal Scorer**, and **Super Bricks**.  
The project blends nostalgia with current technologies, offering a clean interface, competitive leaderboards, user accounts, chat functionality, and detailed “About the Game” pages.

> *“Retro Games demonstrates that classic games can be integrated into a modern, accessible, and attractive platform, preserving the retro spirit while using current technologies.”*  
> — *Licență Retro Games, p.29*

---

## 📸 Application Preview (GIF Placeholder)

👉 **Insert your main application GIF here**  
`![Retro Games Preview](main/Prezentarea%20aplicatiei.gif)`  

---

## 🚀 Features

- Six fully implemented 2D retro games  
- User authentication & registration  
- Global leaderboards for each game  
- Real-time chat between players  
- Bug reporting page  
- Responsive UI  
- “About the Game” pages with rules, history, and controls  
- Clean, minimalist interface  

---

## 🛠️ Technologies Used

### **Frontend — Angular**
Angular was chosen for its component-based architecture, reactive programming model, and ability to build scalable single-page applications.  
It provides:
- Fast rendering  
- Modular structure  
- Easy routing between games  
- Strong TypeScript support  

### **Backend — C# (.NET)**
C# powers the server-side logic, handling:
- User authentication  
- Score saving  
- Leaderboard generation  
- Chat message storage  
- Bug reporting  

> *“Validarea datelor la înregistrare, criptarea parolei și expirarea tokenului după 2 ore.”*  
> — *Licență Retro Games, p.25*

### **Database — MySQL**
MySQL stores:
- Users  
- Game scores  
- Chat messages  
- Bug reports  

The UML diagram includes entities such as **User**, **Game**, **UserGameScore**, **Chat**, and **Bug**.

### **Bootstrap**
Used for responsive UI and clean layout:
- Buttons  
- Cards  
- Navigation  
- Game pages  

### **Development Tools**
- **JetBrains Rider** — backend development  
- **Visual Studio Code** — Angular frontend  

---

## 🎮 Games Included

### 🐍 **Snake (1977)**
- 4 modes: Easy, Medium, Hard, No Wall  
- Points per apple: 1 / 2 / 3 / 1  
- Collision detection with walls and self  
- Smooth direction change logic  
- Classic Nokia-inspired gameplay  

> *“You lose when you hit yourself or when you hit the wall.”*  
> — *Licență Retro Games, p.23*

---

### 🧱 **Tetris (1988)**
- 10+ levels  
- Increasing fall speed  
- Scoring based on lines cleared  
- Hard Drop (+2 points per cell)  
- Piece rotation logic including special handling for I-piece  

> *“The score increases depending on the number of lines cleared and the level.”*  
> — *Licență Retro Games, p.15*

---

### 🔨 **Brick Breaker 1 & 2 (1999)**
- 4 modes: Easy, Medium, Hard, Heart Mode  
- 4 lives  
- Paddle + ball physics  
- Ball passes through paddle  
- Points based on bricks destroyed and ball speed  

---

### ⚽ **Goal Scorer**
- Objective: score goals  
- 4 lives  
- 7 levels  
- +10 points per goal  
- Level increases based on total points  

---

### ☄️ **Super Bricks**
- Destroy falling asteroid rows  
- Points vary by level (100 → 999)  
- Faster descent at higher levels  
- Life lost when empty rows appear  

---

## 🎞️ Tetris Gameplay Preview (GIF Placeholder)

👉 **Insert your Tetris GIF here**  
`![Tetris Gameplay](Prezentare%20Tetris.gif)`  

---

## 📄 Documentation (PDF)

👉 **Insert your PDF link here**  
`[Full Documentation (PDF)](Cosereanu_Emanuel_licenta.pdf)`  

---

## 🧩 System Architecture

### UML Overview  
The platform includes the following entities:

- **User** — authentication, email, registration date  
- **Game** — game metadata  
- **UserGameScore** — score per game  
- **Chat** — messages + timestamps  
- **Bug** — bug reports  

> *“Structura principală a claselor și relațiile dintre entități.”*  
> — *Licență Retro Games, p.11*

---

## 🧪 Challenges & Solutions

- Collision detection (Snake, Brick Breaker, Goal Scorer)  
- Difficulty scaling  
- Real-time chat refresh  
- Responsive layout  
- Token expiration & password hashing  

---

## 📈 Results

- Six fully functional retro games  
- Competitive leaderboards  
- Community chat  
- Bug reporting system  
- Clean and intuitive UI  
- Educational “About the Game” pages  

---

## 🔮 Future Improvements

- Add new games (Pac-Man, Flappy Bird)  
- Auto-refresh chat + auto-scroll  
- Code refactoring for cleaner logic  
- Grouping difficulty levels into a single component  
- Password change option  
- Add game-specific background music  
