SELECT 'Child First Name', 'Child Last Name', 'Child Phone Number',
'Child Gender', 'Child Date of Birth', 'Child Age', 'Child Location',
'Child CFID', 'Child Program Area', 'Child Bio', 'Child Status',
'Child First Item Name', 'Child First Item Price', 
'Child First Item HSA Received Date', 'Child First Item Received Date',
'Child Second Item Name', 'Child Second Item Price',
'Child Second Item HSA Received Date', 'Child Second Item Received Date',
'Child Third Item Name', 'Child Third Item Price', 
'Child Third Item HSA Received Date', 'Child Third Item Received Date',
'Child Add To System Date',
'Worker Email', 'Worker First Name', 'Worker Last Name', 'Worker Phone Number',
'Worker Department', 'Worker Supervisor First Name', 'Worker Supervisor Last Name',
'Worker Coordinator First Name', 'Worker Coordinator Last Name', 'Worker Add to System Date',
'Donor First Name', 'Donor Last Name', 'Donor Phone Number', 'Donor Email',
'Donor Address 1', 'Donor Address 2', 'Donor City', 'Donor State', 'Donor Zip Code',
'Donor Payment Method', 'Donor Add to System Date'
UNION ALL
SELECT c.firstName, c.lastName, c.phone, c.gender, c.dob,
c.age, c.location, c.cfid, c.programArea, c.bio,
c.status, c.firstItemName, c.firstItemPrice, c.firstItemHsaReceivedDate,
c.firstItemChildReceivedDate, c.secondItemName, c.secondItemPrice,
c.secondItemHsaReceivedDate, c.secondItemChildReceivedDate,
c.thirdItemName, c.thirdItemPrice, c.thirdItemHsaReceivedDate,
c.thirdItemChildReceivedDate, c.createdAt,
s.email, s.firstName, s.lastName, s.phone, s.department,
s.supervisorFirstName, s.supervisorLastName, s.coordinatorFirstName,
s.coordinatorLastName, s.createdAt,
d.firstName, d.lastName, d.phone, d.email, d.address1, d.address2,
d.city, d.state, d.zip, d.paymentMethod, d.createdAt
FROM (children c LEFT JOIN staffs s ON c.staffId = s.id)
LEFT JOIN donors d ON c.donorId = d.id
WHERE c.createdAt BETWEEN '2014-06-01' AND '2014-07-01'
INTO OUTFILE '/tmp/testQuery5.csv'
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n';

-- Columns We're Selecting
Children:
-- First Select Query
'Child First Name', 'Child Last Name', 'Child Phone Number',
'Child Gender', 'Child Date of Birth', 'Child Age', 'Child Location',
'Child CFID', 'Child Program Area', 'Child Bio', 'Child Status',
'Child First Item Name', 'Child First Item Price', 
'Child First Item HSA Received Date', 'Child First Item Received Date',
'Child Second Item Name', 'Child Second Item Price',
'Child Second Item HSA Received Date', 'Child Second Item Received Date',
'Child Third Item Name', 'Child Third Item Price', 
'Child Third Item HSA Received Date', 'Child Third Item Received Date',
'Child Add To System Date',

-- Second Select Query
c.firstName, c.lastName, c.phone, c.gender, c.dob,
c.age, c.location, c.cfid, c.programArea, c.bio,
c.status, c.firstItemName, c.firstItemPrice, c.firstItemHsaReceivedDate,
c.firstItemChildReceivedDate, c.secondItemName, c.secondItemPrice,
c.secondItemHsaReceivedDate, c.secondItemChildReceivedDate,
c.thirdItemName, c.thirdItemPrice, c.thirdItemHsaReceivedDate,
c.thirdItemChildReceivedDate, c.createdAt,

Staff:
-- First Select Query
'Worker Email', 'Worker First Name', 'Worker Last Name', 'Worker Phone Number',
'Worker Department', 'Worker Supervisor First Name', 'Worker Supervisor Last Name',
'Worker Coordinator First Name', 'Worker Coordinator Last Name', 'Worker Add to System Date',

-- Second Select Query
s.email, s.firstName, s.lastName, s.phone, s.department,
s.supervisorFirstName, s.supervisorLastName, s.coordinatorFirstName,
s.coordinatorLastName, s.createdAt,

Donors:
-- First Select Query
'Donor First Name', 'Donor Last Name', 'Donor Phone Number', 'Donor Email',
'Donor Address 1', 'Donor Address 2', 'Donor City', 'Donor State', 'Donor Zip Code',
'Donor Payment Method', 'Donor Add to System Date'

-- Second Select Query
d.firstName, d.lastName, d.phone, d.email, d.address1, d.address2,
d.city, d.state, d.zip, d.paymentMethod, d.createdAt