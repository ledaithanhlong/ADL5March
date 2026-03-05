var express = require("express");
var router = express.Router();
let { dataUser, dataRole } = require("../utils/data2");
let { getItemById, getUserByUsername } = require("../utils/idHandler");

/* GET all users */
router.get("/", function (req, res, next) {
  let result = dataUser.filter(function (e) {
    return !e.isDeleted;
  });
  res.send(result);
});

/* GET user by username */
router.get("/:username", function (req, res, next) {
  let username = req.params.username;
  let result = dataUser.filter(function (e) {
    return e.username == username && !e.isDeleted;
  });
  if (result.length) {
    res.send(result[0]);
  } else {
    res.status(404).send({
      message: "USERNAME NOT FOUND",
    });
  }
});

/* CREATE new user */
router.post("/", function (req, res) {
  // Check if username already exists
  let existingUser = getUserByUsername(req.body.username, dataUser);
  if (existingUser) {
    res.status(400).send({
      message: "USERNAME ALREADY EXISTS",
    });
    return;
  }

  // Check if role exists
  let getRole = getItemById(req.body.roleId, dataRole);
  if (!getRole) {
    res.status(404).send({
      message: "ROLE ID NOT FOUND",
    });
    return;
  }

  let newUser = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    fullName: req.body.fullName,
    avatarUrl: req.body.avatarUrl || "https://i.sstatic.net/l60Hf.png",
    status: req.body.status !== undefined ? req.body.status : true,
    loginCount: 0,
    role: {
      id: getRole.id,
      name: getRole.name,
      description: getRole.description,
    },
    creationAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  };
  dataUser.push(newUser);
  res.send(newUser);
});

/* UPDATE user */
router.put("/:username", function (req, res) {
  let username = req.params.username;
  let result = dataUser.filter(function (e) {
    return e.username == username && !e.isDeleted;
  });
  if (result.length) {
    result = result[0];

    // If roleId is being updated, validate it exists
    if (req.body.roleId) {
      let getRole = getItemById(req.body.roleId, dataRole);
      if (!getRole) {
        res.status(404).send({
          message: "ROLE ID NOT FOUND",
        });
        return;
      }
      result.role = {
        id: getRole.id,
        name: getRole.name,
        description: getRole.description,
      };
    }

    // Update other fields
    if (req.body.password) result.password = req.body.password;
    if (req.body.email) result.email = req.body.email;
    if (req.body.fullName) result.fullName = req.body.fullName;
    if (req.body.avatarUrl) result.avatarUrl = req.body.avatarUrl;
    if (req.body.status !== undefined) result.status = req.body.status;
    if (req.body.loginCount !== undefined)
      result.loginCount = req.body.loginCount;

    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({
      message: "USERNAME NOT FOUND",
    });
  }
});

/* DELETE user */
router.delete("/:username", function (req, res) {
  let username = req.params.username;
  let result = dataUser.filter(function (e) {
    return e.username == username && !e.isDeleted;
  });
  if (result.length) {
    result = result[0];
    result.isDeleted = true;
    result.updatedAt = new Date(Date.now());
    res.send(result);
  } else {
    res.status(404).send({
      message: "USERNAME NOT FOUND",
    });
  }
});

module.exports = router;
