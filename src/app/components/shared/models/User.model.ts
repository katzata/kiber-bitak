export interface User {
    username: string;
    image: string;
    email: string;
    cart: Array<object>;
    messagesFrom: Array<object>;
    messagesTo: Array<object>;
    products: Array<object>;
    purchases: Array<object>;
    ratingAsBuyer: Array<number>;
    ratingAsSeller: Array<number>;
    sessionToken: string;
};