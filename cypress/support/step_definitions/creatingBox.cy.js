import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";
const users = require("../../fixtures/users.json");
const boxPage = require("../../fixtures/pages/boxPage.json");
const generalElements = require("../../fixtures/pages/general.json");
const dashboardPage = require("../../fixtures/pages/dashboardPage.json");
const invitePage = require("../../fixtures/pages/invitePage.json");
const inviteeDashboardPage = require("../../fixtures/pages/inviteeDashboardPage.json");
const drawingPage = require("../../fixtures/pages/drawing.json");

import { faker } from "@faker-js/faker";

let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
let userWishes =
  faker.word.noun() + faker.word.adverb() + faker.word.adjective();
let maxAmount = 50;
let currency = "Евро";
let inviteLink;
let boxID;

Given("user logs in as {string} and {string}", function (string, string2) {
  cy.visit("/login");
  cy.userLogin(string, string2);
});

When("user creates a box", function () {
  cy.contains("Создать коробку").click();
  cy.get(boxPage.boxNameField).type(newBoxName);
  cy.get(":nth-child(3) > .frm")
    .invoke("val")
    .then((ID) => {
      cy.wrap(ID)
        .should("not.be.null")
        .then((newID) => {
          boxID = newID;
          cy.log("Box ID:", boxID);
        });
    });
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.sixthIcon).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(boxPage.giftPriceToggle).check({ force: true });
  cy.get(boxPage.maxAnount).type(maxAmount);
  cy.get(boxPage.currency).select(currency);
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.arrowRight).click();
  cy.get(generalElements.arrowRight).click();
});

Then("box is created successfully", function () {
  cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
  cy.get('[class="toggle-menu"]')
    .invoke("text")
    .then((text) => {
      expect(text).to.include("Участники");
      expect(text).to.include("Моя карточка");
      expect(text).to.include("Подопечный");
    });
});

Given("user is on a box page", function () {
  cy.get(generalElements.submitButton).click({ force: true });
});

When("user adds participants", function () {
  cy.get(invitePage.inviteLink)
    .invoke("text")
    .then((link) => {
      cy.wrap(link)
        .should("not.be.null")
        .then((wrappedLink) => {
          inviteLink = wrappedLink;
          cy.log("InviteLink:", inviteLink);
        });
    });
  cy.get(invitePage.invitedUserNameFieldFirst).type(users.user2.name);
  cy.get(invitePage.invitedUserEmailFieldFirst).type(users.user2.email);
  cy.get(invitePage.invitedUserNameFieldSekond).type(users.user3.name);
  cy.get(invitePage.invitedUserEmailFieldSekond).type(users.user3.email);
  cy.get(invitePage.button).click({ force: true });
});

Then("participants are added successfully", function () {
  cy.get(invitePage.messageField)
    .invoke("text")
    .should(
      "include",
      "Карточки участников успешно созданы и приглашения уже отправляются."
    );
  cy.clearCookies();
});

Given(
  "invited user logs is on invitelink_page as {string} and {string}",
  function (string, string2) {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.userLogin(string, string2);
  }
);

When("invited user creates his own card", function () {
  cy.contains("Создать карточку участника").should("exist");
  cy.creatingUsersCard(userWishes);
});

Then("card is created successfully", function () {
  cy.get(inviteeDashboardPage.noticeForInvitee)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
    });
  cy.clearCookies();
});

Given(
  "invited user logs in as {string} and {string}",
  function (login, password) {
    cy.visit("/login");
    cy.userLogin(login, password);
  }
);

When("invited user creates a card", function () {
  cy.get(
    '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item'
  ).click();
  cy.contains(newBoxName).click({ force: true });
  cy.get(inviteeDashboardPage.inviteCard).click({ force: true });
  cy.creatingUsersCard(userWishes);
});

When("user drawes lot", function () {
  cy.get(
    '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item'
  ).click();
  cy.contains(newBoxName).click({ force: true });
  cy.get(drawingPage.drawingSubmitLink).click({ force: true });
  cy.get(drawingPage.drawingSubmitButton).click();
  cy.get(drawingPage.secondSubmitButton).click();
});

Then("draw is carried out successfully", function () {
  cy.get(drawingPage.notice)
    .invoke("text")
    .then((text) => {
      expect(text).to.contain("Жеребьевка проведена");
    });
});

Given("box is deleted per API DELETE request", function () {
  cy.request({
    method: "DELETE",
    headers: {
      Cookie:
        "jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjY1MjE0ODAsImlhdCI6MTcwNTE2Nzg2OCwiZXhwIjoxNzA3NzU5ODY4fQ.8mM0oGz8e7m9prmsF1AcQ9SWI-gXtVC6roxg2iesyZc; Max-Age=2592000; Path=/; Expires=Mon, 12 Feb 2024 17:44:28 GMT; HttpOnly",
    },
    url: "https://santa-secret.ru/api/box/" + boxID,
  }).then((response) => {
    expect(response.status).to.equal(200);
  });
});
