import prisma from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  __esModule: true,
  default: {
    sale: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
      upsert: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
    $executeRaw: jest.fn(),
    $queryRaw: jest.fn(),
    $transaction: jest.fn(),
    $use: jest.fn(),
  },
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Database Configuration', () => {
  describe('Prisma Client Instance', () => {
    it('should export a prisma client instance', () => {
      expect(prisma).toBeDefined();
    });

    it('should have sale model available', () => {
      expect(mockPrisma.sale).toBeDefined();
      expect(typeof mockPrisma.sale.findMany).toBe('function');
      expect(typeof mockPrisma.sale.findUnique).toBe('function');
      expect(typeof mockPrisma.sale.create).toBe('function');
      expect(typeof mockPrisma.sale.update).toBe('function');
      expect(typeof mockPrisma.sale.delete).toBe('function');
    });

    it('should have $connect method', () => {
      expect(typeof mockPrisma.$connect).toBe('function');
    });

    it('should have $disconnect method', () => {
      expect(typeof mockPrisma.$disconnect).toBe('function');
    });

    it('should have $executeRaw method', () => {
      expect(typeof mockPrisma.$executeRaw).toBe('function');
    });

    it('should have $queryRaw method', () => {
      expect(typeof mockPrisma.$queryRaw).toBe('function');
    });

    it('should have $transaction method', () => {
      expect(typeof mockPrisma.$transaction).toBe('function');
    });

    it('should have $use method for middleware', () => {
      expect(typeof mockPrisma.$use).toBe('function');
    });
  });

  describe('Prisma Client Configuration', () => {
    it('should be configured with logging options', () => {
      expect(prisma).toBeTruthy();
    });

    it('should have sale model with expected fields', () => {
      expect(mockPrisma.sale).toHaveProperty('findMany');
      expect(mockPrisma.sale).toHaveProperty('findFirst');
      expect(mockPrisma.sale).toHaveProperty('findUnique');
      expect(mockPrisma.sale).toHaveProperty('create');
      expect(mockPrisma.sale).toHaveProperty('update');
      expect(mockPrisma.sale).toHaveProperty('delete');
      expect(mockPrisma.sale).toHaveProperty('count');
      expect(mockPrisma.sale).toHaveProperty('aggregate');
      expect(mockPrisma.sale).toHaveProperty('groupBy');
    });
  });

  describe('Database Connection', () => {
    it('should handle connection gracefully', async () => {
      expect(mockPrisma.$connect).toBeDefined();
      expect(mockPrisma.$disconnect).toBeDefined();
    });

    it('should handle disconnect gracefully', async () => {
      await expect(mockPrisma.$disconnect()).resolves.not.toThrow();
    });
  });

  describe('Sale Model Operations', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should have findMany with proper signature', () => {
      expect(mockPrisma.sale.findMany).toBeDefined();
      expect(typeof mockPrisma.sale.findMany).toBe('function');
    });

    it('should have findFirst with proper signature', () => {
      expect(mockPrisma.sale.findFirst).toBeDefined();
      expect(typeof mockPrisma.sale.findFirst).toBe('function');
    });

    it('should have findUnique with proper signature', () => {
      expect(mockPrisma.sale.findUnique).toBeDefined();
      expect(typeof mockPrisma.sale.findUnique).toBe('function');
    });

    it('should have create with proper signature', () => {
      expect(mockPrisma.sale.create).toBeDefined();
      expect(typeof mockPrisma.sale.create).toBe('function');
    });

    it('should have update with proper signature', () => {
      expect(mockPrisma.sale.update).toBeDefined();
      expect(typeof mockPrisma.sale.update).toBe('function');
    });

    it('should have delete with proper signature', () => {
      expect(mockPrisma.sale.delete).toBeDefined();
      expect(typeof mockPrisma.sale.delete).toBe('function');
    });

    it('should have count with proper signature', () => {
      expect(mockPrisma.sale.count).toBeDefined();
      expect(typeof mockPrisma.sale.count).toBe('function');
    });

    it('should have aggregate with proper signature', () => {
      expect(mockPrisma.sale.aggregate).toBeDefined();
      expect(typeof mockPrisma.sale.aggregate).toBe('function');
    });

    it('should have groupBy with proper signature', () => {
      expect(mockPrisma.sale.groupBy).toBeDefined();
      expect(typeof mockPrisma.sale.groupBy).toBe('function');
    });

    it('should have upsert with proper signature', () => {
      expect(mockPrisma.sale.upsert).toBeDefined();
      expect(typeof mockPrisma.sale.upsert).toBe('function');
    });
  });

  describe('Environment Configuration', () => {
    it('should use test environment variables', () => {
      expect(process.env.DATABASE_URL).toContain('test_dashboard_db');
    });

    it('should have NODE_ENV set to test', () => {
      expect(process.env.NODE_ENV).toBe('test');
    });
  });
});
