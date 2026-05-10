# ✈️ Traveloop – Personalized Travel Planning Made Easy

> A user-centric, responsive travel planning application that simplifies multi-city trip planning with budget tracking, itinerary building, and collaborative features.

---

## 📌 Problem Statement

**Odoo Hackathon 2026**

Design and develop a complete travel planning application where users can create customized multi-city itineraries, assign travel dates, activities, and budgets, discover activities and destinations through search, receive cost breakdowns and share their plans.

---

## 💡 Our Solution

Traveloop is an end-to-end travel planning platform that empowers users to dream, design, and organize trips with ease. Users can plan multi-city trips, track budgets, manage packing lists, and take trip notes — all in one place.

---

## ✨ Features

### Core Features
- ✅ User Authentication (Login / Signup with validation)
- ✅ Dashboard with recent trips & popular destinations
- ✅ Create & manage multi-city trips
- ✅ Itinerary Builder with stops & activities
- ✅ Budget & Cost Breakdown (by category & city)
- ✅ City Search with filters (cost, popularity)
- ✅ Packing Checklist with progress tracker
- ✅ Trip Notes & Journal
- ✅ User Profile & Settings
- ✅ Admin Dashboard with analytics

### Technical Highlights
- ✅ Real-time data with Supabase
- ✅ Relational Database (PostgreSQL)
- ✅ Input Validation throughout
- ✅ Responsive UI
- ✅ Version Control (GitHub)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Real-time | Supabase Realtime |
| Version Control | GitHub |

---

## 🗄️ Database Schema

users → trips → stops → activities
↘ notes

**Tables:** users, trips, stops, activities, notes

---

<img width="545" height="500" alt="Screenshot 2026-05-10 171034" src="https://github.com/user-attachments/assets/e9adbfb7-0257-4857-a3cd-3cc5c3ac907d" />

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- Supabase account

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/shaktipy/Traveloop-GlitchSlayer.git

# 2. Navigate to project
cd traveloop

# 3. Install dependencies
npm install

# 4. Set up environment
# Create supabaseClient.js with your credentials

# 5. Run the project
npm start
```

---

## 🔑 Supabase Setup

Create `src/supabaseClient.js`:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

## 👥 Team – GlitchSlayer

| Name | Role | GitHub |
|---|---|---|
| Shakti Vardhan Singh | Team Leader • Full Stack Developer • Database Architect • Project Structure| [@shaktipy] |
| Nitesh Kumar Mehta | Full Stack Developer • Authorization • UI/UX Design | [@nitesh-cpu] |
| Aditya Kumar | Full Stack Developer • Real-time • UI/UX Design • API Integration | [@Addy296] |
| Navya Kumari | Backend Developer • Input Validation • Testing & QA | [@navyashah19] |

**Institution:** Parul University
**Team:** GlitchSlayer ⚡

---

## 🏆 Hackathon

**Event:** Odoo Hackathon 2026
**Round:** Virtual Round
**Submitted via:** [hackathon.odoo.com](https://hackathon.odoo.com)

---

## 📹 Demo

🎥 **Solution Video:** [Link](https://youtu.be/_zIwQxvS1mI?si=L-6SP1hD1EkkDQ_M)

## 📸 Screenshots

| Screen | Description |
|---|---|
| Login/Signup | User authentication with validation |

<img width="1860" height="888" alt="Screenshot 2026-05-10 153108" src="https://github.com/user-attachments/assets/91a12a9c-42a0-44fe-b2d2-e611e03c156a" />


| Dashboard | Trip overview & popular destinations |

<img width="1863" height="903" alt="Screenshot 2026-05-10 151326" src="https://github.com/user-attachments/assets/43820317-3425-4a2d-b0a6-972fef4db9f0" />


| Itinerary Builder | Multi-city trip planning with activities |

<img width="1896" height="907" alt="Screenshot 2026-05-10 153233" src="https://github.com/user-attachments/assets/ddca0d61-ddfc-4c80-837f-720f99a3507d" />


| Admin Dashboard | Platform analytics & management |

<img width="1881" height="909" alt="Screenshot 2026-05-10 153346" src="https://github.com/user-attachments/assets/2ed881d5-a519-4bf6-b36a-39e0738803b1" />

