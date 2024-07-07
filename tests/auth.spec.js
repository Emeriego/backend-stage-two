const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../app');

describe('Token Generation', () => {
  it('should generate a token with the correct expiration time', () => {
    const user = { userId: '123453a261b86-cf16-48a5-9a0b-e6f8441c8e98' };
    const token = jwt.sign(user, 'secretKey', { expiresIn: '1h' });
    const decoded = jwt.verify(token, 'secretKey');
    const currentTime = Math.floor(Date.now() / 1000);

    expect(decoded.userId).toBe(user.userId);
    expect(decoded.exp).toBeGreaterThan(currentTime);
    expect(decoded.exp).toBeLessThanOrEqual(currentTime + 3600);
  });
});



jest.setTimeout(10000); // Set timeout to 10 seconds

describe('Organisation Access', () => {
  let token;

  beforeAll(async () => {
    // Register and login to get a valid token
    await request(app).post('/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password',
      phone: '1234567890',
    });
    const res = await request(app).post('/auth/login').send({
      email: 'testuser@example.com',
      password: 'password',
    });
    token = res.body.data.accessToken;
  });

  it('should not allow access to organisations user does not belong to', async () => {
    const res = await request(app)
      .get('/api/organisations/nonexistentOrgId')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(401); // Update to match the actual response
    expect(res.body.message).toBe('You are not authorized to access this organization'); // Ensure this message matches actual implementation
  });
});


describe('POST /auth/register', () => {
  it('should register user successfully with default organisation', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@example.com',
      password: 'password',
      phone: '1234567890',
    });

    expect(res.status).toBe(201); // Ensure your endpoint is set to return 201 on success
    expect(res.body.status).toBe('success'); // Ensure the response body has this structure
    expect(res.body.message).toBe('Registration successful'); // Match the actual message
    expect(res.body.data.user.firstName).toBe('John');
    expect(res.body.data.user.email).toBe('johndoe@example.com');
    expect(res.body.data.user.organisations[0].name).toBe("John's Organisation");
  });

  it('should fail if required fields are missing', async () => {
    const res = await request(app).post('/auth/register').send({
      firstName: '',
      lastName: 'Doe',
      email: 'janedoe@example.com',
      password: 'password',
      phone: '1234567890',
    });
  
    expect(res.status).toBe(422); // Ensure the status code matches your validation
    expect(res.body.status).toBe('error'); // Ensure this matches the actual error response
    expect(res.body.message).toBe('First name is required');
  });
  

  it('should fail if there is a duplicate email', async () => {
    await request(app).post('/auth/register').send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'duplicate@example.com',
      password: 'password',
      phone: '1234567890',
    });
  
    const res = await request(app).post('/auth/register').send({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'duplicate@example.com',
      password: 'password',
      phone: '1234567890',
    });
  
    expect(res.status).toBe(422); // Ensure this matches your error response for duplicates
    expect(res.body.status).toBe('error'); // Ensure this matches the actual error response
    expect(res.body.message).toBe('Email already exists');
  });
  
});


  
describe('POST /auth/login', () => {
  it('should log the user in successfully', async () => {
    await request(app).post('/auth/register').send({
      firstName: 'Login',
      lastName: 'Test',
      email: 'logintest@example.com',
      password: 'password',
      phone: '1234567890',
    });

    const res = await request(app).post('/auth/login').send({
      email: 'logintest@example.com',
      password: 'password',
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.message).toBe('Login successful');
    expect(res.body.data.user.email).toBe('logintest@example.com');
  });

  it('should fail with incorrect credentials', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'wrongemail@example.com',
      password: 'wrongpassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.status).toBe('Bad request'); // Update to match actual response
    expect(res.body.message).toBe('Authentication failed');
  });
});
