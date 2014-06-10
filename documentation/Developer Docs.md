#Developer Docs
Hi there future developer, welcome to the dev docs. This project was made in 2 weeks by 3 Hack Reactor students after only five weeks of JavaScript training. We did a lot of things right, but it was definitely a learning experience, so we made some choices which might be a bit hard to follow. Hopefully these docs will put you on the right track.

##Client Side
###Factories vs. Services
We started out by using factories and injecting those wherever we needed them, but about halfway through we realized that we should probably be using services instead. There wasn't time to refactor our factories, so you're left with both. The functionality itself is solid - I figured it might be potentially confusing though.

###Authentication
This was slightly hacked on the client side. The issue is that cookie updating is not an instant process - the JavaScript compiler won't stop execution while waiting for a cookie to update. Because of that, when we use the protect factory to see if a user is logged in, the user would get rejected even though the server gave the all clear signal.

To work around this, I made a oneTimeAuthorization factory. This factory simply has a value true/false - if the server says the user is authorized, we issue the cookie update and flip the value to true in this factory. Then when we call the protect function to see if the user is authorized, we first check this factory. If the user is authorized, the value is flipped back to false.

###Cookies
Angular.js definitely has strange cookie handling - there were a couple of edge cases where refreshing on a nested state would put a second set of cookies at a subdirectory. This second set of cookies was messing up our authentication, so in /js/cookies.js, we use a simple Mozilla cookie manager which flushes all the cookies not at root when the page first loads.

##Server Side
###Internal API
Our RESTful API is namespaced under /api and contains all the usual suspects. The controller logic is in /server/controllers/api_controller.js We didn't set up delete routes because we thought that would leave too much room for the system to break.

It starts getting a bit messy on line 360. fetchWorker is a function called only in the admin panel. It's a function which responds specifically to last name queries of workers and will return the set of workers with a given last name.

The generate report function is also in the same file. To generate the report we issue a massive SQL query to join the three tables. You can't use res.download to serve the generated file back to the client side as AJAX calls cannot initiate downloads. Instead we have a serveDownload function on line 468 which serves the download, and use window.location on the client side in order to issue a browser GET request.

###Users Controller
This is definitely a patch we had to do at the last second. Admin/help desk accounts should have more JSON data sent back than other users, so this is specifically for admin and help desk users.

###Sequelize.js
We developed using Sequelize.js as the ORM interfacing with MySQL. While it works great in general, it has a critical bug in its current build. We've patched that bug and included Sequelize in its entirety in server/lib/sequelize including its dependencies.

Specifically, we needed to issue a raw SQL query in order to fetch data from the SQL database and put the data into a CSV file. The problem is that Sequelize's raw query function expects a SQL dataset back, but was only getting an OK message from SQL. This was crashing the node server.

The fix was simple: at /sequelize/lib/dialects/abstract/query.js on line 215, I added a workaround which simply returns early if you call the raw query function with an option of outfile

*server/lib/sequelize/lib/dialects/abstract/query.js line 215*

    if(this.options.outfile){ //This is the only thing we added
      return;
    }
    
Then when we're actually generating the report:

*server/controllers/api_controller.js line 415*

    sequelize.query(queryString, null, { outfile: true }) //Add the custom option