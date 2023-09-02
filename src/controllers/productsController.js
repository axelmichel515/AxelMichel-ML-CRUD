const fs = require('fs');
const { unlinkSync, existsSync } = require("fs");
const { readJSON,writeJson } = require("../data/index");
const path = require('path');
const products = readJSON('productsDataBase')

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
	
        const products = readJSON('productsDataBase')
		return res.render('products',{
			products,
			toThousand
		});
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		const product = products.find(product => product.id === +req.params.id);
		return res.render('detail',{
			...product,
			toThousand
		})
	},

	// Create - Form to create
	create: (req, res) => {
		return res.render('product-create-form')
	},
	
	// Create -  Method to store
	store: (req, res) => {
		const products = readJSON('productsDataBase')
        let newProduct = {
			id : products[products.length - 1].id + 1,
			name: req.body.name.trim(),
			price : +req.body.price,
			discount : +req.body.discount,
			category : req.body.category,
			description : req.body.description.trim(),
			image: req.file?req.file.filename:null,
		}
		products.push(newProduct) 

		writeJson(products,'productsDataBase')

		 res.redirect('/products')
	},

	// Update - Form to edit
	edit: (req, res) => {
		const product = products.find(product => product.id === +req.params.id);
		return res.render('product-edit-form',{
			...product
			
		})
	},
	// Update - Method to update
	update: (req, res) => {

		const {name,price,discount,description,category} = req.body;

		const productsModify = products.map(product => {

			if (product.id === +req.params.id){
				req.file && existsSync(`./public/images/products/${products.image}`) && unlinkSync(`./public/images/products/${products.image}`)

			product.name = name.trim();
			product.price = +price;
			product.discount = +discount;
			product.category = category;
			product.description = description.trim();
			product.image = req.file?req.file.filename:product.image;
		  }
		  return product
		})
		
		
		writeJson(productsModify,'productsDataBase')

		return res.redirect("/products");
	},

	// Delete - Delete one product from DB
	destroy : (req, res) => {
		const products = readJSON("productsDataBase");
		const productsModify = products.filter((product) => {
			if (product.id === +req.params.id) {
				existsSync(`./public/img/products/${product.image}`) &&
				unlinkSync(`./public/img/products/${product.image}`);
			}
			return product.id !== +req.params.id;
		
	})
	writeJson(productsModify, "productsDataBase");

    return res.redirect("/products");

}
};

module.exports = controller;