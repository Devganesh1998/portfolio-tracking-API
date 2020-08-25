# Portfolio Tracking API

It allows adding, deleting and updating trades and can do basic return calculations

## Endpoints

### Native Register

POST `/users/register`

#### REQUEST

```json
{
  "email": "test@mail.com",
  "password": "TestPass",
  "name": "TestName"
}
```

#### RESPONSE

- ##### If Registration successful

  cookie will be set with name smallcaseSessionId

  ```json
  {
    "isRegisterSuccess": true,
    "user": {
      "name": "testName",
      "email": "testemail4@mail.com",
      "password": "$2b$10$5m0g5ktkk85UpNZjVkUGWOID0SsWSfvbPEv4Az9xvs09kul8CWGcy",
      "portfolio": "5f42475d41345431a296ed43",
      "createdAt": "2020-08-25T17:16:13.366Z",
      "updatedAt": "2020-08-25T17:16:13.366Z"
    }
  }
  ```

- ##### If given email already registered

  ```json
  {
    "errMsg": "Given Mail is already Taken by another user",
    "isRegisterSuccess": false
  }
  ```

- ##### If any error happend with cookie data or saving sessionId to Redis

  ```json
  {
    "errorMsg": "Session not being maintained, Please Login again",
    "isRegisterSuccess": true,
    "user": {
      "name": "testName",
      "email": "testemail4@mail.com",
      "password": "$2b$10$5m0g5ktkk85UpNZjVkUGWOID0SsWSfvbPEv4Az9xvs09kul8CWGcy",
      "portfolio": "5f42475d41345431a296ed43",
      "createdAt": "2020-08-25T17:16:13.366Z",
      "updatedAt": "2020-08-25T17:16:13.366Z"
    }
  }
  ```

- ##### If request payload didn't met the requirements

  ```json
  {
    "errors": [
      {
        "msg": "Invalid value",
        "param": "email",
        "location": "body"
      }
    ],
    "errormsg": "Please send required Details",
    "Required fields": ["email", "password", "name"],
    "sample Format": {
      "email": "TestEmail@mail.com",
      "password": "testPassword",
      "name": "testName"
    }
  }
  ```

### Native Login

POST `/users/login`

#### REQUEST

```json
{
  "email": "TestEmail@mail.com",
  "password": "testpass"
}
```

#### RESPONSE

- ##### If Login Successful

  cookie will be set with name smallcaseSessionId

  ```json
  {
    "isLoginSuccess": true
  }
  ```

- ##### If User hasn't registered with given mail

  ```json
  {
    "isLoginSuccess": false,
    "errMsg": "Invalid email or password"
  }
  ```

- ##### If request payload didn't met the requirements

  ```json
  {
    "errors": [
      {
        "msg": "Invalid value",
        "param": "email",
        "location": "body"
      }
    ],
    "errormsg": "Please send required Details",
    "Required fields": ["email", "password"],
    "sample Format": {
      "email": "TestEmail@mail.com",
      "password": "pass"
    }
  }
  ```

### Logout

GET `/users/logout`

#### REQUEST

Cookie will be send automatically.

#### RESPONSE

- ##### If logout is successful

  ```json
  {
    "isLogoutSuccess": true
  }
  ```

- ##### If session is already expired

  ```json
  {
    "msg": "Session already Expired",
    "isLogoutSuccess": true
  }
  ```

## Protected Enpoints

### Trade routes

### Add a Trade

POST `/trades`

#### REQUEST

Cookie will be used to verifyAuth.

```json
{
  "ticker_symbol": "MMC",
  "shares": 10,
  "price": 300,
  "tradeType": "buy"
}
```

#### RESPONSE

- ##### If User is authenticated and trade added

  ```json
  {
    "isAdded": true,
    "trade": {
      "_id": "5f454d809419a83612f859ff",
      "portfolio": "5f44f4780c78438c6792600e",
      "portfolioUnit": "5f4538268eabc419996ccf5d",
      "ticker_symbol": "MMC",
      "price": 300,
      "shares": 10,
      "type": "buy",
      "createdAt": "2020-08-25T17:42:24.512Z",
      "updatedAt": "2020-08-25T17:42:24.512Z"
    },
    "msg": "Trade Added Successfully"
  }
  ```

