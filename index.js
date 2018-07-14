const { Plugin } = require('jovo-framework');
const request = require('request');

const jovoLogo16x16URL = 'https://raw.githubusercontent.com/jovotech/jovo-framework-nodejs/master/docs/img/jovo-logo-16x16.png';

class SlackError extends Plugin {
    constructor(options) {
        super(options);
        this.webhookURL = options.webhookURL;
        this.channel = options.channel || '',
        this.fallback = options.fallback || 'Error Message';
        this.color = options.color || '#ff0000';
        this.pretext = options.pretext || '' 
        this.author_name = options.author_name || ''
        this.author_link = options.author_link || '';
        this.author_icon = options.author_icon || '';
        this.title = options.title || 'Your Skill received a CanFulfillIntentRequest',
        this.title_link = options.title_link || '';
        this.text = options.text || '';
        this.image_url = options.image_url || '';
        this.thumb_url = options.thumb_url || '';
        this.footer = options.footer || 'Jovo Plugin - Slack CanFulfillRequest';
        this.footer_icon = options.footer_icon || jovoLogo16x16URL;
    }

    init() {
        const { app } = this;
        app.on('request', (jovo) => {
            if (jovo.getPlatform().getRequestType() === 'CAN_FULFILL_INTENT') {
                let log = this.createLog(jovo);
                this.sendRequest(log);
            }
        });
    }

    /**
        * Creates log object
        * @param {String} errorType 
        * @returns {*}
        */
    createLog(jovo) {
        let log = {
            "channel": this.channel,
            "attachments": [
                {
                    "fallback": this.fallback,
                    "color": this.color,
                    "pretext": this.pretext,
                    "author_name": this.author_name,
                    "author_link": this.author_link,
                    "author_icon": this.author_icon,
                    "title": this.title,
                    "title_link": this.title_link,
                    "text": this.text,
                    "image_url": this.image_url,
                    "thumb_url": this.thumb_url,
                    "footer": this.footer,
                    "footer_icon": this.footer_icon,
                    "fields": [
                        {
                            "title": "UserID",
                            "value": jovo.getUserId(),
                            "short": false
                        },
                        {
                            "title": "Timestamp",
                            "value": jovo.getTimestamp(),
                            "short": true
                        },
                        {
                            "title": "Locale",
                            "value": jovo.getLocale(),
                            "short": true
                        },
                        {
                            "title": "Intent",
                            "value": jovo.getIntentName(),
                            "short": false
                        },
                    ]
                }
            ]
        }
        let inputs = jovo.getPlatform().getInputs();
        let counter = 1
        for (let key in inputs) {
            let temp = {
                "title": `Slot ${counter}`,
                "value": `Slot: ${inputs[key].name} | Value: ${inputs[key].value}`,
                "short": true,
            };
            counter++;
            log.attachments[0].fields.push(temp);
        }
        return log;
    }

    sendRequest(body) {
        request({
            url: this.webhookURL,
            method: 'POST',
            json: true,
            body: body
        }, function (error, response, body) {
            if (error) {
                console.log(error);
            }
        });
    }
}

module.exports = SlackError;

