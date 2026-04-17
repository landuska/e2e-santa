# 🎄 E2E Test Automation — Secret Santa App

Full end-to-end test suite for a real-world Secret Santa web application,
simulating a complete multi-user gift exchange workflow.

## 🔁 Test Flow

1. User 1 logs in and creates a gift box
2. Invite link is generated and captured dynamically
3. Participants added via invite form (email + name)
4. User 1, 2, 3 each accept the invite and fill in their wishlists
5. User 1 (organizer) runs the gift drawing
6. API cleanup: box is deleted after test run

## ✨ Key Features
- Multi-user scenario with 4 independent user sessions
- Custom Cypress commands: `cy.userLogin()`, `cy.creatingUsersCard()`
- Page Object pattern via JSON fixture files per page
- Dynamic test data with Faker.js (random box name, wishes)
- API teardown using `cy.request()` with JWT auth

## 🛠️ Tech Stack
- Cypress
- JavaScript
- Faker.js
- REST API (JWT)
- JSON Fixtures
