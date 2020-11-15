const { Telegraf } = require('telegraf')
const axios = require('axios')
const regex = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
const set = require('./settings')
const bot = new Telegraf(set.bot_api_key)

bot.start(async(ctx) => {
    ctx.replyWithHTML("<em>Welcome to <b>GPLinks Bot 🔗</b></em>\n\n<code>Send a Link to Shorten it with Gplinks.</code>\n\n/help for more info")
})
bot.command('help', (ctx) => ctx.replyWithHTML("💁‍♂️ Send a Link To Shorten it with Gplinks.\n\n<b><u>Example</u> 👇</b>\n\n<code>https://thetuhin.com</code>\n\n<code>If you have encountered any issue kindly report it at </code>@t_projects"));

bot.on('message', async(ctx) => {
    var message = ctx.message.text
    if (message == undefined) {
        ctx.replyWithHTML("<b>🙇‍♂️ Sorry,</b>\n\n<code>You are sending file. Send a valid Link to Shorten it with Gplinks.</code>\n\n/help for more info")
    } else if (!regex.test(message)) {
        ctx.replyWithHTML("<b>🙇‍♂️ Sorry,</b>\n\n<code>You are sending an invalid link kindly recheck and send again</code>\n\n/help for more info")
    } else {
        var config = {
            method: 'get',
            url: `https://gplinks.in/api?api=${set.gplinks_api_key}&url=${message}`
        };

        axios(config)
            .then(async function(response) {
                var data = response.data
                if (data.status == "success") {
                    ctx.replyWithHTML(`🔗 <b>Url Shortened Successfully</b>.\n\n<i>Shortened Url (Tap to Copy):</i>\n<code>${data.shortenedUrl}</code>`)
                } else if (data.status == "error" && data.status == "URL is invalid.") {
                    ctx.replyWithHTML("<b>🙇‍♂️ Sorry,</b>\n\n<code>You are sending an invalid link kindly recheck and send again</code>\n\n/help for more info")
                } else {
                    ctx.replyWithHTML("<b>🙇‍♂️ Sorry,</b>\n\n<code>An error occured Please Send the Link Again</code>\n\n/help for more info")
                }
            })
            .catch(function(error) {
                console.log(error)
                ctx.replyWithHTML("<b>🙇‍♂️ Sorry,</b>\n\n<code>An unexpected error occurred. Kindly try again.</code>\n\nIf the problem persists kindly report it at @t_projects")
            })
    }
})

bot.launch()