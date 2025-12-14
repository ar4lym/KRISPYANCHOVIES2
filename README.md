# Krispy Anchovies
Krispy Anchovies is an e-commerce company with a mission to make a positive impact on marine wildlife conservation. Specializing in aquatic animal-themed plushies, we aim to combine comfort and care for the environment. Each purchase contributes to initiatives focused on protecting and preserving marine ecosystems. By choosing one of our plushies, customers not only gain a soft, lovable companion but also become active participants in the effort to save ocean wildlife. Together, we are driving meaningful change, one plushie at a time.

# Application Purpose & Target Audience
- **What the application caters for:**  
  - Environmentally conscious shoppers 
  - Students and young users interested in marine conservation
  - Casual e-commerce users who enjoy gamified rewards systems
- **Primary Goals:**  
  - Promote awareness of marine conservation 
  - Encourage user engagement through points, leaderboards, and rewards 
  -Provide a simple, responsive, and user-friendly shopping experience


# Design Process
The website was designed to be visually appealing, responsive, and user-friendly. Each page was developed with a clear purpose and smooth navigation in mind:

- **Login Page:**  
  - Users can log in with email and password.  
  - Validation ensures empty or invalid fields are flagged.  
  - Linked to Firebase Authentication.  

- **Sign Up Page:**  
  - Users can create a new account with a username, email, and password.  
  - Form validation is implemented to prevent incomplete submissions.  
  - Integrated with Firebase Authentication to store user credentials.  

- **Home Page:**  
  - Displays featured plushies and the user's current points.  
  - Call-to-action buttons guide users to product pages or rewards.  
  - Clean, ocean-themed layout with gradient backgrounds for visual appeal.  
- **Leaderboard Page:**  
  - Shows top habitat cleaners with rankings, names, animal type, and time.  
  - Includes filter buttons to display results by habitat type.  
  - Fully responsive table for desktop and mobile devices.  

- **Redeem Page:**  
  - Users can redeem points for plushies.  
  - Buttons show required points and notify users if insufficient.  
  - Clear layout with product cards and pricing.  

- **About Us Page:**  
  - Introduces the company mission, values, and team members.  
  - Engaging layout with hero banners and visual storytelling.  

Github URL -(https://github.com/ar4lym/KRISPYANCHOVIES2)  

# Features
- **User Authentication:** Login and Sign Up with Firebase.  
- **Leaderboard:** Live habitat cleanup rankings with filtering options.  
- **Rewards System:** Users earn points and redeem them for plushies.  
- **Responsive Design:** Fully functional across desktop, tablet, and mobile devices.  
- **Navigation:** Collapsible hamburger menu for easy navigation on mobile.  
- **Contact Form:** Users can submit messages directly from the homepage.  

# Technologies Used
- **Framework:** [Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)  
- **Database & Authentication:** [Firebase Realtime Database & Authentication](https://firebase.google.com/docs)  
- **Charts & Visualization:** [Chart.js](https://www.chartjs.org/docs/latest/)  

# Testing
## Scenario 1: New User
1. **Sign Up**
   - Submit empty form  
   - Submit with valid inputs
2. **Login**
   - Attempt empty fields → verify error message.  
   - Login with valid credentials → verify homepage redirection.  
3. **Leaderboard**
   - Filter by habitats → verify table updates correctly.  
4. **Redeem**
   - Attempt redeem without sufficient points → verify error message.  
   - Redeem with sufficient points → verify success message.  
5. **Contact Us**
   - Submit valid info → verify success message.

## Scenario 2: Existing User
- Login with existing credentials.  
- Verify homepage displays points and products.  
- Test leaderboard filters and redeem functionality.  
- Ensure pages are responsive on mobile and desktop.

# Credits
- Firebase Documentation (https://firebase.google.com/docs)  
- Bootstrap Documentation (https://getbootstrap.com/docs/5.3/getting-started/introduction/)  
- Chart.js Documentation (https://www.chartjs.org/docs/latest/)  
- ChatGPT (Assistance for retrieving top 5 leaderboard and coding logic)
