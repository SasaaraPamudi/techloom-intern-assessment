# techloom-intern-assessment
Software Engineer Intern — Practical Assessment

# Techloom Intern Assessment - Full Stack Engineering

## 🚀 Live Deployments & Repository
* **GitHub Repository:** [https://github.com/SasaaraPamudi/techloom-intern-assessment](https://github.com/SasaaraPamudi/techloom-intern-assessment)
* **Task 01 Live URL:** techloom-intern-assessment-33ganmdwo-sasaara.vercel.app
* **Task 02 Live URL:** [Insert your Task 02 Deployment Link Here]

---

## 🛠️ Tech Stack
For task 01
* **Frontend:** React.js / Vite 
* **Backend:** Java 21 & Spring Boot 3.2.5
* **Database:** MySQL (Aiven)

For task 02
* **Frontend:** React.js / Vite 
* **Backend:** Java 21 & Spring Boot 3.2.5
* **Database:** PostgreSQL(Supabase)

---

## 📦 Project Structure
* `/task-01` - POS Order & Inventory System (Concurrency-safe backend, stock reservations, lifecycle states)
* `/task-02` - E-Commerce Checkout & Payment System (Catalog discovery, filtering, idempotent payments, order history)

---

## ⚙️ Setup & Local Installation

### Prerequisites
* Java 21 SDK
* Node.js & npm
* PostgreSQL database instance

### Environment Variables
Create an `application.properties` file in `task-01/pos-system/src/main/resources/` and `task-02/ecommerce-backend/src/main/resources/` using this template:
```properties
server.port=8080 (or 8081)
spring.datasource.url=jdbc:postgresql://your-db-host:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=your_secure_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
