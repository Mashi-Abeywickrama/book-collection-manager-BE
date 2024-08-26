import swaggerJsDoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        openapi: '3.0.1',
        info: {
            title: 'Book Collection Manager API',
            version: '1.0.0',
            description: 'The Book Collection Management System API allows users to manage their book collection with Create, Read, Update, and Delete (CRUD) operations. The API enables the registered users to add new books, retrieve details of existing books, update book information, and remove books from the collection.',
            contact: {
                name: 'Mashi Abeywickrama',
                email: 'abeywickramaamagi@gmail.com',
            },
            security: [{
                bearerAuth: []
            }]
        },
    },
    apis: ['./documentation/*.yaml'],
};

const specs = swaggerJsDoc(options);

export default specs;
