const db = require('./../models/index');

const dbFuncs = {};

dbFuncs.getPalaces = (req, res, next) => {
  console.log('getting palaces');
  db.Palace.findAll({where: {UserId: req.user.id}}).then(palaces => { 
    console.log(palaces);
    res.send(palaces, 200);
  })
}  

dbFuncs.newPalace = (req, res, next) => {  
  const palace = req.query.palace; 
  const img = req.query.img; 
  const topic = req.query.topic; 
  // console.log("IDDDDD", req.user.id);
  console.log
  db.Palace.create({name: palace, UserId: req.user.id, img:img, topic:topic})
    .then(() =>
      res.status(200).send('success')
    );
}

dbFuncs.getPalace = (req, res, next) => { 
  const palace = req.query.palace;
  db.Palace.findAll({where: {UserId: req.user.id, name: palace}}).then(palace => { // not testing this yet 
    // console.log(palaces);
    res.send(palace);
    console.log("IDDDD", palace.id);
    res.cookie('palaceId', palace.id);
  })
}

dbFuncs.getNodes = (req, res, next) => {

}

dbFuncs.searchForUser = (id, cb) => {
  const email1 = id.emails;
  // console.log('our email: ', email1);
  // const displayName = req.query.displayName;
  db.User.findOne({where: {email: email1}})
    .then(user => {
      // console.log('this: ', user);
      if (user) cb(null, user);
      else cb(void 0);
    })
}


module.exports = dbFuncs;
