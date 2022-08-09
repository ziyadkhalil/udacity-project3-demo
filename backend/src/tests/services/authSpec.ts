import { authService } from "../../services/auth";

let token: string;
describe("Auth Service Test Suite", () => {
  it("Creates an account", async () => {
    const user = await authService.createAccount({
      name: "New User",
      type: "student",
      password: "password",
      username: "username",
    });

    expect(user.id).toBeDefined();
  });

  it("Logs in to an account", async () => {
    const user = await authService.login({
      username: "username",
      password: "password",
    });

    expect(user.id).toBeDefined();
    expect(user.token).toBeDefined();
    token = user.token;
  });

  it("Fails to login with invalid creds", async () => {
    await expectAsync(
      authService.login({
        username: "wrongusername",
        password: "notarealpassword",
      })
    ).toBeRejected();
  });

  it("Verifies a token if valid", () => {
    const user = authService.verify(token) as { id: number };
    expect(user.id).toBeDefined();
  });

  it("Fails to verify if token is invalid", () => {
    expect(() => authService.verify(token + "rubbish")).toThrow();
  });
});
