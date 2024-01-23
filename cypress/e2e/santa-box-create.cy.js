const users = require("../fixtures/users.json");
const boxPage = require("../fixtures/pages/boxPage.json");
const generalElements = require("../fixtures/pages/general.json");
const dashboardPage = require("../fixtures/pages/dashboardPage.json");
const invitePage = require("../fixtures/pages/invitePage.json");
const inviteeDashboardPage = require("../fixtures/pages/inviteeDashboardPage.json");
const drawingPage = require("../fixtures/pages/drawing.json");

import { faker } from "@faker-js/faker";

describe("user can create a box and run it", () => {
  //пользователь 1 логинится
  //пользователь 1 создает коробку
  //пользователь 1 получает приглашение
  //пользователь 2 переходит по приглашению
  //пользователь 2 заполняет анкету
  //пользователь 3 переходит по приглашению
  //пользователь 3 заполняет анкету
  //пользователь 4 переходит по приглашению
  //пользователь 4 заполняет анкету
  //пользователь 1 логинится
  //пользователь 1 запускает жеребьевку
  let newBoxName = faker.word.noun({ length: { min: 5, max: 10 } });
  let userWishes =
    faker.word.noun() + faker.word.adverb() + faker.word.adjective();
  let maxAmount = 50;
  let currency = "Евро";
  let inviteLink;
  let boxID;

  it.only("user logins and create a box", () => {
    cy.visit("/login");
    cy.userLogin(users.userAutor.email, users.userAutor.password);
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
    cy.get(generalElements.arrowRight).should("be.visible").click();
    cy.get(boxPage.sixthIcon).should("be.visible").click();
    cy.get(generalElements.arrowRight).should("be.visible").click();
    cy.get(boxPage.giftPriceToggle).check({ force: true });
    cy.get(boxPage.maxAnount).type(maxAmount);
    cy.get(boxPage.currency).select(currency);
    cy.get(generalElements.arrowRight).should("be.visible").click();
    cy.get(generalElements.arrowRight).click();

    cy.get(dashboardPage.createdBoxName).should("have.text", newBoxName);
    cy.get('[class="toggle-menu"]')
      .invoke("text")
      .then((text) => {
        expect(text).to.include("Участники");
        expect(text).to.include("Моя карточка");
        expect(text).to.include("Подопечный");
      });
  });

  it("add participants per link", () => {
    cy.get(generalElements.submitButton).click({ force: true });
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
  });

  it("add participants per table", () => {
    cy.get(invitePage.invitedUserNameFieldFirst).type(users.user2.name);
    cy.get(invitePage.invitedUserEmailFieldFirst).type(users.user2.email);
    cy.get(invitePage.invitedUserNameFieldSekond).type(users.user3.name);
    cy.get(invitePage.invitedUserEmailFieldSekond).type(users.user3.email);
    cy.get(invitePage.button).click({ force: true });
    cy.get(invitePage.messageField)
      .invoke("text")
      .should(
        "include",
        "Карточки участников успешно созданы и приглашения уже отправляются."
      );
    cy.clearCookies();
  });

  it("approve as user1", () => {
    cy.visit(inviteLink);
    cy.get(generalElements.submitButton).click();
    cy.contains("войдите").click();
    cy.userLogin(users.user1.email, users.user1.password);
    cy.contains("Создать карточку участника").should("exist");
    cy.creatingUsersCard(userWishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user2", () => {
    cy.visit("/login");
    cy.userLogin(users.user2.email, users.user2.password);
    cy.get(
      '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item'
    ).click();
    cy.contains(newBoxName).click({ force: true });
    cy.get(inviteeDashboardPage.inviteCard).click({ force: true });
    cy.creatingUsersCard(userWishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("approve as user3", () => {
    cy.visit("/login");
    cy.userLogin(users.user3.email, users.user3.password);
    cy.get(
      '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item'
    ).click();
    cy.contains(newBoxName).click({ force: true });
    cy.get(inviteeDashboardPage.inviteCard).click({ force: true });
    cy.creatingUsersCard(userWishes);
    cy.get(inviteeDashboardPage.noticeForInvitee)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Это — анонимный чат с вашим Тайным Сантой");
      });
    cy.clearCookies();
  });

  it("drawing", () => {
    cy.visit("/login");
    cy.userLogin(users.userAutor.email, users.userAutor.password);
    cy.get(
      '.layout-1__header-wrapper-fixed > .layout-1__header > .header > .header__items > .layout-row-start > [href="/account/boxes"] > .header-item'
    ).click();
    cy.contains(newBoxName).click({ force: true });
    cy.get(drawingPage.drawingSubmitLink).click({ force: true });
    cy.get(drawingPage.drawingSubmitButton).click();
    cy.get(drawingPage.secondSubmitButton).click();
    cy.get(drawingPage.notice)
      .invoke("text")
      .then((text) => {
        expect(text).to.contain("Жеребьевка проведена");
      });
  });

  after("Delete_box", () => {
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
    cy.log("ready!");
  });
});
