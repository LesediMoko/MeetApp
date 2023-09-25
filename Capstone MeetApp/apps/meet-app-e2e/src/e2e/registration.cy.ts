import { getRandomString } from '../support/app.po';

describe("sign up ",() =>{

    //sign up into application as regular user
    it("Enter as regular User",()=>{
        /*cy.visit("/");
        cy.get("h1").contains("WELCOME");
        cy.get("#User").click();
        cy.get("h1").contains("LOG IN");
        cy.get("#SIGNUP").click();
        cy.get("h1").contains("SIGN UP");
        cy.get("#username").type(getRandomString());
        cy.get("#passwd").type("Polane@123!");
        cy.get("#cpasswd").type("Polane@123!");
        cy.get("#region").type("Pretoria");
        cy.get("#signup-button").click();

        
        */
    });

    //sign up into application as organiser
    it("Enter as organiser User",()=>{
        cy.visit("/");
        cy.get("h1").contains("WELCOME");
        cy.get("#Org").click();
        cy.get("h1").contains("LOG IN");
        cy.get("h1").contains("SIGN UP");
        cy.get("#Ousername").type(getRandomString());
        cy.get("#Oname").type(getRandomString());
        cy.get("#Opasswd").type("Polane@123!");
        cy.get("#signup-button").click();
        
    })

})