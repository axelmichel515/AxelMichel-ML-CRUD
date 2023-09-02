const fs = require('fs');
const path = require('path');
const { readJSON} = require("../data/index");

const products = readJSON('productsDataBase')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {
		 res.render('index',{
			productsVisited : products.filter(product => product.category === "visited"),
			productsSale : products.filter(product => product.category === "in-sale"),
		    toThousand
		});
	},
	search: (req, res) => {

        const results = products.filter(product => product.name.toLowerCase().includes(req.query.keywords.toLowerCase()))

		return res.render('results',{
			results,
			toThousand,
			keywords:req.query.keywords
		})
	},
};

module.exports = controller;
