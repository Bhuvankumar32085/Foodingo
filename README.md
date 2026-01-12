# 🍔 Foodingo – Real-World Food Delivery Platform (MERN Stack)

🔗 **Live Demo:** https://foodingo-g39f.onrender.com/

Foodingo is a **real-world food delivery web application** built using the **MERN Stack**.  
The platform supports **Users, Restaurant Owners, and Delivery Partners** with real-time order handling, live tracking, and secure delivery workflows.

---

## 🚀 Tech Stack

### Frontend
- React.js
- Context API / Redux
- Socket.io Client
- Google Maps API (Live Tracking)

### Backend
- Node.js
- Express.js
- Socket.io
- JWT Authentication
- Google OAuth Authentication

### Database
- MongoDB (Mongoose)

### Other Tools
- RESTful APIs
- Online Payment Gateway
- Cash on Delivery (COD)

---

## 👥 User Roles

### 1️⃣ User (Customer)
- Browse restaurants and place food orders
- Payment options:
  - Cash on Delivery
  - Online Payment
- Track order status in real time:
  - Pending
  - Preparing
  - Out for Delivery
  - Delivered
- Live tracking of delivery partner
- Secure delivery using **OTP verification**

---

### 2️⃣ Restaurant Owner
- Manage restaurant items:
  - Add
  - Update
  - Delete
- Update order status:
  - Pending → Preparing → Out for Delivery
- Delivery charge rule:
  - Orders above ₹500 → ₹40 charged to restaurant owner

---

### 3️⃣ Delivery Partner
- Receives real-time notifications for orders within **5 km radius**
- First delivery partner to accept the order gets assigned
- Shares live location with the user
- Verifies delivery using OTP
- Delivery charge rule:
  - Orders below ₹500 → ₹40 charged to delivery partner

---

## 🔥 Key Features

- ✅ Role-based Authentication (User / Owner / Delivery Partner)
- ✅ Google OAuth Login
- ✅ Real-time Notifications using Socket.io
- ✅ Live Location Tracking with Google Maps API
- ✅ OTP-based Secure Delivery System
- ✅ Distance-based Order Assignment
- ✅ Cash on Delivery & Online Payment
- ✅ RESTful API Architecture
- ✅ Real-World Business Logic Implementation

---

## 📍 Real-Time Workflow (Socket.io)

- Order placed → nearby delivery partners get notifications
- First acceptance locks the order
- Live location updates are sent continuously
- OTP verification confirms successful delivery

---

## 🔐 Authentication & Security

- JWT-based Authentication
- Google OAuth Authentication
- Protected Routes
- Role-based Access Control (RBAC)

---

## 🗺️ Google Maps Integration

- Live delivery partner tracking
- Distance calculation (5 km radius logic)
- Real-time movement updates between user and delivery partner

---

## 📦 Project Type

> **Full-Stack Real-World Food Delivery Application**

This project demonstrates:
- Real-time systems
- Scalable backend architecture
- Secure authentication
- Live tracking & notifications
- Practical business rules

---

## 👨‍💻 Developer

**Bhuvan Kumar**  
- GitHub: https://github.com/Bhuvankumar32085  
- Project Name: **Foodingo**

---

## ⭐ Future Enhancements

- Admin Dashboard
- Mobile App (React Native)
- Wallet System
- Ratings & Reviews
- AI-based Delivery Assignment

---

## 📌 Note

This project is built for **learning and real-world practice** and showcases advanced MERN stack development concepts.

---

⭐ **If you like this project, don’t forget to star the repository!**
