<div align="center">
  <br />
  <img src="src/standalone/topbar/assets/logo_isc.png" alt="InterSystemsSwaggerEditor"
  width="60%"
  />
  <h1>InterSystems Swagger Editor</h1>
  <p>
     The <a href = "https://github.com/swagger-api/swagger-editor">Swagger Editor</a> optimized for InterSystems IRIS.
  </p>
</div>

---

* [Swagger Editor](#swagger-editor)
* [Local Installation ](#local-installation-)
* [Connect to IRIS](#connect-to-iris)
* [Create a new IRIS REST API](#create-a-new-iris-rest-api)
* [Load and Update a IRIS REST API Specifcation](#load-and-update-a-iris-rest-api-specifcation)
* [Export](#export)
* [Examples](#examples)

---

## Swagger Editor

This is a fork of the [Swagger Editor 4.9.2](https://github.com/swagger-api/swagger-editor/tree/v4.9.2).

---

## Local Installation 

1. Clone the repo
2. Open the [index.html](./index.html) file in your browser

or run the following command in your terminal to start a local web server:

```bash
npm run dev
```

For more information follow the official instructions [here](https://github.com/swagger-api/swagger-editor/tree/v4.9.2#running-locally).

---

## Connect to IRIS

1. Open the dropdown menu _**IRIS**_ in the top bar.
2. Click on _**Connect...**_.

If an connection could not be established a message will be shown.

> The background color of the _Connect_ button indicates the connection status.

---

## Create a new IRIS REST API

After connecting successfully to your IRIS instance you can create a new REST API. Choose _**Create New...**_ from the dropdown menu under the _Connect_ button and fill in the Namespace and the Name of the new Webapp.

---

## Load and Update a IRIS REST API Specifcation

After connecting successfully to your IRIS instance you can load an existing REST API. Choose the Webapp from the dropdown menu under the _Connect_ button and click on _**Load IRIS specification**_. After the specification is loaded you can edit it and save it back to IRIS by clicking on _**Update IRIS specification**_.

---

## Export

- As Angular Service - Go to `Export` and click `Export as Angular Service` and a typescript file will be downloaded

---

## Examples

Go to the `Edit` to load some examples.

---

By [Andreas S.](https://github.com/a-schuetz) & [Philipp B.](https://github.com/cophilot)

_This application is not supported by InterSystems Corporation. Please be notified that you use it at your own responsibility_
