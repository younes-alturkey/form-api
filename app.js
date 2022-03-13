require('dotenv').config()
const sgMail = require('@sendgrid/mail')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()
const { PORT, SENDGRID_API_KEY } = process.env
const appPort = PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

sgMail.setApiKey(SENDGRID_API_KEY)

app.post('/submit/:email', (req, res) => {
    const { body, params } = req
    const { email } = params
    const keys = Object.keys(body)
    const name = body[keys[0]]
    let html = ''

    for (let i = 0; i < keys.length; i++) {
        const p = `<div style="padding: 0.3em 1em;"><p style="margin: 0; font-size: 1.2rem; color: #141C18; font-weight: bold; text-transform: uppercase;">${
            keys[i]
        }</p><p style="margin: 0; margin-bottom: 1em; font-size: 1rem; color: #FF1C3B;">${
            body[keys[i]]
        }</p></div>`

        html += p
    }

    html += `<p
    style="
        padding: 0.3em 1em;
        margin-top: 1.5em;
        font-size: 0.8rem;
        color: #0a0e0c;
    "
>
    Via
    <a
        href="https://github.com/younes-alturkey/form-api"
        target="_blank"
        style="text-decoration: none; color: #ff1c3b;"
        >Form API
    </a> by <a style="color: #ff1c3b; font-weight: 400; text-decoration: none" href="https://www.younesalturkey.sa"
    target="_blank">Younes ❤</a>.
</p>`

    const msg = {
        to: `${email}`,
        from: 'hi@younesalturkey.sa',
        subject: `New Form Submission: ${name}`,
        html: `${html}`,
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log(`SendGrid sent an email submitted by ${email}\n`)
        })
        .catch(error => {
            console.error(error)
        })

    res.end()
})

app.listen(appPort, () => {
    console.log(`Listening on port ${appPort}\n`)
})
