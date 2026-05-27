require('dotenv').config();
const mongoose = require('mongoose');
const Employee = require('./models/Employee');

const employees = [
  { name: 'Rahul Sharma', aadhaarNumber: '123456789012', address: '12, MG Road, Delhi', salary: 45000, email: 'rahul.sharma@example.com', mobileNumber: '9876543210' },
  { name: 'Priya Singh', aadhaarNumber: '234567890123', address: '34, Park Street, Mumbai', salary: 52000, email: 'priya.singh@example.com', mobileNumber: '9765432109' },
  { name: 'Amit Kumar', aadhaarNumber: '345678901234', address: '56, Lake View, Bangalore', salary: 61000, email: 'amit.kumar@example.com', mobileNumber: '9654321098' },
  { name: 'Sneha Patel', aadhaarNumber: '456789012345', address: '78, Civil Lines, Ahmedabad', salary: 39000, email: 'sneha.patel@example.com', mobileNumber: '9543210987' },
  { name: 'Vikram Yadav', aadhaarNumber: '567890123456', address: '90, Station Road, Lucknow', salary: 47000, email: 'vikram.yadav@example.com', mobileNumber: '9432109876' },
  { name: 'Anjali Mehta', aadhaarNumber: '678901234567', address: '11, Gandhi Nagar, Jaipur', salary: 55000, email: 'anjali.mehta@example.com', mobileNumber: '9321098765' },
  { name: 'Rohan Verma', aadhaarNumber: '789012345678', address: '22, Sector 15, Noida', salary: 68000, email: 'rohan.verma@example.com', mobileNumber: '9210987654' },
  { name: 'Kavita Joshi', aadhaarNumber: '890123456789', address: '33, Banjara Hills, Hyderabad', salary: 43000, email: 'kavita.joshi@example.com', mobileNumber: '9109876543' },
  { name: 'Suresh Nair', aadhaarNumber: '901234567890', address: '44, Marine Drive, Kochi', salary: 72000, email: 'suresh.nair@example.com', mobileNumber: '9098765432' },
  { name: 'Pooja Gupta', aadhaarNumber: '012345678901', address: '55, Salt Lake, Kolkata', salary: 49000, email: 'pooja.gupta@example.com', mobileNumber: '8987654321' },
  { name: 'Arjun Reddy', aadhaarNumber: '112233445566', address: '66, Jubilee Hills, Hyderabad', salary: 81000, email: 'arjun.reddy@example.com', mobileNumber: '8876543210' },
  { name: 'Divya Sharma', aadhaarNumber: '223344556677', address: '77, Andheri West, Mumbai', salary: 53000, email: 'divya.sharma@example.com', mobileNumber: '8765432109' },
  { name: 'Karan Malhotra', aadhaarNumber: '334455667788', address: '88, Connaught Place, Delhi', salary: 76000, email: 'karan.malhotra@example.com', mobileNumber: '8654321098' },
  { name: 'Meera Iyer', aadhaarNumber: '445566778899', address: '99, Koramangala, Bangalore', salary: 64000, email: 'meera.iyer@example.com', mobileNumber: '8543210987' },
  { name: 'Nikhil Desai', aadhaarNumber: '556677889900', address: '21, Navrangpura, Ahmedabad', salary: 42000, email: 'nikhil.desai@example.com', mobileNumber: '8432109876' },
  { name: 'Ritu Agarwal', aadhaarNumber: '667788990011', address: '32, Hazratganj, Lucknow', salary: 58000, email: 'ritu.agarwal@example.com', mobileNumber: '8321098765' },
  { name: 'Sanjay Tiwari', aadhaarNumber: '778899001122', address: '43, Vaishali Nagar, Jaipur', salary: 46000, email: 'sanjay.tiwari@example.com', mobileNumber: '8210987654' },
  { name: 'Nisha Chauhan', aadhaarNumber: '889900112233', address: '54, Sector 62, Noida', salary: 70000, email: 'nisha.chauhan@example.com', mobileNumber: '8109876543' },
  { name: 'Rajesh Pillai', aadhaarNumber: '990011223344', address: '65, Thrissur Road, Kochi', salary: 38000, email: 'rajesh.pillai@example.com', mobileNumber: '8098765432' },
  { name: 'Sunita Bose', aadhaarNumber: '101112131415', address: '76, Ballygunge, Kolkata', salary: 62000, email: 'sunita.bose@example.com', mobileNumber: '7987654321' },
  { name: 'Manoj Sinha', aadhaarNumber: '121314151617', address: '87, Patna City, Patna', salary: 35000, email: 'manoj.sinha@example.com', mobileNumber: '7876543210' },
  { name: 'Deepa Nambiar', aadhaarNumber: '131415161718', address: '98, Calicut Road, Kozhikode', salary: 57000, email: 'deepa.nambiar@example.com', mobileNumber: '7765432109' },
  { name: 'Gaurav Saxena', aadhaarNumber: '141516171819', address: '19, Gomti Nagar, Lucknow', salary: 83000, email: 'gaurav.saxena@example.com', mobileNumber: '7654321098' },
  { name: 'Swati Pandey', aadhaarNumber: '151617181920', address: '20, Shyam Nagar, Kanpur', salary: 41000, email: 'swati.pandey@example.com', mobileNumber: '7543210987' },
  { name: 'Harish Menon', aadhaarNumber: '161718192021', address: '31, Adyar, Chennai', salary: 66000, email: 'harish.menon@example.com', mobileNumber: '7432109876' },
  { name: 'Pallavi Kulkarni', aadhaarNumber: '171819202122', address: '42, Shivajinagar, Pune', salary: 74000, email: 'pallavi.kulkarni@example.com', mobileNumber: '7321098765' },
  { name: 'Ashish Bhatt', aadhaarNumber: '181920212223', address: '53, Navdurga Colony, Indore', salary: 48000, email: 'ashish.bhatt@example.com', mobileNumber: '7210987654' },
  { name: 'Rekha Jain', aadhaarNumber: '192021222324', address: '64, Malviya Nagar, Jaipur', salary: 36000, email: 'rekha.jain@example.com', mobileNumber: '7109876543' },
  { name: 'Tushar Goel', aadhaarNumber: '202122232425', address: '75, Dwarka Sector 6, Delhi', salary: 79000, email: 'tushar.goel@example.com', mobileNumber: '7098765432' },
  { name: 'Anita Rawat', aadhaarNumber: '212223242526', address: '86, Rajpur Road, Dehradun', salary: 44000, email: 'anita.rawat@example.com', mobileNumber: '6987654321' },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Employee.deleteMany({});
  await Employee.insertMany(employees);
  console.log(`✅ ${employees.length} employees seeded successfully`);
  process.exit();
};

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});