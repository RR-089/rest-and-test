const request = require("supertest");
const app = require("../server");

let server;

beforeAll((done) => {
  server = app.listen(3000, () => {
    console.log("Server started on port 3000");
    done();
  });
});

afterAll((done) => {
  server.close(done);
});

describe("Test CRUD operations for users", () => {
  let userId;

  test("It should retrieve empty array", async () => {
    const response = await request(app).get("/users");
    expect(response.body).toStrictEqual([]);
  });

  test("It should create a new user", async () => {
    const mockUser = { username: "ucokgg", age: 22 };
    const response = await request(app).post("/users").send(mockUser);

    userId = response.body.createdUser.id;

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("createdUser");
    expect(response.body.createdUser).toHaveProperty("id");
    expect(response.body.createdUser.username).toBe(mockUser.username);
    expect(response.body.createdUser.age).toBe(mockUser.age);
  });

  test("It should prevent creating a new user if the fields are incorrect", async () => {
    const mockIncorrectUser = { age: 10 };

    const response = await request(app).post("/users").send(mockIncorrectUser);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });

  test("It should retrieve array with one user", async () => {
    const response = await request(app).get("/users");
    expect(response.body).toHaveLength(1);
  });

  test("It should get a user by username using a query parameter", async () => {
    const query = { username: "ucok" };

    const response = await request(app).get("/users").query(query);

    const foundUser = response.body.find((user) =>
      user.username.includes(query.username)
    );

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();

    expect(foundUser).toHaveProperty("id");
    expect(foundUser).toHaveProperty("username");
    expect(foundUser).toHaveProperty("email");
    expect(foundUser).toHaveProperty("age");
  });

  test("It should get a user by ID using a URL parameter", async () => {
    const response = await request(app).get(`/users/${userId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(userId);
  });

  test("It should update a user, only the field that is inputted", async () => {
    const updateUsername = { username: "rr" };
    const response = await request(app)
      .patch(`/users/${userId}`)
      .send(updateUsername);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("updatedUser");

    expect(response.body.updatedUser.id).toBe(userId);
    expect(response.body.updatedUser.username).toBe(updateUsername.username);
  });

  test("It should delete a user", async () => {
    const response = await request(app).delete(`/users/${userId}`);

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("deletedUser");

    expect(response.body.deletedUser.id).toBe(userId);
  });
});