- ##### If User is NOT authenticated

  ```json
  {
    "msg": "Session Expired Login Again",
    "isAuthenticated": false
  }
  ```

- ##### If User sent a unknown ticker symbol for a security

  ```json
  {
    "isAdded": false,
    "errMsg": "Please send the Correct details of ticker_symbol"
  }
  ```

- ##### If User sent more shares than he / she has when selling trades (tradeType: "sell")

  ```json
  {
    "isAdded": false,
    "errMsg": "Not Enough share in portfolio to sell"
  }
  ```

- ##### If request payload didn't met the requirements

  ```json
  {
    "errors": [
      {
        "msg": "Invalid value",
        "param": "ticker_symbol",
        "location": "body"
      }
    ],
    "errormsg": "Please send required Details",
    "Required fields": ["ticker_symbol", "shares", "price", "tradeType"],
    "sample Format": {
      "ticker_symbol": "testTicketSymbol",
      "shares": 12,
      "price": 200,
      "tradeType": "buy"
    },
    "TradeTypes": ["buy", "sell"]
  }
  ```

### Update Trade

PUT `/trades/:trade_id`

#### REQUEST

Cookie will be used to verifyAuth.

```json
{
  "shares": 5
}
```

#### RESPONSE

- ##### If User is authenticated and trade is updated

  ```json
  {
    "isUpdated": true,
    "msg": "Trade updated Successfully"
  }
  ```

- ##### If User is not authenticated

  ```json
  {
    "msg": "Session Expired Login Again",
    "isAuthenticated": false
  }
  ```

- ##### If User sent more shares than he/she has in portfolio when selling

  ```json
  {
    "isUpdated": false,
    "errMsg": "Not Enough share in portfolio to sell"
  }
  ```

- ##### If User sent a inValid Trade Id length

  ```json
  {
    "isUpdated": false,
    "errMsg": "Trade_id sent must be a single String of 12 bytes or a string of 24 hex characters"
  }
  ```

- ##### If User sent a unknown Trade Id

  ```json
  { "isUpdated": false, "errMsg": "Invalid tradeId" }
  ```

- ##### If request payload didn't met the requirements

  ```json
  {
    "errors": [
      {
        "msg": "Invalid value",
        "param": "shares",
        "location": "body"
      }
    ],
    "errormsg": "Please send required Details",
    "Required fields": ["shares"],
    "sample Format": {
      "shares": 12
    }
  }
  ```

### Delete Trade

DELETE `/trades/:trade_id`

#### REQUEST

Cookie will be used to verifyAuth.

#### RESPONSE

- ##### If User is authenticated and trade is deleted

  ```json
  {
    "isTradeDeleted": true,
    "msg": "Trade deleted Successfully"
  }
  ```

- ##### If User is not authenticated

  ```json
  {
    "msg": "Session Expired Login Again",
    "isAuthenticated": false
  }
  ```

- ##### If User sent a unknown tradeId

  ```json
  {
    "isTradeDeleted": false,
    "errMsg": "Trade_id sent must be a single String of 12 bytes or a string of 24 hex characters"
  }
  ```

- ##### If User sent invalid tradeId

  ```json
  { "isTradeDeleted": false, "errMsg": "Invalid tradeId" }
  ```

### Portfolio routes

### Fetching Portfolio

GET `/portfolio`

#### REQUEST

Cookie will be used to verifyAuth.
By using cookie user data is fetched and respective portfolio is served.

#### RESPONSE

