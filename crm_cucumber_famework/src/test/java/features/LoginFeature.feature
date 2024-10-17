#Author: your.email@your.domain.com
#Keywords Summary :
#Feature: List of scenarios.
#Scenario: Business rule through list of steps with arguments.
#Given: Some precondition step
#When: Some key actions
#Then: To observe outcomes or validation
#And,But: To enumerate more Given,When,Then steps
#Scenario Outline: List of steps for data-driven as an Examples and <placeholder>
#Examples: Container for s table
#Background: List of steps run before each of the scenarios
#""" (Doc Strings)
#| (Data Tables)
#@ (Tags/Labels):To group Scenarios
#<> (placeholder)
#""
## (Comments)
#Sample Feature Definition Template
#

Feature: Loginpage

Scenario: Open login page
Given user enters login page url in chrome browser
Then Login page should be displayed


  #Scenario: Validate login process
    #Given User needs to be on the login page of the CRM project
    #When User enters the email
    #And User enters the password
    #And User clicks on the login button
    #Then User handles the alert and clicks on OK button
    #And User should be navigated to the dashboard page
    
    
    
   
    
    