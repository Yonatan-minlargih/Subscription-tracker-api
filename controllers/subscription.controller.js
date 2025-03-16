import Subscription from '../models/subscription.model.js';

export const createSubscription = async (req, res, next) => { 
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });


        res.status(201).json({success: true, data: subscription}); 
    } catch (error) {
        next(error);
    }
}

export const getSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id !== req.params.userId) {
            //check if the user is the same as the one in the token
            const error = new Error('You are not the owner of this account');
            error.statusCode = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({user: req.params.userId});

        res.status(200).json({success: true, data: subscriptions});
    } catch (e) {
        next(e);
    }
}