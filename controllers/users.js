const Customer = require("../models/customer");
const Product = require("../models/product");
const Invoice = require("../models/invoice");

// Customer Phase
// Add a new customer
exports.postAddCustomerByUserId = async (req, res, next) => {
    try {
        const name = req.body.name;
        const phone_no = req.body.phone_no;
        const email = req.body.email;
        const address = req.body.address;
        // Check if email already exist
        const checkEmail = await Customer.findOne({
            email: email
        });
        if (checkEmail) {
            return res.status(401).json({
                message: 'Email already exist!'
            })
        }
        const newcustomer = await new Customer({
            name: name,
            phone_no: phone_no,
            email: email,
            address: address,
            userId: req.user
        })
        const customer = await newcustomer.save();
        res.status(200).json({
            message: 'Successful',
            customer: customer
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Get all customers
exports.getAllCustomersByUserId = async (req, res, next) => {
    try {
        const customers = await Customer.find({
            userId: req.user._id
        });
        res.status(200).json({
            customers: customers
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Get customer by ID
exports.getCustomerByCustomerId = async (req, res, next) => {
    try {
        const customerId = req.params.customerId;
        console.log(customerId);
        const customer = await Customer.findOne({
            _id: customerId,
            userId: req.user._id
        });
        if (!customer) {
            return res.status(401).json({
                message: "Unable to find customer"
            })
        }
        res.status(200).json({
            customer: customer
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Update customer details by ID
exports.postUpdateCustomerByUserId = async (req, res, next) => {
    try {
        const name = req.body.name;
        const phone_no = req.body.phone_no;
        const email = req.body.email;
        const address = req.body.address;
        const customerId = req.params.customerId
        const customer = await Customer.findOne({
            _id: customerId,
            userId: req.user._id
        });
        if (!customer) {
            return res.status(401).json({
                message: "Customer does not exist"
            })
        }
        customer.name = name;
        customer.phone_no = phone_no;
        customer.email = email;
        customer.address = address;
        const result = await customer.save();

        res.status(200).json({
            message: 'Successful',
            customer: result
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Delete customer by ID
exports.deleteCustomerByCustomerId = async (req, res, next) => {
    try {
        const customerId = req.params.customerId
        const customer = await Customer.findOneAndDelete({
            _id: customerId,
            userId: req.user._id
        });
        if (!customer) {
            return res.status(401).json({
                message: "Unable to delete"
            })
        }
        res.status(200).json({
            message: 'Deleted Successfully'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Product Phase
// Add a new customer
exports.postAddProductByUserId = async (req, res, next) => {
    try {
        const name = req.body.name;
        const cost = req.body.cost;

        const newproduct = await new Product({
            name: name,
            cost: cost,
            userId: req.user
        })
        const product = await newproduct.save();
        res.status(200).json({
            message: 'Successful',
            product: product
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Get all customers
exports.getAllProductsByUserId = async (req, res, next) => {
    try {
        const products = await Product.find({
            userId: req.user._id
        });
        res.status(200).json({
            products: products
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Get customer by ID
exports.getProductByProductId = async (req, res, next) => {
    try {
        const productId = req.params.productId
        const product = await Product.findOne({
            _id: productId,
            userId: req.user._id
        });
        if (!product) {
            return res.status(401).json({
                message: "Unable to find product"
            })
        }
        res.status(200).json({
            product: product
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Update customer details by ID
exports.postUpdateProductByUserId = async (req, res, next) => {
    try {
        const name = req.body.name;
        const cost = req.body.cost;
        const productId = req.params.productId
        const product = await Product.findOne({
            _id: productId,
            userId: req.user._id
        });
        if (!product) {
            return res.status(401).json({
                message: "Product does not exist"
            })
        }
        product.name = name;
        product.cost = cost;
        const result = await product.save();

        res.status(200).json({
            message: 'Successful',
            product: result
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Delete customer by ID
exports.deleteProductByProductId = async (req, res, next) => {
    try {
        const productId = req.params.productId
        const product = await Product.findOneAndDelete({
            _id: productId,
            userId: req.user._id
        });
        if (!product) {
            return res.status(401).json({
                message: "Unable to find product"
            })
        }
        res.status(200).json({
            message: 'Deleted Successfully'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Add a new invoice
exports.postAddInvoice = async (req, res, next) => {
    try {
        const customerId = req.body.customerId;
        const amount_paid = req.body.amount_paid;
        const discount = req.body.discount;
        const status = req.body.status;
        const due_date = req.body.due_date;
        const items = req.body.items;
        let productIdToQuery = []
        items.forEach(data => {
            productIdToQuery.push(data.productId)
        })
        const productObjects = await Product.find().where('_id').in(productIdToQuery).exec();
        let itemsToOrder = []
        productObjects.forEach(product => {
            itemsToOrder.push({
                product: product,
                quantity: getItemQuantity(items, product)

            })
        })
        const total = getTotalAmount(itemsToOrder);
        const customer = await Customer.findById(customerId).exec()
        const newinvoice = new Invoice({
            customer: customer,
            items: itemsToOrder,
            amount_paid: amount_paid,
            total: total,
            discount: discount,
            status: status,
            due_date: due_date,
            userId: req.user
        })
        const invoice = await newinvoice.save();
        res.status(200).json({
            invoice: invoice,
            msg: "success"
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Gets the Quantity of product
function getItemQuantity(items, product) {
    const getFilteredObject = items.find(item => {
        return item.productId == product._id;
    })
    return getFilteredObject.quantity;
}

// Get total amount for invoicce
function getTotalAmount(itemsToOrder) {
    let amount = 0
    itemsToOrder.forEach(item => {
        amount += item.product.cost * item.quantity
    })
    return amount;
}

// Get all invoice  by userId
exports.getAllInvoiceByUserId = async (req, res, next) => {
    try {
        const invoices = await Invoice.find({
            userId: req.user._id
        });
        res.status(200).json({
            invoices: invoices
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Get invoicce by id
// Get customer by ID
exports.getInvoiceByInvoiceId = async (req, res, next) => {
    try {
        const invoiceId = req.params.invoiceId
        const invoice = await Invoice.findOne({
            _id: invoiceId,
            userId: req.user._id
        });
        if (!invoice) {
            return res.status(401).json({
                message: "Unable to find invoice"
            })
        }
        res.status(200).json({
            invoice: invoice
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Get all invoice by customerId
exports.getAllInvoiceByCustomerId = async (req, res, next) => {
    try {
        const customerId = req.params.customerId
        const invoices = await Invoice.find({
            customer: customerId,
            userId: req.user._id
        });
        res.status(200).json({
            invoices: invoices
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}

// Delete invoice by ID
exports.deleteInvoiceByInvoiceId = async (req, res, next) => {
    try {
        const invoiceId = req.params.invoiceId
        const invoice = await Invoice.findOneAndDelete({
            _id: invoiceId,
            userId: req.user._id
        });
        if (!invoice) {
            return res.status(401).json({
                message: "Unable to delete invoice"
            })
        }
        res.status(200).json({
            message: 'Deleted Successfully'
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Sorry, we couldn't complete your request. Please try again in a moment."
        })
    }
}
