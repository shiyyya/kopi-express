import { apiFetch } from "./client";

// LAHAT NG CAPITAL LETTERS SA COMMENT DI KASAMA SA MGA EXAMPLE

export function signup(data) {
  return apiFetch('/auth/customer/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
/* example:
const user = await signup({
  fullName: "Valenzuela, Anjanette",
  email: "anjyyy@gmail.com",
  phoneNumber: "+639123456789",
  defaultAddress: "sa bahay nila", // Optional
  password: "valenzuelaey0",
  confirmPassword: "valenzuelaey0"
})


// IT WILL RETURN SOMETHING LIKE:

{
  data: {
    user: {
      id: "01M2JTYWZK61RKAA7J611ZJF0Q",
      email: "anjyyyvalenzuela@gmail.com",
      role: "customer",
      status: "active",
      createdAt: "2026-09-15T15:28:54.262Z",
      updatedAt: "2026-09-15T15:28:54.262Z"
    },
    customer: {
      userId: "01M2JTYWZK61RKAA7J611ZJF0Q",
      fullName: "Valenzuela, Anjanette",
      phoneNumber: "+639813283228",
      updatedAt: "2026-09-15T15:28:54.288Z",
      createdAt: "2026-09-15T15:28:54.288Z"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMU0ySlRZV1pLNjFSS0FBN0o2MTFaSkYwUSIsImlhdCI6MTc4OTQ4NjEzNCwiZXhwIjoxNzg5NDg5NzM0fQ.Z1YOMW_TABbQuuuBZlImmnPXy34At9g9-jC7Sioo0Wc"
  }
}

*/




// WORKS FOR ALL USERS INCLUDING STAFF AND OWNER IF SPECIFIED
export function login(data) {
  return apiFetch('/auth/customer/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
/* example:
const user = await login({
  email: "anjyyy@gmail.com",
  password: "valenzuelaey0"
})


// IT WILL RETURN SOMETHING LIKE:

{
  data: {
    user: {
      id: "01M2JTYWZK61RKAA7J611ZJF0Q",
      email: "anjyyyvalenzuela@gmail.com",
      role: "customer",
      status: "active",
      createdAt: "2026-09-15T15:28:54.262Z",
      updatedAt: "2026-09-15T15:28:54.262Z"
    },
    account: {
      userId: "01M2JTYWZK61RKAA7J611ZJF0Q",
      fullName: "Valenzuela, Anjanette",
      phoneNumber: "+639813283228",
      updatedAt: "2026-09-15T15:28:54.288Z",
      createdAt: "2026-09-15T15:28:54.288Z"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMU0ySlRZV1pLNjFSS0FBN0o2MTFaSkYwUSIsImlhdCI6MTc4OTQ4NjEzNCwiZXhwIjoxNzg5NDg5NzM0fQ.Z1YOMW_TABbQuuuBZlImmnPXy34At9g9-jC7Sioo0Wc"
  }
}

*/

export function loginStaff(data) {
  return apiFetch('/auth/staff/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
/* example:
const user = await loginStaff({
  email: "anjyyy@gmail.com",
  password: "valenzuelaey0"
})


// IT WILL RETURN SOMETHING LIKE:

{
  data: {
    user: {
      id: "01M2JTYWZK61RKAA7J611ZJF0Q",
      email: "anjyyyvalenzuela@gmail.com",
      role: "staff",
      status: "active",
      createdAt: "2026-09-15T15:28:54.262Z",
      updatedAt: "2026-09-15T15:28:54.262Z"
    },
    account: {
      userId: "01M2JTYWZK66RSCA7J611ZJF0Q",
      storeBranchId: "02M2JTYWZK66RSCAAJ621ZKF1S",
      updatedAt: "2026-09-15T15:28:54.288Z",
      createdAt: "2026-09-15T15:28:54.288Z"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMU0ySlRZV1pLNjFSS0FBN0o2MTFaSkYwUSIsImlhdCI6MTc4OTQ4NjEzNCwiZXhwIjoxNzg5NDg5NzM0fQ.Z1YOMW_TABbQuuuBZlImmnPXy34At9g9-jC7Sioo0Wc"
  }
}

*/

export function loginOwner(data) {
  return apiFetch('/auth/owner/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
/* example:
const user = await loginOwner({
  email: "anjyyy@gmail.com",
  password: "valenzuelaey0"
})


// IT WILL RETURN SOMETHING LIKE:

{
  data: {
    user: {
      id: "01M2JTYWZK61RKAA7J611ZJF0Q",
      email: "anjyyyvalenzuela@gmail.com",
      role: "owner",
      status: "active",
      createdAt: "2026-09-15T15:28:54.262Z",
      updatedAt: "2026-09-15T15:28:54.262Z"
    },
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIwMU0ySlRZV1pLNjFSS0FBN0o2MTFaSkYwUSIsImlhdCI6MTc4OTQ4NjEzNCwiZXhwIjoxNzg5NDg5NzM0fQ.Z1YOMW_TABbQuuuBZlImmnPXy34At9g9-jC7Sioo0Wc"
  }
}

*/






// DO NOT TOUCH THIS!
// // STAFF AND OWNER, NOT SECURED YET
// export function registerStaff(data) {
//   return apiFetch('/auth/staff/register', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }
// /* example:
// const user = registerStaff({
//   email: "anjyyy@gmail.com",
//   storeBranchAddress: "branch 123",
//   password: "valenzuelaey0",
//   confirmPassword: "valenzuelaey0"
// })

// */

// export function registerOwner(data) {
//   return apiFetch('/auth/owner/register', {
//     method: 'POST',
//     body: JSON.stringify(data),
//   });
// }
// /* example:
// const user = registerOwner({
//   email: "anjyyy@gmail.com",
//   password: "valenzuelaey0",
//   confirmPassword: "valenzuelaey0"
// })

// */