- ##### If User is authenticated and Portfolio fetched Successfully

  ```json
  {
    "user": {
      "_id": "5f44f4790c78438c6792600f",
      "name": "deva",
      "email": "dev@mail.com",
      "password": "$2b$10$FzAbHAVtsVl1eZ7dxJlq/ukYFNuuUrTxKaHz3a/Bjupiwg/y8Rjtq",
      "portfolio": "5f44f4780c78438c6792600e",
      "createdAt": "2020-08-25T11:22:33.184Z",
      "updatedAt": "2020-08-25T11:22:33.184Z"
    },
    "portfolio": {
      "_id": "5f44f4780c78438c6792600e",
      "name": "deva",
      "createdAt": "2020-08-25T11:22:32.868Z",
      "updatedAt": "2020-08-25T11:22:32.868Z"
    },
    "portfolioUnits": [
      {
        "_id": "5f4500a14e74af98a3bbc435",
        "portfolio": "5f44f4780c78438c6792600e",
        "ticker_symbol": "MPV",
        "average_buy_price": 200,
        "shares": 10,
        "createdAt": "2020-08-25T12:14:25.221Z",
        "updatedAt": "2020-08-25T13:13:58.371Z"
      }
    ],
    "trades": [
      {
        "_id": "5f4500e54e74af98a3bbc437",
        "portfolio": "5f44f4780c78438c6792600e",
        "portfolioUnit": "5f4500a14e74af98a3bbc435",
        "ticker_symbol": "MPV",
        "price": 200,
        "shares": 10,
        "type": "buy",
        "createdAt": "2020-08-25T12:15:33.262Z",
        "updatedAt": "2020-08-25T12:15:33.262Z"
      }
    ]
  }
  ```

- ##### If User is NOT authenticated

  ```json
  {
    "msg": "Session Expired Login Again",
    "isAuthenticated": false
  }
  ```

### Fetching holdings

GET `/portfolio/holdings`

#### REQUEST

Cookie will be used to verifyAuth.
By using cookie user data is fetched and respective portfolio is served.

#### RESPONSE

- ##### If User is authenticated and Portfolio Holdings fetched Successfully

  ```json
  {
    "user": {
      "_id": "5f44f4790c78438c6792600f",
      "name": "deva",
      "email": "dev@mail.com",
      "password": "$2b$10$FzAbHAVtsVl1eZ7dxJlq/ukYFNuuUrTxKaHz3a/Bjupiwg/y8Rjtq",
      "portfolio": "5f44f4780c78438c6792600e",
      "createdAt": "2020-08-25T11:22:33.184Z",
      "updatedAt": "2020-08-25T11:22:33.184Z"
    },
    "holdings": {
      "portfolio": {
        "_id": "5f44f4780c78438c6792600e",
        "name": "deva",
        "createdAt": "2020-08-25T11:22:32.868Z",
        "updatedAt": "2020-08-25T11:22:32.868Z"
      },
      "portfolioUnits": {
        "_id": null,
        "total_amount_invested": 13000,
        "total_shares": 40,
        "total_avg_buy_price": 325
      }
    }
  }
  ```

- ##### If User is NOT authenticated

  ```json
  {
    "msg": "Session Expired Login Again",
    "isAuthenticated": false
  }
  ```

### Fetching Portfolio returns

GET `/portfolio/returns`

#### REQUEST

Cookie will be used to verifyAuth.
By using cookie user data is fetched and respective portfolio is served.

#### RESPONSE

- ##### If User is authenticated and Portfolio Holdings fetched Successfully

  ```json
  {
    "user": {
      "_id": "5f44f4790c78438c6792600f",
      "name": "deva",
      "email": "dev@mail.com",
      "password": "$2b$10$FzAbHAVtsVl1eZ7dxJlq/ukYFNuuUrTxKaHz3a/Bjupiwg/y8Rjtq",
      "portfolio": "5f44f4780c78438c6792600e",
      "createdAt": "2020-08-25T11:22:33.184Z",
      "updatedAt": "2020-08-25T11:22:33.184Z"
    },
    "returns": {
      "portfolio": {
        "_id": "5f44f4780c78438c6792600e",
        "name": "deva",
        "createdAt": "2020-08-25T11:22:32.868Z",
        "updatedAt": "2020-08-25T11:22:32.868Z"
      },
      "portfolioUnits": [
        {
          "_id": null,
          "total_return": -9000
        }
      ]
    }
  }
  ```

- ##### If User is NOT authenticated

  ```json
  {
    "msg": "Session Expired Login Again",
    "isAuthenticated": false
  }
  ```

## Built With

- [Express](https://expressjs.com/)
- [Mongoose](https://expressjs.com/)
