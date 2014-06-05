/*jslint node: true */
'use strict';

/*  This file contains the logic for handling requests submitted with the /donor
 *  path.  */
//    This file is required by (root folder)/server/routes/donor_routes.js

// NOTE: Sequelize has a strange promise implementation, can possibly refactor to bluebird, but
// for now it'll look a bit messy because every error has to be handled (no way to propagate
// promise chain using return new Promise)

var Child = require('../config/mysql_config.js').Child;
var Donor = require('../config/mysql_config.js').Donor;
var Staff = require('../config/mysql_config.js').Staff;
var Admin = require('../config/mysql_config.js').Admin;
var HelpDesk = require('../config/mysql_config.js').HelpDesk;
var Sequelize = require('sequelize');
var sequelize = require('../config/mysql_config.js').sequelize;
var url = require('url');
var path = require('path');
var nodemailer = require('nodemailer');
var fs = require('fs');

var parseUrl = function(req){
  var pathname = url.parse(req.url).pathname;
  var array = pathname.split('/');
  if(url.parse(req.url).query){
    var page = url.parse(req.url).query.split('=')[1];
    var query = url.parse(req.url).query.split('=')[2];
  }
  return {
    pathArray: array,
    page: page,
    query: query
  };
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
  var page = parseUrl(req).page;
  var query = parseUrl(req).query;
  var urlArray = parseUrl(req).pathArray;
  var User = setUserType(urlArray[1]);
  var sqlQuery;
  query ? sqlQuery = ["lastName LIKE '" + query + "%'"] : '';

  if(User === Child){
    sqlQuery = ['status=0'];
  }

  User.findAndCountAll({
    where: sqlQuery,
    limit: 20,
    offset: (20 * (page-1))
  }).success(function(results){
    var array = results.rows;
    //If User is children, we need to sanitize these rows before we do anything because
    //this JSON will be passed back to clients at the root
    if(User === Child){
      console.log('child detected, sanitizing output');
      array = Sequelize.Utils._.map(results.rows, function(child){
        return {
          id: child.id,
          image: child.image,
          createdAt: child.createdAt,
          firstName: child.firstName,
          location: child.location,
          status: child.status,
          age: child.age,
          bio: child.bio,
          firstItemPrice: child.firstItemPrice,
          firstItemName: child.firstItemName,
          secondItemPrice: child.secondItemPrice,
          secondItemName: child.secondItemName,
          thirdItemPrice: child.thirdItemPrice,
          thirdItemName: child.thirdItemName
        }
      })
    }
    array.unshift(results.count);
    res.send(array);
  });
};

module.exports.fetchUser = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  User.find({where: {id: userId}}).success(function(user){
    if(!user) {
      res.send(404);
    } else {
      if(User === Staff){
        var sanitizedStaff = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          department: user.department,
          supervisorFirstName: user.supervisorFirstName,
          supervisorLastName: user.supervisorLastName,
          coordinatorFirstName: user.coordinatorFirstName,
          coordinatorLastName: user.coordinatorLastName
        }
        res.send(sanitizedStaff);
      } else {
        res.send(user);
      }
    }
  }).error(function(err){
    res.send(500);
  })
}

module.exports.editUser = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  User.find({where: {id: userId}}).success(function(user){
    if(!user){
      res.send(404);
    } else {
      user.updateAttributes(req.body).success(function(user){
        res.send(user);
      }).error(function(err){
        res.send(500);
      });
    }
  }).error(function(err){
    res.send(500);
  });
}

// router.route('/children/:id/worker')
  // .get( controller.fetchChildWorker );
module.exports.fetchChildWorker = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  Child.find({where: {id: userId}}).success(function(child){
    if(!child || child.staffId === null){
      res.send(404);
    } else {
      Staff.find({where: {id: child.staffId}}).success(function(worker){
        worker.passwordHash = 'protected';
        worker.sessionToken = 'protected';
        worker.resetToken = 'protected';
        worker.resetTokenSetTime = 'protected';
        res.send(worker);
      }).error(function(err){
        res.send(500);
      })
    }
  }).error(function(err){
    res.send(500);
  });
};

// router.route('/children/:id/donor')
  // .get( controller.fetchChildDonor )
module.exports.fetchChildDonor = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var User = setUserType(urlArray[1]);
  var userId = urlArray[2];
  Child.find({where: {id: userId}}).success(function(child){
    if(!child){
      res.send(404);
    } else {
      Donor.find({where: {id: child.donorId}}).success(function(donor){
        res.send(donor);
      }).error(function(err){
        res.send(500);
      })
    }
  }).error(function(err){
    res.send(500);
  })
};

