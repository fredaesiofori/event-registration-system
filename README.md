# 🎟️ Event Registration System

![Event Registration System](./events%20registraton.png)



## 🎟️ Event Registration System

A serverless event and ticketing platform built as a final capstone project.
It allows users to discover events, register seamlessly, and enables admins to manage events and participants efficiently.

🌐 Live Demo (#live-demo):https://event-registration-system-freda-creations.vercel.app



## 📌 About the Project 

This project is a modern event registration system designed as a capstone submission.
It demonstrates full-stack development principles using a serverless-first approach and continuous deployment via GitHub and Vercel.

## 🚀 Features 
👤 User registration and authentication
📅 Browse and view available events
🎫 Register for events easily
🧑‍💼 Admin dashboard for event management
🔐 Role-based access control (User / Admin)
⚡ Serverless-friendly architecture
📱 Fully responsive UI for all devices
☁️ Auto deployment via Vercel
🛠️ Tech Stack (#tech-stack)
Frontend: TypeScript, Vite, HTML, CSS
Backend Concept: Serverless architecture (AWS-inspired design)
Hosting: Vercel
Build Tool: Vite
Dev Tools: GitHub Actions, ESLint, TypeScript

# Monitoring Setup (Grafana + Prometheus)
View Dashboard/Panel:http://localhost:3001/d/adxc8d6/new-dashboard?...=true&orgId=1&from=now-6h&to=now&timezone=browser

This project includes monitoring using:
- Prometheus for metrics collection
- Grafana for visualization dashboards
- Docker for containerized setup

### Features added:
- CPU usage monitoring
- Memory usage tracking
- Container monitoring via cAdvisor

 # 🐳 Docker Setup & Deployment

This project was containerized using Docker to ensure a consistent development and deployment environment.

 📌 What I did:
Created a Dockerfile to containerize the application
Built a Docker image for the project
Created and configured a Docker container to run the app
Managed container conflicts by removing or replacing existing containers
Rebuilt the container after changes to the application
Exposed the application through a mapped port for local access
Tested the running container to confirm the application works correctly.





 event-registration-system/
│
├── .github/workflows     # CI/CD pipelines
├── src                   # Application source code
│   ├── components
│   ├── pages
│   ├── services
│   └── main.tsx
│
├── public
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── README.md


## ⚙️ Getting Started 
1. Clone the repository
git clone https://github.com/fredaesiofori/event-registration-system.git
cd event-registration-system
2. Install dependencies
npm install
3. Run the development server
npm run dev


## 🔐 Roles & Permissions 
👤 Users
View available events
Register for events
🧑‍💼 Admin
Create and manage events
View all registrations
Control system data

⚠️ Only admins have access to administrative features.

## ☁️ Deployment 
Hosted on Vercel
Connected to GitHub for CI/CD automation
Every push to the main branch triggers automatic deployment
📈 Future Improvements (#future-improvements)
QR code event check-in system
Email confirmation system
Payment integration for premium events
Analytics dashboard for admins
Multi-organizer support

## 🤝 Contribution 
Fork the repository
Create a new branch
Make your improvements
Submit a pull request
📄 License (#license)

This project is licensed under the MIT License.

## 👩‍💻 Author
 Freda Ofori 
