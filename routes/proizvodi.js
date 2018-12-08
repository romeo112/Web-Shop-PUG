const express = require("express");
const routerP = express.Router();

//bring in Article model
let Proizvod = require("../models/proizvod");

//Access control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please login");
    res.redirect("/users/login");
  }
}

//Get metoda za dodaj proizvod stranicu
routerP.get("/add", ensureAuthenticated, (req, res) => {
  res.render("proizvodi_add");
});

//POST metoda za dodaj proizvod u bazu
routerP.post("/add", (req, res) => {
  req.checkBody("name", "name is required").notEmpty();
  req.checkBody("url", "url is required").notEmpty();
  req.checkBody("price", "price is required").notEmpty();
  req.checkBody("price", "price must be number").isNumeric();
  req
    .checkBody("kolicina", "kolicina is required and must be number")
    .notEmpty();
  req.checkBody("kolicina", "kolicina must be number").isNumeric();

  let errors = req.validationErrors();

  if (errors) {
    res.render("proizvodi_add", {
      errors: errors
    });
  } else {
    let pom = {
      name: req.body.name,
      url: req.body.url,
      price: req.body.price,
      kolicina: req.body.kolicina
    };

    let proizvod = new Proizvod(pom);
    proizvod.save();
    req.flash(
      "success",
      "Proizvod " + proizvod.name + " has been successfully added!!"
    );
    res.redirect("/");
  }
});

//Get metoda za Edit
routerP.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Proizvod.findById(req.params.id, (err, proizvod) => {
    res.render("proizvodi_edit", {
      proizvod: proizvod
    });
  });
});

//Edit proizvod with given id POST metoda
routerP.post("/edit/:id", (req, res) => {
  req.checkBody("name", "name is required").notEmpty();
  req.checkBody("url", "url is required").notEmpty();
  req.checkBody("price", "price is required").notEmpty();
  req.checkBody("price", "price must be number").isNumeric();
  req
    .checkBody("kolicina", "kolicina is required and must be number")
    .notEmpty();
  req.checkBody("kolicina", "kolicina must be number").isNumeric();

  let errors = req.validationErrors();
  let id = req.params.id;

  if (errors) {
    Proizvod.findById(id, function(err, proizvod) {
      if (err) {
        console.error("error, no entry found");
        res.redirect("/");
      } else {
        res.render("proizvodi_edit", {
          proizvod: proizvod,
          errors: errors
        });
      }
    });
  } else {
    Proizvod.findById(id, function(err, proizvod) {
      if (err) {
        console.error("error, no entry found");
        res.redirect("/");
      } else {
        proizvod.name = req.body.name;
        proizvod.url = req.body.url;
        proizvod.price = req.body.price;
        proizvod.kolicina = req.body.kolicina;
        proizvod.save();
        req.flash(
          "success",
          "Proizvod " +
            proizvod.name +
            " has been successfully edited with new params!!"
        );
        res.redirect("/");
      }
    });
  }
});

//Delete article delete metoda koja ce odraditi posao hehe
routerP.delete("/delete/:id", (req, res) => {
  let id = req.params.id;
  Proizvod.findByIdAndRemove(id, err => {
    if (err) console.log(err);
    else {
      res.send("success");
    }
  });
});

//O nama Get metoda, kad treba da se dodje na ovu stranicu.
routerP.get("/informacije", (req, res) => {
  res.render("oNama");
});

module.exports = routerP;