var itemsTotal = function itemsTotal (childObj) {
  var total = 0;
  if (childObj.firstItemPrice !== undefined) {
    total += Number(childObj.firstItemPrice);
  }
  if (childObj.secondItemPrice !== undefined) {
    total += Number(childObj.secondItemPrice);
  }
  if (childObj.thirdItemPrice !== undefined) {
    total += Number(childObj.thirdItemPrice);
  }
  return total;
};

var donorMailer = function donorMailer (reqBody, childObj) {
  var transport = nodemailer.createTransport("Direct", {debug: true});
  var htmlString = '';
  var totalDonation = itemsTotal(childObj);

  if (reqBody.paymentMethod === 'cash') {
    htmlString += '<p>Dear ' + reqBody.firstName + ',</p><div style="margin-left: 20px"><p>Thank you for making a cash donation to the County of San Mateo\'s Children\'s Fund.</p><p>Please mail or drop-off cash in the amount of <strong>$' + totalDonation + '</strong> to:</p><p style="margin-left: 20px">Children\'s Fund<br/>1 Davis Drive<br/>Belmont, CA 94002<br/></p><p>For your records, please keep your donation number in a safe place:</p><H2>' + childObj.cfid + '</H2><p>This number will allow you to receive your tax benefit.</p><p>If you have any questions, please contact us at <a href="mailto:childrensfund@smchsa.org">childrensfund@smchsa.org</a> or by phone at (650) 802-5152</p><br/><p>Thank you again,</p><p>County of San Mateo</p><p>Children\'s Fund</p></div>';
  } else if (reqBody.paymentMethod === 'chech') {
    htmlString += '<p>Dear ' + reqBody.firstName + ',</p><div style="margin-left: 20px"><p>Thank you for making a donation to the County of San Mateo\'s Children\'s Fund.</p><p>Please make your check payable for the amount of <strong>$' + totalDonation + '</strong> to: <strong>"Children\'s Fund"</strong></p><p>Checks can be mailed to:</p><p style="margin-left: 20px">Children\'s Fund<br/>1 Davis Drive<br/>Belmont, CA 94002<br/></p><p>For your records, please keep your donation number in a safe place:</p><H2>' + childObj.cfid + '</H2><p>This number will allow you to receive your tax benefit.</p><p>If you have any questions, please contact us at <a href="mailto:childrensfund@smchsa.org">childrensfund@smchsa.org</a> or by phone at (650) 802-5152</p><br/><p>Thank you again,</p><p>County of San Mateo</p><p>Children\'s Fund</p></div>';
  } else {
    htmlString += '<p>Dear ' + reqBody.firstName + ',</p><div style="margin-left: 20px"><p>Thank you for making a donation to the County of San Mateo\'s Children\'s Fund.</p><p>Please purchase and <strong>include copies of your receipts</strong> for the following products:</p><ul><li>'+ childObj.firstItemName +': '+ childObj.firstItemPrice +'</li><li>'+ childObj.secondItemName +': '+ childObj.secondItemPrice +'</li><li>'+ childObj.thirdItemName +': '+ childObj.thirdItemPrice +'</li></ul><p>Items can be mailed or dropped off to:</p><p style="margin-left: 20px">Children\'s Fund<br/>1 Davis Drive<br/>Belmont, CA 94002<br/></p><strong>Please include the following number with your package of items:</strong><H2>' + childObj.cfid + '</H2><p>This number will allow you to receive your tax benefit.</p><p>If you have any questions, please contact us at <a href="mailto:childrensfund@smchsa.org">childrensfund@smchsa.org</a> or by phone at (650) 802-5152</p><br/><p>Thank you again,</p><p>County of San Mateo</p><p>Children\'s Fund</p></div>';
  }

  
  var message = {
    from: 'San Mateo\'s Children\'s Fund - Donor Confirmation <childrensfund@smchsa.org>',
    to: '"" <' + reqBody.email + ' >',
    subject: 'San Mateo\'s Children\'s Fund - Donor Confirmation',
    html: htmlString
  };

  transport.sendMail(message, function(error, response){
    if (error) {
      console.log(error.message);
      console.log('(Donor confirmation message) Error!');
    } else {
      console.log(response);
      console.log('(Donor confirmation message) Success!');
    }
  });
};

  // .post( controller.createChildDonor );
module.exports.createChildDonor = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var userId = urlArray[2];
  //Find the child
  Child.find({where: {id: userId}}).success(function(child){
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


            donorMailer(req.body, child);


            res.send({child: child, donor: donor});
          }).error(function(err){res.send(500);});
        }).error(function(err){res.send(500);});
      }).error(function(err){res.send(500);});
    }
  }).error(function(err){res.send(500);});
};

