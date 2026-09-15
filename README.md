# techloom-intern-assessment
Software Engineer Intern — Practical Assessment

# Techloom Intern Assessment - Full Stack Engineering

## Live Deployments & Repository
* **GitHub Repository:** [https://github.com/SasaaraPamudi/techloom-intern-assessment](https://github.com/SasaaraPamudi/techloom-intern-assessment)
* **Task 01 Live URL:** [techloom-intern-assessment-33ganmdwo-sasaara.vercel.app](https://techloom-intern-assessment-knf6ps18t-sasaara.vercel.app/)
* **Task 02 Live URL:** [techloom-intern-assessment-6k2m-dn4tczwel-sasaara.vercel.app](https://techloom-intern-assessment-6k2m-dn4tczwel-sasaara.vercel.app/)

---

##  Tech Stack
For task 01
* **Frontend:** React.js / Vite 
* **Backend:** Java 21 & Spring Boot 3.2.5
* **Database:** MySQL (Aiven)

For task 02
* **Frontend:** React.js / Vite 
* **Backend:** Java 21 & Spring Boot 3.2.5
* **Database:** PostgreSQL(Supabase)

---

##  Project Structure
* `/task-01` - POS Order & Inventory System (Concurrency-safe backend, stock reservations, lifecycle states)
* `/task-02` - E-Commerce Checkout & Payment System (Catalog discovery, filtering, idempotent payments, order history)

---

##  Setup & Local Installation

### Prerequisites
* Java 21 SDK
* Node.js & npm
* PostgreSQL database instance

### Environment Variables
Create an `application.properties` file in `task-01/pos-system/src/main/resources/` and `task-02/ecommerce-backend/src/main/resources/` using this template:
```properties
server.port=8080 (or 8081)

# --- Task 01 Configuration ---
server.port=8080
spring.datasource.url=jdbc:mysql://mysql-220d7b07-pamudisasaara-5440.j.aivencloud.com:15949/defaultdb?sslmode=REQUIRED
spring.datasource.username=avnadmin
spring.datasource.password=AVNS_rYMBfE-vIErDxiI-qvR
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# --- Task 02 Configuration ---
server.port=8081
spring.datasource.url=jdbc:postgresql://aws-0-ap-southeast-2.pooler.supabase.com:5432/postgres
spring.datasource.username=postgres.ggcpbhcedbyepgxlqzzi
spring.datasource.password=TNnbKGaPN0GKRo17
spring.datasource.driver-class-name=org.postgresql.Driver


##  How to Test

### Task 01: POS Order & Inventory
1. Open the Task 01 live frontend URL.
2. Add items to the cart and verify real-time inventory validation.
3. Proceed to checkout to trigger the 5-minute stock reservation lock.
4. Simulate payment success/failure outcomes and check order status transitions.

### Task 02: E-Commerce Storefront
1. Open the Task 02 live frontend URL.
2. Use the product catalog search and category filters.
3. Add products to the cart, run checkout, and test mock payment responses (success, timeout, duplicate safeguards).
4. Navigate to the order history view to check past orders, cancellations, and refund simulations.

