const Wallet = require('../models/Wallet');

exports.create = (req, res, next) => {
    let { title, address, userId } = req.body;
    let errors = [];
    if (!title) {
        errors.push({ title: "required" });
    }
    if (!address) {
        errors.push({ address: "required" });
    }
    if (!userId) {
        errors.push({ userId: "required" });
    }
    if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
    }
    Wallet.findOne({address: address, userId: userId})
        .then(wallet => {
            if (wallet) {
                return res.status(422).json({ errors: [{ wallet: "address already exists" }] });
            } else {
                const newwallet = new Wallet({
                    title: title,
                    address: address,
                    userId: userId,
                });
                newwallet
                    .save()
                    .then(response => {
                        res.status(200).json({
                            success: true,
                            result: response
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            errors: [{ error: err }]
                        });
                    });
            }
        }).catch(err => {
            res.status(500).json({
                errors: [{ error: 'Something went wrong' }]
            });
        })
}

exports.wallets = async (req, res, next) => {
    let { userId } = req.body;

    Wallet.find({ userId: userId}, function (err, result) {
        if (err) throw err;

        res.json(result);
    })

    // Wallet.find({ userId: userId })
    //     .toArray(function (err, result) {
    //         if (err) throw err;
    //         res.json(result);
    //     })
}