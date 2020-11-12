Technologies used: Javascript, MongoDB, Mongoose

Wireframe Link: https://imgur.com/gallery/Kf8rhW2

ERD Link: https://imgur.com/gallery/IRbdmBm

API Link: https://damp-journey-96295.herokuapp.com

Client Deployment Link: https://nickromero-prog.github.io/plantproject-client/

Client Github Repository: https://github.com/nickromero-prog/plantproject-client

API Github Repository: https://github.com/nickromero-prog/plantproject-api

Built an API using mongoDB and mongoose in order for a front end application
to be able to store basic authentication for users. Also created routes for users
to be able to create one specific resource (plants). The schema requires three
fields (for the plant) including the name, light, and water.


First I had to create a schema for a user in order to add basic authentication
to the app. Second, I created a one to many relationship with regard to resources
pertaining to one single user.

Second I created routes for the user to be able to sign up, sign in, sign out, and
change password using http protocols (GET, PATCH, and DELETE).

I used requiredToken middleware in order to deny access to specific interactions
unless they were signed in and using their personal account.

Then I needed to create routes for my user to be able to CRUD a resource or a
plant in this case using the same http protocols.

Future iterations:

1) I would like for users to be able to submit pictures along with information
about the plant.

2) I would like to be able to create another resource but for pots instead of
plants.
