# shopper-app-mern-stack
A full stack(MERN) e-commerce website that I created. This website is responsive and mobile-ready.

This website is deployed in this link: [Shopper App](https://iridescent-gaufre-ffa5d1.netlify.app/)

**Note:** The deployed website has limitations because my backend codebase is hosted in free tier in render. Example of limitations is http cookie. Login and registration are disabled due to http cookies not working on "on.render" domain provided by render. It's better to test this project in development environment.  
Read more [here](https://render.com/docs/free) to see other limitations.

**Note:** This project is still WIP(Work In Progress). Although, most of its core
functionalities are implemented. Also, the current state of this project is still rough.
Need to do more polishing. I will keep updating this project until it's fully complete.

This project has an admin dashboard that I'll work on in the future. For this reason,
you will see some unused scripts in the back-end codebase.

# Technologies Used
**React**  
**SASS(SCSS)**  
**Redux**  
**Nodejs**  
**Express**  
**Stripe**  
**JWT**  
**Typescript**  
**Mongodb**

# Testing this project
You can clone this project and test it for yourself. However, you need to create .env files
and add these following variables:

## Front-end  
**STRIPE_PUB_KEY** -> Stripe public key. You can get this in your stripe dashboard.  
**SERVER_DOMAIN** -> Domain where you deploy your back-end codebase.

## Back-end  
**MONGODB_URI** -> If you're using atlas, look at your mongodb dashboard to get this URI.  
**PASSPHRASE** -> Secret key for AES encryption.  
**JWT_ACCESS_TKN_SECRET** -> Secret key for JWT access token. This can be any random bytes or generate UUID.   
**JWT_ACCESS_TKN_EXPIRE** -> Access token expiration.  
**JWT_REFRESH_TKN_SECRET** -> Secret key for JWT refresh token. This can be any random bytes or generate UUID.  
**STRIPE_SEC** -> Stripe secret key. You can get this in your stripe dashboard.  
**STRIPE_WEBHOOK_SEC** -> Secret key stripe event webhooks. You can get this in your stripe dashboard in the webhooks section.  
**ADMIN_ROLE** -> Secret code for admin role. This can be any random bytes or generate UUID.  
**USER_ROLE** -> Secret code for user role. This can be any random bytes or generate UUID.  
**FRONT_END_DOMAIN** -> Domain where you deploy your front-end codebase.  
**ADMIN_EMAIL** -> Admin email. This can be used to send email to customers.  
**ADMIN_EMAIL_PASS** -> Admin email password. For example, if you use gmail, you need to go to your admin gmail account and create an app password. You can use this password in nodemailer.
