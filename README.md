# How-To Guide

```bash
git clone https://github.com/younes-alturkey/form-api.git
```

```bash
npm i
```

## How To Run

```bash
npm run start
```

Runs on http://localhost:5000.

## How To Use

IMPORTANT NOTE:
First field or FormData append is reserved for the subject of the email and is excluded from the email body.
Second field or FormData append is reserved for the cc list is excluded from the email body. This has to be a JavaScript array of strings. [""]

```bash
var formdata = new FormData();
formdata.append("subject", "Email Subject: New Form Submitted");
formdata.append("cc", "[\"alturkeyy@gmail.com\", \"hi@younes.ninja\", \"younes@bhr.sa\"]");
formdata.append("name", "Younes Alturkey");
formdata.append("email", "hi@younes.ninja");
formdata.append("phone number", "+966538654514");

var requestOptions = {
  method: 'POST',
  body: formdata,
  redirect: 'follow'
};

fetch("https://ya-form-api.herokuapp.com/younes@itsnuqtah.com", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

Or

```bash
<form action="https://ya-form-api.herokuapp.com/submit/[YOUR@EMAIL.COM]" method="POST">
    <input type="text" name="subject" value="[EMAIL_SUBJECT]" style="display: none;"/>
    <input type="text" name="cc" value="[\"[EMAIL@EMAIL.COM]\", \"[EMAIL@EMAIL.COM]\", \"[EMAIL@EMAIL.COM]\"]" style="display: none;"/>
</form>
```

Add your fields after these two.

The form supports file upload.
