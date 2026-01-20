const express = require("express");
const  {
  predictCareerDomain,
  predictItCareerController,
} = require("../controllers/careers.controller.js");
const { checkMlHealthFromNode }= require( "../controllers/mlhealth.controller.js");

const router = express.Router();

// STEP 1: Domain prediction
router.post("/domain",  predictCareerDomain);

// STEP 2: IT career prediction
router.post("/it", predictItCareerController);



module.exports = router;
