Feature: user creats a box, invites another users

    Scenario: user logs in and create a box
        Given user logs in as "landysh.kh+test@gmail.com" and "TS1542"
        When user creates a box
        Then box is created successfully

    Scenario: user adds participants
        Given user is on a box page
        When user adds participants
        Then participants are added successfully

    Scenario: approve as invited user (per link)
        Given invited user logs is on invitelink_page as "landysh.kh+test1@gmail.com" and "PD3429"
        When invited user creates his own card
        Then card is created successfully

    Scenario: deleting a box
        Given box is deleted per API DELETE request