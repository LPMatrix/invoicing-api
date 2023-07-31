const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
    customer: {
        type : Schema.Types.ObjectId,
        ref : 'Customer',
        required : true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    amount_paid: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    due_date : {
        type : Date
    },
    status: {
        type: String,
        default: "completed",
        enum: ['draft', 'completed']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    added_on : {
        type : Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Invoice", invoiceSchema);