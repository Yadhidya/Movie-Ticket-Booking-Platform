# SmartEventHub - Intelligent Ticket Booking System

SmartEventHub is a modern, full-stack event management and ticket booking application built with React and Spring Boot. It features user-specific ticket isolation, a sleek dark-themed UI, and a robust backend.

## 🚀 Features

- **Event Discovery**: Browse upcoming tech events, workshops, and conferences.
- **Intelligent Booking**: Select your own seats and book tickets with a streamlined checkout flow.
- **User Isolation**: Securely manage your own tickets. Different users only see their specific bookings.
- **Admin Dashboard**: Specialized access for managing events and viewing global bookings.
- **Digital Tickets**: View and manage your tickets with unique tracking IDs.
- **Modern UI**: Built with a premium dark aesthetic using vanilla CSS and Lucide icons.

## 🛠️ Tech Stack

### Frontend
- **React 19**: Modern UI development.
- **Vite**: Ultra-fast build tool and dev server.
- **Vanilla CSS**: Custom-crafted premium design system.
- **Lucide React**: Clean and consistent iconography.

### Backend
- **Spring Boot 3.4.0**: Robust Java-based backend framework.
- **Spring Data JPA**: Efficient database management and ORM.
- **H2 Database**: High-performance in-memory database for development.
- **Maven**: Project management and build automation.

## 📦 Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 18 or higher
- Maven 3.9+

### Quick Start (Automated)
If you are on Windows, you can start both the backend and the tunnel with a single click:
- Run the `start-app.bat` file in the root directory.
- Keep the two windows that open running while you use the app.

### Manual Backend Setup
1. Navigate to the `backend` directory.
2. Run the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:8080`.

### Frontend Setup
1. Navigate to the root directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.


## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
