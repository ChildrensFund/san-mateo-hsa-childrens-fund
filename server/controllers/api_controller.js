/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

var Child = require('../config/mysql_config.js').Child;
var Donor = require('../config/mysql_config.js').Donor;
var Staff = require('../config/mysql_config.js').Staff;
var Admin = require('../config/mysql_config.js').Admin;
var HelpDesk = require('../config/mysql_config.js').HelpDesk;
var url = require('url');
var path = require('path');

var parseUrl = function(req){
  var pathname = url.parse(req.url).pathname;
  var array = pathname.split('/');
  return array;
}

var setUserType = function(userPath){
  switch(userPath){
    case 'workers':
      return Staff;
      break;
    case 'children':
      return Child;
      break;
    case 'donors':
      return Donor;
      break;
    default:
      return undefined;
      break;
  }
}

module.exports.fetchUsers = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  User.findAll().success(function(users){
    res.send(users);
  });
};

module.exports.fetchUser = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  User.find({where: {id: userId}}).success(function(user){
    if(!user) res.send(404);
    if(!user) {
      res.send(404);
    } else {
      res.send(user);
    }
  })
}

module.exports.editUser = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  User.find({where: {id: userId}}).success(function(user){
    if(!user){
      res.send(404);
    } else {
      user.updateAttributes(req.body).success(function(user){
        res.send(user);
      });
    }
  });
}

// router.route('/children/:id/worker')
  // .get( controller.fetchChildWorker );
module.exports.fetchChildWorker = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  Child.find({where: {id: userId}}).success(function(child){
    if(!child){
      res.send(404);
    } else {
      child.getStaff().success(function(worker){
        res.send(worker);
      })
    }
  });
};

// router.route('/children/:id/donor')
  // .get( controller.fetchChildDonor )
module.exports.fetchChildDonor = function(req, res){
  var urlArray = parseUrl(req);
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  Child.find({where: {id: userId}}).success(function(child){
    if(!child){
      res.send(404);
    } else {
      child.getDonor().success(function(donor){
        res.send(donor);
      })
    }
  })
};

  // .post( controller.createChildDonor );
module.exports.createChildDonor = function(req, res){
  var urlArray = parseUrl(req);
  var userId = urlArray[2];
  //Find the child
  Child.find({where: {id: userId}}).success(function(child){
    if(!child) res.send(404);
    if(!child){
      res.send(404);
    } else {
      //Create the new donor
      Donor.create(req.body).success(function(donor){
        //Associate child and donor
        child.setDonor(donor).success(function(){
          //Hacky solution -> manually setting donor id on child
          child.donorId = donor.id;
          child.save(['donorId']).success(function(child){
            res.send({child: child, donor: donor});
          })
        })
      })
    }
  });
};

// router.route('/workers/:id/children')
  // .get( controller.fetchWorkerChildren )
module.exports.fetchWorkerChildren = function(req, res){
  var urlArray = parseUrl(req);
  var workerId = urlArray[2];
  Staff.find({where: {id: workerId}}).success(function(worker){
    if(!worker){
      res.send(404);
    } else {
      worker.getChildren().success(function(children){
        res.send(children);
      })
    }
  })
};

  // .post( controller.createWorkerChild );
module.exports.createWorkerChild = function(req, res){
  var urlArray = parseUrl(req);
  var workerId = urlArray[2];
  Staff.find({where: {id: workerId}}).success(function(worker){
    if(!worker) { 
      res.send(404); 
    } else {
      req.body.staffId = workerId;
      Child.create(req.body).success(function(child){
        child.setStaff(worker).success(function(){
          res.send({child: child, worker: worker});
        })
      })
    }
  })
};

// router.route('/donors/:id/children')
//   .get( controller.fetchDonorChildren );
module.exports.fetchDonorChildren = function(req, res){
  var urlArray = parseUrl(req);
  var donorId = urlArray[2];
  Donor.find({where: {id: donorId}}).success(function(donor){
    if(!donor){
      res.send(404);
    } else {
      donor.getChildren().success(function(children){
        res.send(children);
      })
    }
  })
};