<div align="center">
  <br />
  <img src="src/standalone/topbar/assets/logo_small.svg" alt="InterSystemsSwaggerEditor"
  width="40%"
  />
  <h1>InterSystems Swagger Editor</h1>
  <p>
     The <a href = "https://github.com/swagger-api/swagger-editor">Swagger Editor</a> optimized for InterSystems IRIS.
  </p>
</div>

---

* [Swagger Editor](#swagger-editor)
* [Local Installation ](#local-installation-)
* [Load a IRIS REST API Specifcation](#load-a-iris-rest-api-specifcation)
* [Update a IRIS REST API Specifcation](#update-a-iris-rest-api-specifcation)
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

## Load a IRIS REST API Specifcation

You can directly load a IRIS REST API specifcation from your IRIS instance. Go to the `IRIS` tab and set your connection properties. Then click `Load IRIS specifcation` and the specifcation will be loaded into the Swagger Editor.

> Tip: You can also leave the Webapplication empty to list all available Webapplications for the given namespace or when you leave the Webapplication and Namespace empty all available Webapplications for all available Namespaces will be listed.

---

## Update a IRIS REST API Specifcation

You can update a IRIS REST API specifcation directly from your IRIS instance. Go to the `IRIS` tab and set your connection properties. Then click `Update IRIS specifcation` and the specifcation will be uploaded to your IRIS instance.

> Tip: This way you also can create a new webapplication just by defining a new name in the `Webapplication` field.
---

## Export

- As Angular Service - Go to `Export` and click `Export as Angular Service` and a typescript file will be downloaded

---

## Examples

Go to the `Edit` to load some examples.

---

By [Andreas S.](https://github.com/a-schuetz) & [Philipp B.](https://github.com/phil1436)

_This application is not supported by InterSystems Corporation. Please be notified that you use it at your own responsibility_
