# Project README

## Overview

This project includes various components that demonstrate proficiency in Angular, ASP.NET Core. The main features include a user-friendly interface for managing contacts.

## Technologies Used

- **Angular**: For building dynamic web applications with a focus on optimizing code.
- **ASP.NET Core**: For creating a RESTful API to manage contacts.
- **JSON**: For storing contact data in a file.
- **Dependency Injection**: Utilized for logging and service management.
  

## Features

### Angular Application

- **Contact Management**:
  - Modals for creating/editing contacts.
  - Confirmation modal for contact deletion.
  - Optimized filtering mechanisms and observable handling for efficient data processing.

### ASP.NET Core API for Contact Management

- **Contact Management Endpoints**:
  - **GET api/contact/GetContacts**: Retrieves a list of all contacts.
  - **GET api/contact/GetContactById**: Retrieves a specific contact by ID.
  - **POST api/contact/AddContact**: Adds a new contact to the list.
  - **PUT api/contact/UpdateContact**: Updates an existing contact's details.
  - **DELETE api/contact/DeleteContact**: Deletes a contact by ID.

- **Custom Error Handling Middleware**:
  - **CookieAuthMiddleware**: Custom middleware that handles authorization token processing and provides detailed error responses for various status codes (404, 401, 500).

## Setup Instructions

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16 or higher. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: This comes bundled with Node.js. Verify your installation by running:
  ```bash
  node -v
  npm -v

**Installation**

**1.Clone the Repository:**

git clone <repository-url>
cd <repository-folder>

**2.Set Up Angular Client:**

cd client
npm install

**3.Set Up ASP.NET Core API:**
--> Navigate back to the root directory:
cd ..

--> Restore the dependencies:

dotnet restore

--> Run the API application:

dotnet run




