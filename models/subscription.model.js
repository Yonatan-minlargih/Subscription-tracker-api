import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Subscription Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Subscription Price is required'],
        min: [0, 'Price must be greater than 0'],
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP', 'Birr'],
        default: 'Birr',
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['sports','news','entertainment','lifestyle','technology', 'finance','finance','politics', 'other'],
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status:{
        type: String,
        enum: ['active','cancelled','expired'],
        default: 'active',
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: 'Start Date must be in the past',
        }
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) { 
                return value > this.startDate
            },
            message: 'Renewal Date must be after start date',
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
},{ timestamps: true });

//auto calculate renewal date
subscriptionSchema.pre('save', function(next) {
    if(!this.renewalDate){
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };

        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    //auto-update status if renewal date is in the past
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);
export default Subscription;