// router.route('/workers/:id/children')
  // .get( controller.fetchWorkerChildren )
module.exports.fetchWorkerChildren = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var workerId = urlArray[2];
  Staff.find({where: {id: workerId}}).success(function(worker){
    if(!worker){
      res.send(404);
    } else {
      worker.getChildren().success(function(children){
        var sanitizedChildren = Sequelize.Utils._.map(children, function(child){
          return {
            createdAt: child.createdAt,
            image: child.image,
            firstName: child.firstName,
            firstItemName: child.firstItemName,
            lastName: child.lastName,
            firstItemPrice: child.firstItemPrice,
            phone: child.phone,
            firstItemHsaReceivedDate: child.firstItemHsaReceivedDate,
            gender: child.gender,
            firstItemChildReceivedDate: child.firstItemChildReceivedDate,
            dob: child.dob,
            secondItemPrice: child.secondItemPrice,
            age: child.age,
            secondItemName: child.secondItemName,
            location: child.location,
            secondItemHsaReceivedDate: child.secondItemHsaReceivedDate,
            programArea: child.programArea,
            secondItemChildReceivedDate: child.secondItemChildReceivedDate,
            bio: child.bio,
            thirdItemName: child.thirdItemName,
            thirdItemPrice: child.thirdItemPrice,
            status: child.status,
            hsaStatus: child.hsaStatus,
            thirdItemHsaReceivedDate: child.thirdItemHsaReceivedDate,
            thirdItemChildReceivedDate: child.thirdItemChildReceivedDate,
            id: child.id
          }
        });
        res.send(sanitizedChildren);
      }).error(function(err){res.send(500);});
    }
  }).error(function(err){res.send(500);});
};

  // .post( controller.createWorkerChild );
module.exports.createWorkerChild = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var workerId = urlArray[2];
  Staff.find({where: {id: workerId}}).success(function(worker){
    if(!worker) { 
      res.send(404); 
    } else {
      req.body.staffId = workerId;
      req.body.cfid = '';
      for(var i = 0; i < 5; i++){
        req.body.cfid += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
      Child.create(req.body).success(function(child){
        child.setStaff(worker).success(function(){
          res.send({child: child, worker: worker});
        }).error(function(err){res.send(500);});
      }).error(function(err){res.send(500);});
    }
  }).error(function(err){res.send(500);});
};

// router.route('/donors/:id/children')
//   .get( controller.fetchDonorChildren );
module.exports.fetchDonorChildren = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var donorId = urlArray[2];
  Donor.find({where: {id: donorId}}).success(function(donor){
    if(!donor){
      res.send(404);
    } else {
      donor.getChildren().success(function(children){
        res.send(children);
      }).error(function(err){res.send(500);});
    }
  }).error(function(err){res.send(500);});
};

module.exports.fetchWorker = function(req, res){
  var parsedUrl = url.parse(req.url);
  var pathname = parsedUrl.pathname;
  var query = parsedUrl.query;
  var lastName = query.split('=')[1];
  Staff.findAll({where: ["lastName LIKE '" + lastName + "%'"]}).success(function(workers){
    var sanitizedWorkers = Sequelize.Utils._.map(workers, function(worker){
      return {
        id: worker.id,
        email: worker.email,
        firstName: worker.firstName,
        lastName: worker.lastName,
        phone: worker.phone,
        department: worker.department,
        supervisorFirstName: worker.supervisorFirstName,
        supervisorLastName: worker.supervisorLastName,
        coordinatorFirstName: worker.coordinatorFirstName,
        coordinatorLastName: worker.coordinatorLastName
      }
    })
    res.send(sanitizedWorkers);
  }).error(function(){
    res.send(500);
  });
};

module.exports.swapChildWorker = function(req, res){
  var urlArray = parseUrl(req).pathArray;
  var childId = urlArray[2];
  var newWorkerId = req.body.workerId;
  Child.find({where: {id: childId}})
  .success(function(child){
    if(!child){
      res.send(404, 'Child not found');
    } else {
      child.staffId = newWorkerId;
      child.save(['staffId'])
      .success(function(child){
        res.send(child);
      })
      .error(function(err){
        res.send(500);
      })
    }
  })
  .error(function(){
    res.send(500);
  })
};

