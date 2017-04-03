const stripe = require("stripe")(
  "STRIPE_SECRET_KEY"
);
const Lokka = require('lokka').Lokka;
const Transport = require('lokka-transport-http').Transport;

const client = new Lokka({
  transport: new Transport('https://api.graph.cool/simple/v1/PROJECT_ID')
});

module.exports.handler = function(event, lambdaContext, callback) {

	const basket = JSON.parse(event.body).updatedNode
	console.log(basket)

	if (basket.isPaid) {
		console.log("customer already charged - returning early")
		return callback(null, {
	      statusCode: 200,
	      body: "success, customer already charged"
	    })
	}

	stripe.charges.create({
	  amount: basket.items.reduce((a,b) => a.price+b.price),
	  currency: 'eur',
	  description: 'Purchased: ' + basket.items.reduce((a,b) => `${a.name}, ${b.name}`),
	  source: basket.stripeToken,
	}, (err, charge) => {
	  if (err) {

	  	console.log('something went wrong. We should probably inform support staff!')
	  
	    console.log(err)
	    callback(null, {
	      statusCode: 200,
	      body: "Couln't charge customer"
	    })
	  
	  } else {
	  
	  	console.log('Charge went through - inform fulfillment center')

	    client.mutate(`
	    	{
	      	updateBasket(id: "${basket.id}", isPaid: true) {
		        id
		      }
		    }`
	    ).then(() =>
	    	callback(null, {
		      statusCode: 200,
		      body: "success"
		    }))
	    .catch((e) =>
	    	callback(null, {
		      statusCode: 200,
		      body: `something went wrong: ${e}`
		    }))
	  }
	})
}