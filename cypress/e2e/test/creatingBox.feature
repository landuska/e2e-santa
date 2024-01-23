Feature: user creats a box, invites another users

    Scenario: user logs in and create a box
        Given user logs in as "landysh.kh+test@gmail.com" and "TS1542"
        When user creates a box
        Then box is created successfully

    Scenario: user adds participants

        Given user is on a box page
        When user adds participants
        Then participants are added successfully

    Scenario: approve as invited user (per table)
        Given invited user logs in as "<login>" and "<password>"
        When invited user creates a card
        Then card is created successfully

        Examples:
            | login                      | password |
            | landysh.kh+test2@gmail.com | ZP0409   |
            | landysh.kh+test3@gmail.com | GD2907   |

    Scenario: deleting a box
        Given box is deleted per API DELETE request

