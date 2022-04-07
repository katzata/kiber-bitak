export interface Product {
    department: string,
    name: string,
    condition: string,
    delivery: string,
    price: number,
    quantity: number,
    location: string,
    images: Array<any>,
    imageData: Array<File>,
    description: string,
    seller: any,
    createdAt: string,
    updatedAt: string,
    views: number
};