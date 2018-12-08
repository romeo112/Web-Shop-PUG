const express = require("express");
const routerK = express.Router();

//bring in Article model
let Proizvod = require("../models/proizvod");
let Korpa = require("../models/korpa");

//Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}

//OKO KORPE SVE

//Buy all items in Korpa and show the total price
routerK.get("/kupi", ensureAuthenticated, (req, res) => {
  let fullPrice = 0;

  Korpa.find({}, (err, items) => {
    if (err) {
      console.log(err);
    } else {
      for (var i in items) {
        fullPrice += items[i].itemPrice;
      }
      res.render("buy", {
        price: fullPrice
      });
    }
  });
});

//Delete all items in Korpa
routerK.get("/removeAll", ensureAuthenticated, (req, res) => {
  Korpa.remove({}, function(err, result) {
    if (err) {
      console.log(err);
      res.redirect("/");
    }
    req.flash("success", "All products in korpa have been removed!");
    res.redirect("/");
  });
});

//Dodaj proizvod u korpu
routerK.get("/add/:id", ensureAuthenticated, (req, res) => {
  Proizvod.findOne({ _id: req.params.id }, function(err, proizvod) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      let pom = {
        itemName: proizvod.name,
        itemUrl: proizvod.url,
        itemPrice: proizvod.price
      };
      let korpa = new Korpa(pom);
      if (proizvod.kolicina > 0 && proizvod.kolicina !== null) {
        proizvod.kolicina--;
        proizvod.save();
        korpa.save();
        req.flash(
          "success",
          "Upspjesno dodat proizvod " + proizvod.name + " u korpu!"
        );
        res.redirect("/");
      } else res.redirect("/");
    }
  });
});

//Delete item in Korpa
routerK.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  Korpa.findByIdAndRemove(id, err => {
    if (err) console.log(err);
    else {
      res.send("success");
    }
  });
});

module.exports = routerK;
