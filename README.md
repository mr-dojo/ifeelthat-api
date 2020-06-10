# Listen/Share API

## API for the Listen/Share app

### This API stores users "feeling" profile and stores/retrives users text and audio posts.

![Begin](src/pictures/app_screenshot.JPG)

## Links

- Live App: [Click Here](https://ifeelthat-app.now.sh/)

- Live API: [Click Here](https://ifeelthat-api.herokuapp.com/)

- App Repo: [Click Here](https://github.com/mr-dojo/ifeelthat-app)

- API Repo: [Click Here](https://github.com/mr-dojo/ifeelthat-api)

## API endpoints

- ### List all feelings

  `GET /feeling`
  This returns a list of all feeling objects in the feeling table.

  #### Response

  `Status: 200 Okay`

  ```json
  [
    {
      "emotion": "Sadness",
      "color": "#FFFFFF"
    },
    {
      "emotion": "Anger",
      "color": "#000000"
    }
  ]
  ```

- ### Add new feeling

  `POST /feeling`
  This adds a new feeling object to the feeling table

  #### Parameters

  | Name      | Type     | Description                                                                                                                                                                                                                                     |
  | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `emotion` | `string` | A value representing the emotion of the user being one of: `Joy`, `Sadness`, `Anger`, `Fear`, `Anxiety`, `Excitement`, `Guilt`, `Gratitude`, `Contentment`, `Shame`, `Loneliness`,`Pride`, `Power`, `Confusion`, `Nothing`, or `Disappointment` |
  | `color`   | `string` | Valid hex color of 6 digits starting with '#'                                                                                                                                                                                                   |

  example:

  ```json
  {
    "emotion": "Sadness",
    "color": "#FFFFFF"
  }
  ```

  #### Response

  `Status: 201 Created`

  ```json
  {
    "id": 123,
    "emotion": "Sadness",
    "color": "#FFFFFF"
  },
  ```

- ### Find feeling

  `GET /feeling/:feeling_id`
  This returns a feeling object with the associated id from the feeling table

  #### Parameters

  example:

  `https://ifeelthat-api.herokuapp.com/feeling/123`

  #### Response

  `Status: 200 Okay`

  ```json
  {
    "id": 123,
    "emotion": "Sadness",
    "color": "#FFFFFF"
  }
  ```

- ### Update feeling

  `PATCH /feeling/:feeling_id`
  This updates the feeling with the associated id from the feeling table

  #### Parameters

  Must have one of the following parameters:
  | Name | Type | Description |
  | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `emotion` | `string` | A value representing the emotion of the user being one of: `Joy`, `Sadness`, `Anger`, `Fear`, `Anxiety`, `Excitement`, `Guilt`, `Gratitude`, `Contentment`, `Shame`, `Loneliness`,`Pride`, `Power`, `Confusion`, `Nothing`, or `Disappointment` |
  | `color` | `string` | Valid hex color of 6 digits starting with '#' |

  example:

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/feeling/123`, {
    method: "POST",
    body: JSON.stringify({
      color: "#2C1E1E",
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### Response

  ```json
  {
    "id": 123,
    "emotion": "Sadness",
    "color": "#2C1E1E"
  }
  ```

- ### Delete feeling

  `DELETE /feeling/:feeling_id`
  This deletes the feeling with the associated id from the feeling table

  example:
  `https://ifeelthat-api.herokuapp.com/feeling/123`

  #### Response

  `Status: 204 No Content`

- ### List all shares

  `GET /share`
  Returns a list of all the share objects in the share table

  #### Response

  `Status: 200 Okay`

  ```json
  [
    {
      "id": 23,
      "audio_share": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/792366031%3Fsecret_token%3Ds-d720mgO62E7",
      "text_share": null,
      "feeling_id": 123,
      "share_type": "Audio",
      "emotion": "Sadness"
    },
    {
      "id": 24,
      "audio_share": null,
      "text_share": "Example of a text share",
      "feeling_id": 124,
      "share_type": "Text",
      "emotion": "Fear"
    }
  ]
  ```

- ### Add new share

  `POST /share`
  This adds a new share object to the share table.

  #### Parameters

  | Name          | Type     | Description                                                                                                                                                                                                                                                |
  | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `emotion`     | `string` | Value representing the emotion of the user being one of: `Joy`, `Sadness`, `Anger`, `Fear`, `Anxiety`, `Excitement`, `Guilt`, `Gratitude`, `Contentment`, `Shame`, `Loneliness`,`Pride`, `Power`, `Confusion`, `Nothing`, or `Disappointment` **Required** |
  | `audio_share` | `string` | Url with a direct link to a soundcloud audio file. One of either `audio_share` or `text_share` is **Required**.                                                                                                                                            |
  | `text_share`  | `string` | String from a user, talking about their experiences and emotions. One of either `audio_share` or `text_share` is **Required**.                                                                                                                             |
  | `share_type`  | `string` | Type of share that the user has chosen being one of: `Text` or `Audio` **Required**                                                                                                                                                                        |
  | `feeling_id`  | `int`    | An id that matches an existing feeling's id **Required**                                                                                                                                                                                                   |

  example:

  ```json
  {
    "audio_share": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/792366031%3Fsecret_token%3Ds-d720mgO62E7",
    "feeling_id": 123,
    "share_type": "Audio",
    "emotion": "Sadness"
  }
  ```

  #### Response

  `Status: 201 Created`

  ```json
  {
    "id": 23,
    "audio_share": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/792366031%3Fsecret_token%3Ds-d720mgO62E7",
    "text_share": null,
    "feeling_id": 123,
    "share_type": "Audio",
    "emotion": "Sadness"
  }
  ```

- ### Find all shares by emotion

  `GET /share/find?emotion`
  returns with all the share objects in the share table
  that match the "emotion" query param along with its coorisponding color

  #### Parameters

  example:
  `GET /share/find?emotion=Confusion`

  The request requires a query param called `emotion` that matches one of following values: `Joy`, `Sadness`, `Anger`, `Fear`, `Anxiety`, `Excitement`, `Guilt`, `Gratitude`, `Contentment`, `Shame`, `Loneliness`,`Pride`, `Power`, `Confusion`, `Nothing`, or `Disappointment`

  #### Response

  `Status: 200 Okay`

  Responds with all shares that match the query param and gives each the `color` from the coorisponding feeling

  ```json
  [
    {
      "id": 4,
      "audio_share": null,
      "text_share": "EXAMPLE OF GREY CONFUSION",
      "feeling_id": 14,
      "share_type": "Text",
      "emotion": "Confusion",
      "color": "Grey"
    },
    {
      "id": 29,
      "audio_share": null,
      "text_share": "Text Share about confusion",
      "feeling_id": 77,
      "share_type": "Text",
      "emotion": "Confusion",
      "color": "Pink"
    }
  ]
  ```

- ### Find share

  `GET /share/:share_id`
  This returns the share with the associated id from the share table.

  The request takes valid id as a request param

  example:
  `https://ifeelthat-api.herokuapp.com/share/23`

  #### Response

  ```json
    {
      "id": 23,
      "audio_share": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/792366031%3Fsecret_token%3Ds-d720mgO62E7",
      "text_share": null,
      "feeling_id": 123,
      "share_type": "Audio",
      "emotion": "Sadness"
    },
  ```

- ### Update share

  `PATCH /share/:share_id`
  This updates the share with the associated id from the share table.

  #### Parameters

  One is **Required**:

  | Name          | Type     | Description                                                                                                                                                                                                                                   |
  | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `emotion`     | `string` | Value representing the emotion of the user being one of: `Joy`, `Sadness`, `Anger`, `Fear`, `Anxiety`, `Excitement`, `Guilt`, `Gratitude`, `Contentment`, `Shame`, `Loneliness`,`Pride`, `Power`, `Confusion`, `Nothing`, or `Disappointment` |
  | `audio_share` | `string` | Url with a direct link to a soundcloud audio file                                                                                                                                                                                             |
  | `text_share`  | `string` | String from a user, talking about their experiences and emotions                                                                                                                                                                              |
  | `share_type`  | `string` | Type of share that the user has chosen being one of: `Text` or `Audio`                                                                                                                                                                        |
  | `feeling_id`  | `int`    | An id that matches an existing feeling's id                                                                                                                                                                                                   |

  example:

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/share/23`, {
    method: "PATCH",
    body: JSON.stringify({
      text_share: "Updated post text",
      share_type: "Text",
    }),
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### Response

  `Status: 202 Updated`

  ```json
    {
      "id": 23,
      "audio_share": null,
      "text_share": "Updated post text",
      "feeling_id": 123,
      "share_type": "Text",
      "emotion": "Sadness"
    },
  ```

- ### Delete share

  `DELETE /share/:share_id`
  This deletes the share with the associated id from the share table

  The request takes a valid id as a request param.

  example:

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/share/23`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### Response

  `Status 204 No Content`

## Database Seeding Scripts

### For the local database:

- First insert items into "feeling" table: `psql -U carlo -d ifeelthat -f ./seeds/seed.ifeelthat-feeling-table.sql`
- Then insert items into "share" table: `psql -U carlo -d ifeelthat -f ./seeds/seed.ifeelthat-share-table.sql`

### For the test database:

- First insert items into test "feeling" table: `psql -U carlo -d ifeelthattest -f ./seeds/seed.ifeelthat-feeling-table.sql`
- Then insert items into test "share" table: `psql -U carlo -d ifeelthattest -f ./seeds/seed.ifeelthat-share-table.sql`

## Client Endpoints

- "/" landing page that describes the app, its purpuse, and how to use it
- "/breathe" take time to breath identify your emotions
- "/listen" listen and read other peoples experiences around the emotion you identified with
- "/share" share your experience around the emotion you identified with

## Technologies used

This RESTful API was written in Javascript using Node.js with Express.
The database uses PostgreSQL.

The client side app is written in: HTML5, CSS3, Javascript ES6, and JSX.
I used React as a framework and Jest for testing.