module.exports.generateReport = function(req, res){
  var startDate = req.body.startDate;
  var endDate = req.body.endDate;
  fs.exists( __dirname + '/../reports/' + startDate + '-' + endDate + '.csv', function(exists){
    if (exists) { //If file already exists, don't query a second time
      res.send(201, {
        filename: startDate + '-' + endDate + '.csv'
      }); 
    } else { //Else generate csv file
      var queryString = "SELECT 'Child First Name', 'Child Last Name', 'Child Phone Number',\
        'Child Gender', 'Child Date of Birth', 'Child Age', 'Child Location',\
        'Child CFID', 'Child Program Area', 'Child Bio', 'Child Status',\
        'Child First Item Name', 'Child First Item Price', \
        'Child First Item HSA Received Date', 'Child First Item Received Date',\
        'Child Second Item Name', 'Child Second Item Price',\
        'Child Second Item HSA Received Date', 'Child Second Item Received Date',\
        'Child Third Item Name', 'Child Third Item Price', \
        'Child Third Item HSA Received Date', 'Child Third Item Received Date',\
        'Child Add To System Date',\
        'Worker Email', 'Worker First Name', 'Worker Last Name', 'Worker Phone Number',\
        'Worker Department', 'Worker Supervisor First Name', 'Worker Supervisor Last Name',\
        'Worker Coordinator First Name', 'Worker Coordinator Last Name', 'Worker Add to System Date',\
        'Donor First Name', 'Donor Last Name', 'Donor Phone Number', 'Donor Email',\
        'Donor Address 1', 'Donor Address 2', 'Donor City', 'Donor State', 'Donor Zip Code',\
        'Donor Payment Method', 'Donor Add to System Date'\
        UNION ALL\
        SELECT ifnull(c.firstName, ''), ifnull(c.lastName, ''), ifnull(c.phone, ''), c.gender, ifnull(c.dob, ''),\
        ifnull(c.age, ''), ifnull(c.location, ''), ifnull(c.cfid, ''), ifnull(c.programArea, ''), ifnull(c.bio, ''),\
        ifnull(c.status, ''), ifnull(c.firstItemName, ''), ifnull(c.firstItemPrice, ''), ifnull(c.firstItemHsaReceivedDate, ''),\
        ifnull(c.firstItemChildReceivedDate, ''), ifnull(c.secondItemName, ''), ifnull(c.secondItemPrice, ''),\
        ifnull(c.secondItemHsaReceivedDate, ''), ifnull(c.secondItemChildReceivedDate, ''),\
        ifnull(c.thirdItemName, ''), ifnull(c.thirdItemPrice, ''), ifnull(c.thirdItemHsaReceivedDate, ''),\
        ifnull(c.thirdItemChildReceivedDate, ''), ifnull(c.createdAt, ''),\
        ifnull(s.email, ''), ifnull(s.firstName, ''), ifnull(s.lastName, ''), ifnull(s.phone, ''), ifnull(s.department, ''),\
        ifnull(s.supervisorFirstName, ''), ifnull(s.supervisorLastName, ''), ifnull(s.coordinatorFirstName, ''),\
        ifnull(s.coordinatorLastName, ''), ifnull(s.createdAt, ''),\
        ifnull(d.firstName, ''), ifnull(d.lastName, ''), ifnull(d.phone, ''), ifnull(d.email, ''), ifnull(d.address1, ''), ifnull(d.address2, ''),\
        ifnull(d.city, ''), ifnull(d.state, ''), ifnull(d.zip, ''), ifnull(d.paymentMethod, ''), ifnull(d.createdAt, '')\
        FROM (children c LEFT JOIN staffs s ON c.staffId = s.id)\
        LEFT JOIN donors d ON c.donorId = d.id\
        WHERE c.createdAt BETWEEN '" + startDate + "' AND '" + endDate + "'\
        INTO OUTFILE '" + __dirname + "/../reports/" + startDate + "-" + endDate + ".csv'\
        FIELDS TERMINATED BY ','\
        OPTIONALLY ENCLOSED BY '\"'\
        LINES TERMINATED BY '\\n';";
      sequelize.query(queryString, null, { outfile: true })
      .success(function(){
        console.log('it worked');
        // console.log(path.resolve(__dirname + '/../reports/' + startDate + '-' + endDate + '.csv'));
        // res.download(path.resolve(__dirname + '/../reports/' + startDate + '-' + endDate + '.csv'));
        res.send(201, {
          filename: startDate + '-' + endDate + '.csv'
        });
      })
      .error(function(){
        console.log('Something went wrong');
        res.send(500);
      })
    }
  })
}

module.exports.serveDownload = function(req, res){
  var pathname = url.parse(req.url).pathname;
  var filename = pathname.split('/')[2];
  res.download(path.resolve(__dirname + '/../reports/' + filename));
};
