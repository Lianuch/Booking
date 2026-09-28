import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../prisma.js";
import { TokenService } from "./token.service.js";
import jwt from "jsonwebtoken";
vi.mock("../prisma.js", () => ({
  prisma: {
    token: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

const payload = (overrides = {}) => ({
  id: "1",
  email: "andrew@test.com",
  isActivated: true,
  role: "USER",
  ...overrides,
});
const existingToken = (overrides = {}) => ({
  id: "1",
  userId: "1",
  refreshToken: "refresh-token",
  ...overrides,
});

describe("TokenService", () => {
  let tokenService: TokenService;

  beforeEach(() => {
    vi.clearAllMocks();

    process.env.JWT_ACCESS_SECRET = "access-secret-key";
    process.env.JWT_REFRESH_SECRET = "refresh-secret-key";

    tokenService = new TokenService();
  });

  afterEach(() => {
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.JWT_REFRESH_SECRET;
  });

  describe("generate tokens", () => {
    it("should throw error if secret keys are not provided", () => {
      const currentPayload = payload();

      delete process.env.JWT_ACCESS_SECRET;
      delete process.env.JWT_REFRESH_SECRET;

      expect(() => tokenService.generateTokens(currentPayload)).toThrow(
        "Secrets are not defined",
      );
    });

    it("should generate tokens", () => {
      const currentPayload = payload();

      const result = tokenService.generateTokens(currentPayload);

      expect(result).toEqual({
        accessToken: expect.any(String),
        refreshToken: expect.any(String),
      });
    });
  });
  describe("save token", () => {
    it("should create token if token does not exist", async () => {
      const token = existingToken();

      vi.mocked(prisma.token.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.token.create).mockResolvedValue(token as any);

      const result = await tokenService.saveToken("1", "refresh-token");

      expect(result).toEqual(token);

      expect(prisma.token.findUnique).toHaveBeenCalledWith({
        where: { userId: "1" },
      });

      expect(prisma.token.create).toHaveBeenCalledWith({
        data: {
          userId: "1",
          refreshToken: "refresh-token",
        },
      });

      expect(prisma.token.update).not.toHaveBeenCalled();
    });
    it("should update existing token", async () => {
      const token = existingToken();
      const newRefreshToken = "new-refresh-token";

      vi.mocked(prisma.token.findUnique).mockResolvedValue(token as any);

      vi.mocked(prisma.token.update).mockResolvedValue({
        ...token,
        refreshToken: newRefreshToken,
      } as any);

      const result = await tokenService.saveToken("1", newRefreshToken);

      expect(result).toEqual({
        ...token,
        refreshToken: newRefreshToken,
      });

      expect(prisma.token.findUnique).toHaveBeenCalledWith({
        where: { userId: "1" },
      });

      expect(prisma.token.update).toHaveBeenCalledWith({
        where: { userId: "1" },
        data: {
          refreshToken: newRefreshToken,
        },
      });

      expect(prisma.token.create).not.toHaveBeenCalled();
    });
  });
  describe("remove token", () => {
    it("should remove token", async () => {
      const token = existingToken();
      vi.mocked(prisma.token.delete).mockResolvedValue(token as any);
      const result = await tokenService.removeToken("refresh-token");

      expect(result).toEqual(token);
      expect(prisma.token.delete).toHaveBeenCalledWith({
        where: { refreshToken: "refresh-token" },
      });
    });
  });
  describe("find token", () => {
    it("should find token", async () => {
      const token = existingToken();
      vi.mocked(prisma.token.findUnique).mockResolvedValue(token as any);
      const result = await tokenService.findToken("refresh-token");

      expect(result).toEqual(token);
      expect(prisma.token.findUnique).toHaveBeenCalledWith({
        where: { refreshToken: "refresh-token" },
      });
    });
  });
  describe("validate access token", () => {
    it("should return null if token is invalid", () => {
      const result = tokenService.validateAccessToken("invalid-token");
      expect(result).toBeNull();
    });
    it("should validate access token", () => {
      const currToken = existingToken();
      const token = jwt.sign(
        currToken,
        process.env.JWT_ACCESS_SECRET as string,
      );
      const result = tokenService.validateAccessToken(token);

      expect(result).toEqual(expect.objectContaining(currToken));
    });
  });
  describe("validate refresh token", () => {
    it("should return null if token is invalid", () => {
      const result = tokenService.validateRefreshToken("invalid-token");

      expect(result).toBeNull();
    });

    it("should validate refresh token", () => {
      const currToken = existingToken();

      const token = jwt.sign(
        currToken,
        process.env.JWT_REFRESH_SECRET as string,
      );

      const result = tokenService.validateRefreshToken(token);

      expect(result).toEqual(expect.objectContaining(currToken));
    });
  });
});
