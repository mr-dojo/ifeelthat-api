# Listen/Share API

## Back end API for the Listen/Share app

### This API stores users "feeling" profile and stores/retrives users text and audio posts.

### Links

- Live App: [Click Here](https://ifeelthat-app.now.sh/)

- Live API: [Click Here](https://ifeelthat-api.herokuapp.com/)

- App Repo: [Click Here](https://github.com/mr-dojo/ifeelthat-app)

- API Repo: [Click Here](https://github.com/mr-dojo/ifeelthat-api)

## API endpoints

- ### List all feelings

  `GET /feeling`
  This returns a list of all feeling objects in the feeling table.
  Returns Json with an emotion and color.

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
  | `color`   | `string` | A color string with a valid hex color of 6 digits starting with '#'                                                                                                                                                                             |

  example:

  ```json
  {
    "emotion": "Sadness",
    "color": "#FFFFFF"
  }
  ```

  #### Response

  Returns the newly created feeling object with a unique id

  ```json
    {
      "id": 123,
      "emotion": "Sadness",
      "color": "#FFFFFF"
    },
  ```

- ### "GET /feeling/:id"

  This returns a feeling object with the associated id from the feeling table

  #### INPUT:

  The request takes valid id as a request param

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/feeling/123`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### OUTPUT:

  It returns with the feeling object that matches the request param id.

  ```json
  {
    "id": 123,
    "emotion": "Sadness",
    "color": "#FFFFFF"
  }
  ```

- ### "PATCH /feeling/:id"

  This updates the feeling with the associated id from the feeling table

  #### INPUT:

  The request takes a valid id as a request param and a request body with a JSON object that has either one or both of:

  - An emotion string that matches one of following values; "Joy", "Sadness", "Anger", "Fear", "Anxiety", "Excitement", "Guilt", "Gratitude", "Contentment", "Shame", "Loneliness","Pride", "Power", "Confusion", "Nothing", or "Disappointment"
  - A color string with a valid hex color of 6 digits starting with '#'

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

  #### OUTPUT:

  It returns with the updated feeling object.

  ```json
  {
    "id": 123,
    "emotion": "Sadness",
    "color": "#2C1E1E"
  }
  ```

- ### "DELETE /feeling/:id"

  This deletes the feeling with the associated id from the feeling table

  #### INPUT:

  The request takes a valid id as a request param.

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/feeling/123`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### OUTPUT:

  It returns a status of "204" and no content.

- ### "GET /share"

  This returns a list of all the share objects in the share table.

  #### OUTPUT:

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

- ### "POST /share"

  This adds a new share object to the share table.

  #### INPUT:

  The request takes a valid JSON object with:

  1. Either: (one is required)

  - An "audio_share" string with a direct link to a soundcloud audio file.

  - A "text_share" string.

  2. A "share_type" string of either "Audio" or "Text" (required)
  3. An emotion string that matches one of following values: "Joy", "Sadness", "Anger", "Fear", "Anxiety", "Excitement", "Guilt", "Gratitude", "Contentment", "Shame", "Loneliness","Pride", "Power", "Confusion", "Nothing", or "Disappointment" (required)
  4. A "feeling_id" int that matches an existing feeling id (required)

  ```json
  {
    "audio_share": "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/792366031%3Fsecret_token%3Ds-d720mgO62E7",
    "feeling_id": 123,
    "share_type": "Audio",
    "emotion": "Sadness"
  }
  ```

  #### OUTPUT:

  Returns the newly created share object with a unique id

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

- ### "GET /share/find?emotion=[emotion]"

  returns with all the share objects in the share table
  that match the "emotion" query param along with its coorisponding color

  #### INPUT:

  The request requires a query param called "emotion".
  This is a string that matches one of following values; "Joy", "Sadness", "Anger", "Fear", "Anxiety", "Excitement", "Guilt", "Gratitude", "Contentment", "Shame", "Loneliness","Pride", "Power", "Confusion", "Nothing", or "Disappointment"

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/share/find?emotion=Confusion`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### OUTPUT:

  It returns with an array of share objects that match the query param "emotion" as well as the color of the feeling at the forign key "feeling_id".

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

- ### "GET /share/:id"

  This returns the share with the associated id from the share table.

  #### INPUT:

  The request takes valid id as a request param

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/share/23`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### OUTPUT:

  It returns with the share object that matches the request param id.

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

- ### "PATCH /share/:id"

  This updates the share with the associated id from the share table.

  #### INPUT:

  The request takes a valid id as a request param and a request body with a JSON object that has one or all of:

  - An "audio_share" string with a direct link to a soundcloud audio file.
  - A "text_share" string.
  - A "share_type" string matching either "Audio" or "Text".
  - A "feeling_id" int matching an existing feeling object.

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

  #### OUTPUT:

  It returns with the updated share object.

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

- ### "DELETE /share/:id"

  This deletes the share with the associated id from the share table

  #### INPUT:

  The request takes a valid id as a request param.

  ```javascript
  fetch(`https://ifeelthat-api.herokuapp.com/share/23`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });
  ```

  #### OUTPUT:

  It returns a status of "204" and no content.

## Client Endpoints

- "/" landing page that describes the app, its purpuse, and how to use it
- "/breathe" take time to breath identify your emotions
- "/listen" listen and read other peoples experiences around the emotion you identified with
- "/share" share your experience around the emotion you identified with

### Technologies used

This RESTful API was written in Javascript using Node.js with Express.
The database uses PostgreSQL.

The client side app is written in: HTML5, CSS3, Javascript ES6, and JSX.
I used React as a framework and Jest for testing.
