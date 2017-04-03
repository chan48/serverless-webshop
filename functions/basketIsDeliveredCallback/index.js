var mailgun = require('mailgun-js')({
	apiKey: 'MAILGIN_API_KEY',
	domain: 'MAILGUN_DOMAIN'});

module.exports.handler = function(event, lambdaContext, callback) {

	const basket = JSON.parse(event.body).updatedNode
	console.log(basket)

	if (!basket.isDelivered) {
		return callback(null, {
	      statusCode: 200,
	      body: "nothing to do here"
	    })
	}

	const mailData = {
	  from: 'Serverless Webshop <FROM_EMAIL>',
	  to: basket.user.email,
	  subject: 'Your order is being delivered',
	  text: 'Purchased: ' + basket.items.reduce((a,b) => `${a.name}, ${b.name}`)
	};

	mailgun.messages().send(mailData, function (error, body) {
	  console.log(body);

	  callback(null, {
	      statusCode: 200,
	      body: "Mail sent to customer"
	    })
	});
}