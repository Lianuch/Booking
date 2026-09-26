import { EmailService } from "../email/email.service.js";
import { TokenService } from "../token/token.service.js";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { UserService } from "./user.service.js";
import { prisma } from "../prisma.js";
import bcrypt from "bcrypt";

vi.mock("../prisma.js", () => ({
  prisma: {
    user: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn(),
    compare: vi.fn(),
  },
}));

describe("UserService", () => {
  let userService: UserService;

  const emailServiceMock = {
    sendActivationMail: vi.fn(),
    sendDeleteAccountMail: vi.fn(),
  };

  const tokenServiceMock = {
    generateTokens: vi.fn(),
    saveToken: vi.fn(),
    removeToken: vi.fn(),
    validateRefreshToken: vi.fn(),
    findToken: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();

    userService = new UserService(
      emailServiceMock as any,
      tokenServiceMock as any,
    );
  });

  const user = (overrides = {}) => ({
    id: "1",
    name: "Andrew",
    email: "andrew@test.com",
    password: "hashed-password",
    activationLink: "activation-link",
    isActivated: true,
    role: "USER",
    ...overrides,
  })

  describe("getUsers", () => {
    it("should return all users", async () => {
      const users = [
        {
          id: "1",
          name: "Andrew",
          email: "andrew@test.com",
        },
        {
          id: "2",
          name: "John",
          email: "john@test.com",
        },
      ];

      vi.mocked(prisma.user.findMany).mockResolvedValue(users as any);

      const result = await userService.getUsers();

      expect(result).toEqual(users);

      expect(prisma.user.findMany).toHaveBeenCalledOnce();
    });
  });

  describe("getUserById", () => {
    it("should return a user by id", async () => {
      const user = {
        id: "1",
        name: "Andrew",
        email: "andrew@test.com",
      };

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      const result = await userService.getUserById("1");

      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });

    it("should throw error if user does not exist", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      await expect(userService.getUserById("1")).rejects.toThrow(
        "User not found",
      );
    });
  });

  describe("registration", () => {
    it("should register a new user", async () => {
      const registerData = {
        name: "Andrew",
        email: "andrew@test.com",
        password: "password123",
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);

      const createdUser = {
        id: "1",
        name: "Andrew",
        email: "andrew@test.com",
        password: "hashed-password",
        activationLink: "activation-link",
        isActivated: false,
        role: "USER",
      };
      vi.mocked(prisma.user.create).mockResolvedValue(createdUser as any);
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };
      tokenServiceMock.generateTokens.mockReturnValue(tokens);
      tokenServiceMock.saveToken.mockResolvedValue(registerData);

      const result = await userService.registration(registerData);
      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe("andrew@test.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          name: "Andrew",
          email: "andrew@test.com",
          password: "hashed-password",
          activationLink: expect.any(String),
        },
      });
      expect(emailServiceMock.sendActivationMail).toHaveBeenCalledWith(
        "andrew@test.com",
        expect.stringContaining("/api/auth/activate/"),
      );
      expect(tokenServiceMock.generateTokens).toHaveBeenCalledOnce();
      expect(tokenServiceMock.saveToken).toHaveBeenCalledWith(
        "1",
        "refresh-token",
      );
    });
    it("should throw error if user already exists", async () => {
      const registerData = {
        name: "Andrew",
        email: "andrew@test.com",
        password: "password123",
      };
      const existingUser = {
        id: "1",
        name: "Andrew",
        email: "andrew@test.com",
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(existingUser as any);

      await expect(userService.registration(registerData)).rejects.toThrow(
        "User already exists",
      );
    });
  });

  describe("activate", () => {
    it("should activate user account", async () => {
      const user = {
        id: "1",
        name: "Andrew",
        email: "andrew@test.com",
        isActivated: false,
        activationLink: "activation-link",
      };
      vi.mocked(prisma.user.findFirst).mockResolvedValue(user as any);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...user,
        isActivated: true,
      } as any);

      await userService.activate("activation-link");

      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { activationLink: "activation-link" },
      });
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: { isActivated: true },
      });
    });
    it("should throw error if activation link is invalid", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValue(null);
      await expect(userService.activate("invalid-link")).rejects.toThrow(
        "Invalid activation link",
      );
      expect(prisma.user.update).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should throw error if user does not exist", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

      const loginData = {
        email: "andrew@test.com",
        password: "password123",
      };

      await expect(
        userService.login(loginData.email, loginData.password),
      ).rejects.toThrow("User not found");
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(tokenServiceMock.generateTokens).not.toHaveBeenCalled();
      expect(tokenServiceMock.saveToken).not.toHaveBeenCalled();
    });
    it("should throw error if user uses Google OAuth", async () => {
      const userData = {
        id: "1",
        name: "Andrew",
        email: "andrew@test.com",
        password: null,
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(userData as any);
      await expect(
        userService.login(userData.email, "password123"),
      ).rejects.toThrow("This account uses Google OAuth");
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(tokenServiceMock.generateTokens).not.toHaveBeenCalled();
      expect(tokenServiceMock.saveToken).not.toHaveBeenCalled();
    });
    it("should throw error if password is invalid", async () => {
      const user = {
        id: "1",
        name: "Andrew",
        email: "andrew@test.com",
        password: "hashed-password",
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

      await expect(
        userService.login(user.email, "wrong-password"),
      ).rejects.toThrow("Invalid password");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrong-password",
        "hashed-password",
      );
      expect(tokenServiceMock.generateTokens).not.toHaveBeenCalled();
      expect(tokenServiceMock.saveToken).not.toHaveBeenCalled();
    });
    it("should login user successfully", async () => {
      const currentUser = user();

      vi.mocked(prisma.user.findUnique).mockResolvedValue(currentUser as any);
      vi.mocked(bcrypt.compare).mockResolvedValue(true as never);
      const tokens = {
        accessToken: "access-token",
        refreshToken: "refresh-token",
      };
      tokenServiceMock.generateTokens.mockReturnValue(tokens);
      tokenServiceMock.saveToken.mockResolvedValue(undefined);

      const result = await userService.login(currentUser.email, "password123");
      expect(result.accessToken).toBe("access-token");
      expect(result.refreshToken).toBe("refresh-token");
      expect(result.user.email).toBe("andrew@test.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashed-password",
      );
      expect(tokenServiceMock.generateTokens).toHaveBeenCalledOnce();
      expect(tokenServiceMock.saveToken).toHaveBeenCalledWith(
        "1",
        "refresh-token",
      );
    });
  });

  describe("logout", () => {
    it("should remove the refresh token", async () => {
      const refreshToken = "refresh-token";
      tokenServiceMock.removeToken.mockResolvedValue(refreshToken);
      const result = await userService.logout(refreshToken);

      expect(result).toBe(refreshToken);
      expect(tokenServiceMock.removeToken).toHaveBeenCalledWith(refreshToken);
      expect(tokenServiceMock.removeToken).toHaveBeenCalledOnce();
    });
  });

  describe("refresh", () => {
    it("should throw error if refresh token is not provided", async () => {
      await expect(userService.refresh("")).rejects.toThrow(
        "User is not authorized",
      );
      expect(tokenServiceMock.findToken).not.toHaveBeenCalled();
      expect(tokenServiceMock.validateRefreshToken).not.toHaveBeenCalled();
    });

    it("should throw error if refresh token is invalid", async () => {
      const refreshToken = "invalid-refresh-token";
      tokenServiceMock.validateRefreshToken.mockReturnValue(null);

      await expect(userService.refresh(refreshToken)).rejects.toThrow(
        "User is not authorized",
      );
      expect(tokenServiceMock.findToken).toHaveBeenCalledWith(refreshToken);
      expect(tokenServiceMock.validateRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
    });

    it("should throw error if refresh token is not found", async () => {
      const refreshToken = "refresh-token";
      tokenServiceMock.validateRefreshToken.mockReturnValue({ id: "1" });
      tokenServiceMock.findToken.mockResolvedValue(null);

      await expect(userService.refresh(refreshToken)).rejects.toThrow(
        "User is not authorized",
      );
      expect(tokenServiceMock.findToken).toHaveBeenCalledWith(refreshToken);
      expect(tokenServiceMock.validateRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
    });
    it("should refresh tokens successfully", async () => {
      const refreshToken = "refresh-token";
      const user = {
        id: "1",
        name: "Andrew",
        email: "andrew@test.com",
        password: "hashed-password",
        activationLink: "activation-link",
        isActivated: true,
        role: "USER",
      };
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      tokenServiceMock.validateRefreshToken.mockReturnValue({ id: "1" });
      tokenServiceMock.findToken.mockResolvedValue({
        id: "1",
        refreshToken: "refresh-token",
        userId: "1",
      } as any);
      const tokens = {
        accessToken: "new-access-token",
        refreshToken: "new-refresh-token",
      };

      tokenServiceMock.generateTokens.mockReturnValue(tokens);
      tokenServiceMock.saveToken.mockResolvedValue(undefined);

      const result = await userService.refresh(refreshToken);

      expect(result.accessToken).toBe("new-access-token");
      expect(result.refreshToken).toBe("new-refresh-token");
      expect(result.user.email).toBe("andrew@test.com");

      expect(tokenServiceMock.validateRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(tokenServiceMock.findToken).toHaveBeenCalledWith(refreshToken);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(tokenServiceMock.generateTokens).toHaveBeenCalledOnce();
      expect(tokenServiceMock.saveToken).toHaveBeenCalledWith(
        "1",
        "new-refresh-token",
      );
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      const currentUser = user();;
     
      vi.mocked(prisma.user.findUnique).mockResolvedValue(currentUser as any);
      emailServiceMock.sendDeleteAccountMail.mockResolvedValue(undefined);
      vi.mocked(prisma.user.delete).mockResolvedValue(currentUser as any);
      const result = await userService.deleteUser("1");

      expect(result).toBe(currentUser);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(emailServiceMock.sendDeleteAccountMail).toHaveBeenCalledWith(
        "andrew@test.com",
      );
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
    });
  });
  describe("updateUser", () => {
    it("should throw error if user does not exist", async () => {
      vi.mocked(prisma.user.findUnique).mockResolvedValue(null);
      await expect(userService.updateUser("1", {})).rejects.toThrow(
        "User not found",
      );

      expect(prisma.user.update).not.toHaveBeenCalled();
      expect(bcrypt.hash).not.toHaveBeenCalled();
    });

    it("should update user without hashing password", async () => {
 
      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(prisma.user.update).mockResolvedValue({
        ...user,
        name: "John",
      } as any);

      const result = await userService.updateUser("1", {
        name: "John",
        email: "andrew@test.com",
      });

      expect(result.name).toBe("John");
      expect(bcrypt.hash).not.toHaveBeenCalled();

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "John",
          email: "andrew@test.com",
        },
      });
    });

    it("should update user successfully", async () => {

      vi.mocked(prisma.user.findUnique).mockResolvedValue(user as any);
      vi.mocked(bcrypt.hash).mockResolvedValue("hashed-password" as never);
      vi.mocked(prisma.user.update).mockResolvedValue(user as any);

      const result = await userService.updateUser("1", {
        name: "Andrew",
        email: "andrew@test.com",
        password: "password123",
      });

      expect(result).toEqual(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          name: "Andrew",
          email: "andrew@test.com",
          password: "hashed-password",
        },
      });
    });
  });
});
