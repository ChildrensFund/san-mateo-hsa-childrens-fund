#Donors


----------


##Home Page
Shows potential donors selected information about child:

 - First Name
 - Photo
 - Wishlist Items (limited to 16 characters)
 - Wishlist Prices
 - Bio (limited to 600 characters)

>Children appear in chronological order from the date the request was created.
 
When a donor clicks the "**Pledge**" button, the user is sent to the **Pledge Page**.

##Blurb

If you would like to add a blurb to the top of the homepage, navigate to the root/client/templates/public/home.html file and find the pre-made `<div>` for an optional blurb.
 
##Pledge Page
Collects the following information from Donor:

 - First Name
 - Last Name
 - Phone
 - Email
 - Address
 - City
 - State
 - Zip
 - Donation Type:
     - Items
     - Cash
     - Check

This information is inserted into the database, and a connection is created between the donor and their selected child. 
(Workers can see a child's donor on the "**My Children Tags**" page by clicking the green "**See Donor**" button.)

A confirmation email is sent to the donor after their information is entered and the "**Submit**" button is clicked.
based on their choice of donation.

**Cash Donation:**
><p>Dear [Donor's First Name],</p>
><div style="margin-left: 20px">
>  <p>Thank you for making a cash donation to the County of San Mateo's Children's Fund.</p>
>  <p>Please mail or drop-off your cash donation in the amount of <strong>$[Total Donation Amount]</strong> to:</p>
>  <p style="margin-left: 20px">
>    Children's Fund<br/>
>    1 Davis Drive<br/>
>    Belmont, CA 94002<br/>
>  </p>
>  <p>For your records, please keep your donation number in a safe place:</p>
>  <H2>[Confirmation Number]</H2>
>  <p>This number will allow you to receive your tax benefit.</p>
>  <p>If you have any questions, please contact us at <a href="mailto:childrensfund@smchsa.org">childrensfund@smchsa.org</a> or by phone at (650) 802-5152.</p>
>  <br/>
>  <p>Thank you again,</p>
>  <p>Children's Fund</p>
>  <p>County of San Mateo</p>
></div>


**Item Donation:**
><p>Dear [Donor's First Name],</p>
> <div style="margin-left: 20px">
> <p>Thank you for making a donation to the County of San Mateo's Children's Fund.</p>
> <p>Please purchase and <strong>include copies of your receipts</strong> for the following products:</p>

> - [First Item]: $[First Item Price]

> - [Second Item]: $[Second Item Price]

> - [Third Item]: $[Third Item Price]

> <p>Items can be mailed or dropped off to:</p>
> <p style="margin-left: 20px">
> Children's Fund<br/>
> 1 Davis Drive<br/>
> Belmont, CA 94002<br/>
> </p>
> <strong>Please include the following number with your package of items:</strong>
>  <H2>[Confirmation Number]</H2>
> <p>This number will allow you to receive your tax benefit.</p>
  <p>If you have any questions, please contact us at <a href="mailto:childrensfund@smchsa.org">childrensfund@smchsa.org</a> or by phone a> (650) 802-5152.</p>
> <br/>
> <p>Thank you again,</p>
> <p>Children's Fund</p>
> <p>County of San Mateo</p>
> </div>

**Check Donation:**
> <p>Dear [Donor's First Name],</p>
> <div style="margin-left: 20px">
> <p>Thank you for making a donation to the County of San Mateo's Children's Fund.</p>
> <p>Please make your check payable for the amount of <strong>$[Total Donation Amount]</strong> to: <strong>"Children's Fund"</strong></p>
> <p>Checks can be mailed to:</p>
> <p style="margin-left: 20px">
> Children's Fund<br/>
> 1 Davis Drive<br/>
> Belmont, CA 94002<br/>
> </p>
> <p>For your records, please keep your donation number in a safe place:</p>
>  <H2>[Confirmation Number]</H2>
> <p>This number will allow you to receive your tax benefit.</p>
  <p>If you have any questions, please contact us at <a href="mailto:childrensfund@smchsa.org">childrensfund@smchsa.org</a> or by phone a> (650) 802-5152.</p>
> <br/>
> <p>Thank you again,</p>
> <p>Children's Fund</p>
> <p>County of San Mateo</p>
> </div>

Upon a successful entry of donor information, the child is removed from the homepage.
The child's data will still be visible from the worker's "**My Children Tags**" view.