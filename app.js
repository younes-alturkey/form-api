require('dotenv').config()
const sgMail = require('@sendgrid/mail')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const cors = require('cors')
const express = require('express')
const { htmlUpperPart, htmlLowerPart } = require('./template')
const app = express()
const { PORT, SENDGRID_API_KEY } = process.env
const appPort = PORT || 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())
app.use(cors())

sgMail.setApiKey(SENDGRID_API_KEY)

app.post('/submit/:email', (req, res) => {
    const { body, params } = req

    let filesToSend = []
    if (req.files) {
        const { files } = req
        const fileNames = Object.keys(files)
        fileNames.map(file => {
            filesToSend.push(files[file])
        })
    }

    const { email } = params
    const keys = Object.keys(body)
    const name = body[keys[0]]

    let htmlMiddlePart = ``

    for (let i = 0; i < keys.length; i++) {
        if (!body[keys[i]]) continue

        const p = ` <div
        class="layout fixed-width stack"
        style="
            margin: 0 auto;
            max-width: 600px;
            min-width: 320px;
            width: 320px;
            width: calc(28000% - 167400px);
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
        "
    >
        <div
            class="layout__inner"
            style="
                border-collapse: collapse;
                display: table;
                width: 100%;
                background-color: #ffffff;
            "
        >
            <div
                class="column narrow"
                style="
                    text-align: left;
                    color: #757575;
                    font-size: 14px;
                    line-height: 21px;
                    font-family: Roboto, Tahoma,
                        sans-serif;
                    float: left;
                    max-width: 320px;
                    min-width: 200px;
                    width: 320px;
                    width: calc(72200px - 12000%);
                "
            >
                <div
                    style="
                        margin-left: 20px;
                        margin-right: 20px;
                        margin-top: 24px;
                        margin-bottom: 24px;
                    "
                >
                    <div
                        style="
                            mso-line-height-rule: exactly;
                            mso-text-raise: 11px;
                            vertical-align: middle;
                        "
                    >
                        <p
                            class="size-16"
                            style="
                                margin-top: 0;
                                margin-bottom: 0;
                                font-family: Ubuntu,
                                    sans-serif;
                                font-size: 16px;
                                line-height: 24px;
                            "
                            lang="x-size-16"
                        >
                            <span
                                class="font-ubuntu"
                                style="
                                    text-decoration: inherit; text-transform: capitalize;
                                "
                                ><strong
                                    >${keys[i]}:</strong
                                ></span
                            >
                        </p>
                    </div>
                </div>
            </div>

            <div
                class="column wide"
                style="
                    text-align: left;
                    color: #757575;
                    font-size: 14px;
                    line-height: 21px;
                    font-family: Roboto, Tahoma,
                        sans-serif;
                    float: left;
                    max-width: 400px;
                    min-width: 320px;
                    width: 320px;
                    width: calc(8000% - 47600px);
                "
            >
                <div
                    style="
                        margin-left: 20px;
                        margin-right: 20px;
                        margin-top: 24px;
                        margin-bottom: 24px;
                    "
                >
                    <div
                        style="
                            mso-line-height-rule: exactly;
                            mso-text-raise: 11px;
                            vertical-align: middle;
                        "
                    >
                        <p
                            style="
                                margin-top: 0;
                                margin-bottom: 0;
                                font-family: Ubuntu,
                                    sans-serif;
                            "
                        >
                            <span
                                class="font-ubuntu"
                                style="
                                    text-decoration: inherit;
                                "
                                >${body[keys[i]]}</span
                            >
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div
        style="
            mso-line-height-rule: exactly;
            line-height: 20px;
            font-size: 20px;
        "
    >
        &nbsp;
    </div>`

        htmlMiddlePart += p
    }

    const html = htmlUpperPart + htmlMiddlePart + htmlLowerPart

    let msg
    if (filesToSend) {
        msg = {
            to: `${email}`,
            from: 'hi@younes.ninja',
            subject: `New Form Submitted: ${name}`,
            html: `${html}`,
            attachments: filesToSend.map(file => {
                return {
                    filename: file.name,
                    type: file.mimetype,
                    content: new Buffer.from(file.data).toString('base64'),
                    disposition: 'attachment',
                }
            }),
        }
    } else {
        msg = {
            to: `${email}`,
            from: 'hi@younes.ninja',
            subject: `New Form Submitted: ${name}`,
            html: `${html}`,
        }
    }

    sgMail
        .send(msg)
        .then(() => {
            console.log(`SendGrid sent an email to ${email}\n`)
        })
        .catch(error => {
            console.error(error)
        })

    res.end()
})

app.listen(appPort, () => {
    console.log(`Listening on port ${appPort}\n`)
})
