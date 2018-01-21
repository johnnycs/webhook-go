# Webhook-go

## Server side
- Clone this repo to your $GOPATH.
- To connect with MongoDB, you should go fix the credentials in the `main.go`. 
- Make sure you have all the required packages installed, then run `go run main.go`
- The server serves the data to the client. The data is generated from user that is subcribed to facebook app, and sent via webhook.
- Once the server gets a webhook data from a user, it will insert a document to the MongoDB, which the client will use to render.

## Client side
- Run `cd client`.
- Change the facebook appId in `FbLogin.js` to your app id, so that the user is subscribed to your app.
- Run `npm install` to install all the required npm packages listed in `package.json`.
- Run `npm start`
- User needs to subsribe to the facebook app in order for us to receive their webhook data.
- The client side is able to filter and search for specific field. Eg. Enter `id=<user id>` in the search bar will find you the data that has the user id of `<user id>`. Search bar also allows for searching of user id containing `<user id>`. Simply, enter user id that wants to be searched onto the search bar. Lastly, filter of fields that should be rendered is also available in toggle format. 
