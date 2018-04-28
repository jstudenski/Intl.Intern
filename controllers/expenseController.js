const db = require('../models');


module.exports = {
  findAll: function(req, res) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      db.Expense
        .find(req.query)
        // .find({})
        .sort({ date: -1 })
        .then(dbModel => res.json(dbModel))
        .catch(err => res.status(422).json(err));
    }
  },
  findById: function(req, res) {
    db.Expense
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      console.log('Create: ', req.body)
      // const data = Object.apply({}, req.body);
      // data.user
      db.Expense
        .create(req.body)
        .then(dbModel => {
          res.json(dbModel);
          db.User.update({_id: req.user._id}, {$push: {expRef: dbModel._id}})
            .then(result=> console.log("response when adding expense to user", result))
            .catch(err => console.log("error when adding expense to user", err))
        })
        .catch(err => res.json({error: true, err}))
  
    }
    else {
      return res.status(401).json({error: true, "message": "User not authenticated"})
    }

    // console.log('Create: ', req.body)
    // db.Expense
    //   .create(req.body)
    //   .then(dbModel => res.json(dbModel))
    //   .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Expense
      .findOneAndUpdate({ _id: req.params.id }, req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Expense
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  }
};