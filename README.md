# REST API (Restful API)
Read Article with <a href='https://medium.com/@erangamadhushann956/introduction-about-rest-api-restful-api-e6a375e21ae6'>Medium</a><br/>
Building a Simple REST API using<a href="https://github.com/Erangamadhushan/REST-API-Introduction/tree/main/Simple-Application"> Node.js and Express</a>

#### A REST API is the most common standard used between Clients (a person or application) who want to access information from the web from Servers (application or database) who have access to that information.


<img width="969" height="662" alt="REST-API" src="https://github.com/user-attachments/assets/3406f7c4-bd66-4bcf-9faf-85a35fa4e179" />


An Application Programming Interface (API) is a way for two computers to talk to each other over the web. For example, a delivery app can use the Google Maps API to support location tracking instead of building one from scratch.

An API that follows the REST standard is called RESTful. Here are good practices when designing and using a RESTful API using the example of a survey app.

1. [Basic Format]('/#basic-format')
2. [HTTP verbs]('/#http-verbs')
3. [URL endpoints]('/#url-endpoints')
4. [Status codes]('/#status-codes')

<h2 id="basic-format">1. Basic format</h2>

The format of a RESTful API has three main components:
- URL endpoint
- HTTP verb
- Body

**URL endpoint**: Is a URL link that represents the resources we want to access. Resources can be text, images, documents or any data entry. For example, `example.com/surveys` allows us to view or create survey templates and `example.com/surveys/123/responses` allows us to do the same for all responses of survey 123.

**HTTP verb**: Tells the server what we want to do with the URL endpoint resource. For example, a `POST` request means we want to create a new survey template and a `GET` request means we want to view an existing survey template.

**Body message**: Is an optional custom payload which contains a message with the properties and values we want to use to create or update a given resource.

For example, we want to create a new response for the survey 123 which we captured which includes a positive NPS score of 9, a short feedback message and the unique id of the respondent who gave the feedback.

```js
// Request
POST rest-api.com/surveys/123/responses

// Body payload:
{
	survey_id: 123,
	nps_score: 9,
	feedback: "love the service",
	respondent_id: 42
}
```


The server receives the HTTP request and returns a response that includes a HTTP status code and a response usually in JSON format. Here is an example request and response to a REST API server asking to read all the responses for survey 123:

**Request**:
```js
GET http://example.com/surveys/123/responses
```
**Response**:
```js
// HTTP status code: 200
{
  survey_id: 123,
  survey_title: "nps onboarding survey",
  responses: [
  {
    response_id: 42,
    nps_score: 9,
    feedback: "love the service",
    respondent_id: 42
  }
  ...
 ]
}
```

<h2 id="http-verbs">2. HTTP verbs</h2>

There are 5 basic verb commands when making a HTTP request:

- **GET**: make a read only request to view either a single or list of multiple resources

- **POST**: create a new resource based on the payload given in the body of the request

- **DELETE**: destroy the given resource based on the id provided

- **PUT**: update the entire fields of the resource based on the given body of the request or create a new one if not already exist

- **PATCH**: update only the fields of the resource if it exists

Most applications and resources will support all these commands. This is commonly referred to as a CRUD application:

|Acronym|HTTP verb|
|:-------------|:--------------:|
|Create|POST|
|Read|GET|
|Update|PUT & PATCH|
|Delete|DELETE|

<h2 id="url-endpoints">3. URL endpoints</h2>

A URL endpoint in a RESTful API represents any given object, data or service the API can access. For example, `example.com/surveys` represents the data for all survey templates and `example.com/surveys/123/responses` the data for all responses of a given survey.

URL endpoints should be grouped as pluralised nouns around the business data and objects and not verbs. For example, `example.com/surveys` and not `example.com/getAllSurveys`.

URL endpoints should include the unique identifier as a path after the pluralised noun when viewing, updating or deleting a single item. For example, `example.com/surveys/123`.

Organise URL collections in a logical hierarchy based on relationships. For example, users are most likely to access responses to a given survey template. This would be represented as `example.com/surveys/123/responses`.

Here is a summary of good practice URL endpoints and how they interact with HTTP verbs:

|URL endpoint resource|GET|POST|PUT|DELETE|
|----|----|----|----|----|
|/surveys|Retrieve all surveys|Create a new survey|Bulk update surveys (not advised)|Remove all surveys (not advised)|
|/surveys/123|Retrieve the details for survey 123|Error|Update the details of survey 123 if it exists|Remove survey 123|
|/surveys/123/responses|Retrieve all responses for survey 123|Create a new response for survey 123|Bulk update responses for survey 123 (not advised)|Remove all responses for survey 123 (not advised)|
|/responses/42|Retrieve the details for response 42|Error|Update the details of response 42 if it exists|Remove response 42|


<h2 id="status-codes">4. Status codes</h2>

Upon receiving a HTTP request in the basic RESTful format the server will return a HTTP status code along with any optional JSON payloads. Here are the most common HTTP status codes and their meaning:

|Status code| Meaning|
|----------|---------|
|200 OK|Request was successful|
|301 Moved Permanently|For SEO purposes when a page has been moved and all link equity should be passed through|
|401 Unauthorized|Server requires authentication|
|403 Forbidden|Client authenticated but does not have permissions to view resource|
|404 Not Found|Page not found because no search results or may be out of stock|
|500 Internal Server Error|Server side error. Usually due to bugs and exceptions thrown on the server side code|
|503 Server Unavailable|Server side error. Usually due to a platform hosting, overload and maintenance issue|

Author: Eranga Madhushan<br/>
Resources:<br/>
![Geeksforgeek]('https://www.geeksforgeeks.org/node-js/rest-api-introduction/')

