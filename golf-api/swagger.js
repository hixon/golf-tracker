import swaggerUi from 'swagger-ui-express';
import swagger from './swagger.json' with { type: 'json' };

export default (app) =>  {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));
};
