# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## MaemYuk — Surplus Food Marketplace

### 1. Product Overviewg

MaemYuk is a web-based platform that connects consumers with local food stalls and small food businesses that have unsold but safe-to-consume food. These food items are offered at discounted prices, allowing customers to purchase affordable meals while helping sellers reduce potential losses.

MaemYuk aims to make surplus food more accessible, support small food businesses, and reduce food waste through a simple and convenient digital shopping experience.

### 2. Problem Statement

Local food stalls and small food businesses often struggle to predict daily demand. As closing time approaches, some food items may remain unsold, leaving sellers with limited opportunities to sell them and increasing the risk of food waste.

Meanwhile, students and people living in boarding houses often look for affordable meals to manage their daily expenses.

MaemYuk addresses these problems by providing a platform where users can discover discounted surplus food, view product and seller information, and check pickup details before purchasing.

### 3. Product Goals

- **For customers:** Provide affordable food options and transparent product information.
- **For sellers:** Increase the chances of selling surplus food and reduce potential financial losses.
- **For the environment:** Help reduce food waste by encouraging the purchase of safe-to-consume surplus food.

### 4. Target Users

**Primary Users — Customers**

University students and people living in boarding houses who want affordable meals, prefer nearby food options, and consider price and pickup convenience when making purchasing decisions.

**Secondary Users — Sellers**

Owners of small food stalls, including traditional Indonesian food stalls (warteg), who have unsold food that remains safe to consume and want to offer it to nearby customers.

### 5. Initial Validation Findings

The initial validation consisted of 90 reviews: 80 reviews from Surplus Indonesia and 10 Google Reviews from local food businesses.

| Finding | Product Implication |
|---|---|
| 41 negative reviews | Identify common user frustrations and usability issues. |
| 39 positive reviews | Affordable prices and food-waste reduction are potential product value propositions. |
| Concerns about prices before discounts | Display original prices and discounted prices transparently. |
| Complaints about slow performance and app crashes | Keep the user experience simple and optimize performance. |
| Concerns about partner verification | Provide clear and trustworthy seller information. |
| Interest in digital payments | Consider digital payment options for future development. |

*Note: These findings are based on the available initial validation summary. The 10 Google Reviews came from local food businesses and should not automatically be interpreted as reviews of the same application.*

### 6. Product Scope

**In Scope — Current Prototype**

- User registration and login.
- Homepage with search and recommended food items.
- Food categories and search history.
- Food and store catalogs.
- Product details, including price, seller, rating, and pickup time.
- Shopping cart.
- Checkout with payment method options.
- Transaction confirmation page.
- Empty search results page.

**Potential Future Enhancements**

- Seller identity verification.
- Food allergy and dietary preference filters.
- Notifications for surplus food approaching closing time.
- Food donation through verified social organizations.
- Order history and order status tracking.

### 7. Functional Requirements

| ID | Feature | Requirement |
|---|---|---|
| FR-01 | Registration | Users can create an account and select a role as a customer or seller. |
| FR-02 | Login | Users can enter their email and password to sign in. |
| FR-03 | Homepage | The system displays food categories, recommended items, and a search field. |
| FR-04 | Search | Users can search for food by name or keyword. |
| FR-05 | Catalog | Users can browse available food items and store information. |
| FR-06 | Product Details | Users can view product descriptions, prices, ratings, seller information, and pickup times. |
| FR-07 | Shopping Cart | Users can select food items and review their selections before checkout. |
| FR-08 | Checkout | Users can review their order, vouchers, total payment, and available payment methods. |
| FR-09 | Transaction Confirmation | The system displays a transaction summary and order pickup information. |
| FR-10 | Empty Search Results | The system displays a message when no matching food items are found. |

### 8. Non-Functional Requirements

- **Usability:** The interface should be easy to understand, including for first-time users.
- **Responsiveness:** The website should adapt to desktop and mobile screen sizes.
- **Performance:** Pages and images should be optimized for efficient loading.
- **Price Transparency:** Original prices, discounts, final prices, and any additional fees should be clearly displayed.
- **Security:** User and transaction data must be protected when the platform is implemented as a functional application.
- **Accessibility:** Text should be readable, images should have appropriate alternative text, and form fields should have clear labels.

### 9. Main User Flow

1. **Login or Registration:** Users sign in or create an account.
2. **Homepage and Search:** Users search for food or browse available categories.
3. **Catalog and Product Details:** Users review food prices, seller information, and pickup times.
4. **Shopping Cart and Checkout:** Users review their selections and choose a payment method.
5. **Transaction Confirmation:** Users view their order summary and pickup information.

### 10. User Stories and Acceptance Criteria

**User Story 1: Finding Affordable Food**

As a student, I want to find affordable food nearby so that I can manage my daily expenses.

Acceptance Criteria:
- Users can search for food items.
- Search results display food names, prices, and seller information.

**User Story 2: Understanding Discounts**

As a customer, I want to see the original price and discounted price so that I can understand how much I save.

Acceptance Criteria:
- Original and discounted prices are displayed clearly.
- The displayed discount accurately reflects the final price.

**User Story 3: Checking Pickup Information**

As a customer, I want to know the pickup location and time so that I can plan when to collect my order.

Acceptance Criteria:
- Product details include pickup information.
- Pickup details are accessible before completing the purchase.

**User Story 4: Reviewing an Order**

As a customer, I want to review my order before paying so that I can avoid purchasing the wrong items.

Acceptance Criteria:
- The cart and checkout pages display selected items, quantities, vouchers, and the total payment.

**User Story 5: Confirming a Transaction**

As a customer, I want to receive transaction confirmation so that I know what to do next.

Acceptance Criteria:
- The confirmation page displays the transaction status and order summary.
- Pickup information is available after the transaction is completed.

### 11. Success Metrics

For the prototype stage, success will be evaluated through usability testing rather than actual transaction volume.

- Users can find the food items they are looking for.
- Users can complete the flow from the homepage to transaction confirmation without assistance.
- Users understand the displayed discounts and total payment.
- Users can locate pickup information.
- Users can identify confusing parts of the interface and provide actionable feedback.

For a live product, additional metrics may include completed orders, checkout completion rate, the quantity of surplus food sold, and repeat purchase rate.

### 12. Assumptions and Limitations

- The current prototype focuses primarily on the customer shopping experience.
- The HTML pages represent the intended interface and user flow. Authentication, cart persistence, payment processing, and inventory management require backend services or additional implementation.
- Food availability, discount validity, and seller trustworthiness must be verified in the production system.
- Seller management and food donation features are potential future enhancements, not mandatory features for the current customer-focused prototype.

### 13. Development Priorities

**P0 — Core Shopping Experience**
- Login and registration.
- Homepage and search.
- Food catalog and product details.
- Shopping cart and checkout.
- Transaction confirmation.

**P1 — Customer Trust and Convenience**
- Transparent discount information.
- Clear seller details.
- Pickup information.
- Food preference filters.

**P2 — Future Enhancements**
- Seller verification.
- Surplus food notifications.
- Food donation features.
- Transaction history.

### 14. Conclusion

MaemYuk aims to address two related challenges: unsold food that may go to waste and the need for affordable meals among students and people living in boarding houses.

The product focuses on a simple shopping journey, transparent pricing, and clear pickup information. By connecting customers with local food businesses, MaemYuk seeks to make surplus food more accessible while supporting small businesses and encouraging food-waste reduction.

This PRD is an initial product requirements draft based on the current concept, available validation findings, and customer-facing prototype. The requirements should be reviewed with the project mentor and refined through usability testing before implementation.