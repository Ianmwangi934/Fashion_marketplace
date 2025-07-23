#  Fashion E-Commerce Platform

A full-featured fashion e-commerce web application built using Django, Django REST Framework, and React. The platform provides a smooth user experience for shoppers and
powerful tools for administrators, including product management, real-time order tracking, and multiple payment integrations (Stripe, PayPal, and M-Pesa).

---

##  Features

###  User Functionality
- JWT-based authentication and registration
- Browse and search products
- Add/remove items from the cart
- Enter shipping information and place orders
- View order history and payment status
- Sellers can upload products for sale as well
- product filtering, sorting, and search
- Integrate SMS notifications using Twilio



###  Admin Functionality
- Add, edit, and delete products via dashboard
- Manage user orders and update order status
- View customer information and manage product inventory

###  Payment Integrations
- Stripe
- PayPal
- M-Pesa (for local/mobile payment support)

###  General Features
- Responsive and modern UI/UX
- Clean and intuitive navigation
- Real-time cart updates
- Dynamic product details
- Secure backend with protected routes

---

## 🛠️Tech Stack

### Frontend:
- React.js
- Axios
- React Router
- Tailwind CSS / Bootstrap

### Backend:
- Django
- Django REST Framework
- PostgreSQL
- Cloudinary 
- Simple JWT (Authentication)

### Payment Gateways:
- Stripe API
- PayPal REST API
- M-Pesa Daraja API

### DevOps:
- Render (Backend Deployment)
- Vercel (Frontend Deployment)
- GitHub Actions (CI/CD pipeline)

## Demo Video:
https://www.youtube.com/watch?v=TAi_iLruJwM

## Project Structure

```bash
/fashion-backend
    └── products/
    └── users/
    └── orders/
    └── payments/
    └── settings.py
/fashion-frontend
    └── components/
    └── pages/
    └── services/
    └── App.js


## Authentication

    JSON Web Tokens (JWT) handled via Django REST Framework SimpleJWT

    Role-based access for admin and normal users

    Protected API endpoints for orders, cart, and product management

##Future Improvements
Add product recommendation system (AI-based or related items)

Implement order analytics dashboard (for admin)

Improve testing coverage using Pytest and React Testing Library

Add OpenAPI/Swagger API documentation

Containerize backend using Docker

Local Setup

    Clone this repository:
    git clone https://github.com/Ianmwangi934/Fashion_marketplace.git

Author

Ian Murigu:
LinkedIn:https://www.linkedin.com/in/ian-murigu-0a3316327/
Portfolio Website:https://portfolio-pg8p.vercel.app/



