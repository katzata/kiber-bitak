export interface User {
    id: string,
    username: string;
    image: string;
    email: string;
    address: string;
    cart: Array<object>;
    messagesFrom: Array<object>;
    messagesTo: Array<object>;
    products: Array<any>;
    purchases: Array<object>;
    ratingAsBuyer: Array<number>;
    ratingAsSeller: Array<number>;
    sessionToken: string;
};