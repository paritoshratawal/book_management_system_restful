# book_management_system_restful
Book Management System for a book store application, focusing on user management, book management, purchase history, and revenue tracking for authors.

# sell count login
Increment sell count on each purchase of a book the quantity of a book is not sell count, here sell count refers to the how many times purchase of a book is happened, initial value of sell count on book add is 0.

# Email notification on purchase
Whenever a purchase happens, the email notification send to the author of a book, only author user is able to add books and we are saving its details including email. on purchase, system fetching book details and author email and trigger a email notification.

# Monthly revenue Email notification
 Every month a time interval method will occur and fetch all the purchased data with a flag "is_send_email_notification : false" and send monthly revenue information to the author of a book